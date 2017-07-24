//
//  ImagesCollectionViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 5/12/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import Photos

class ImagesCollectionViewController: UICollectionViewController, UICollectionViewDelegateFlowLayout {
    
    var classifier = PendingClassifier()
    var pendingClass = PendingClass()
    var classes = [ClassObj]()
    var images = [UIImage]()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        title = pendingClass.name!
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        navigationController?.toolbar.isHidden = false
        
        images = []
        grabPhotos()
        reloadData()
    }
    
    override func numberOfSections(in collectionView: UICollectionView) -> Int {
        return 1
    }
    
    override func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return images.count
    }
    
    override func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "imageCell", for: indexPath)
        (cell.viewWithTag(1) as! UIImageView).image = images[indexPath.item]

        return cell
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        let width = collectionView.frame.width / 4 - CGFloat(2/UIScreen.main.scale)
        
        return CGSize(width: width, height: width)
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumLineSpacingForSectionAt section: Int) -> CGFloat {
        return CGFloat(2/UIScreen.main.scale)
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumInteritemSpacingForSectionAt section: Int) -> CGFloat {
        return CGFloat(2/UIScreen.main.scale)
    }
    
    func grabPhotos() {
        let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        
        do {
            // Get the directory contents urls (including subfolders urls)
            let directoryContents = try FileManager.default.contentsOfDirectory(at: documentsUrl.appendingPathComponent(classifier.id!).appendingPathComponent(pendingClass.id!), includingPropertiesForKeys: nil, options: [])
            
            // if you want to filter the directory contents you can do like this:
            let jpgFiles = directoryContents.filter{ $0.pathExtension == "jpg" }
                .map { url -> (URL, TimeInterval) in
                    var lastModified = try? url.resourceValues(forKeys: [URLResourceKey.contentModificationDateKey])
                    return (url, lastModified?.contentModificationDate?.timeIntervalSinceReferenceDate ?? 0)
                }
                .sorted(by: { $0.1 > $1.1 }) // sort descending modification dates
                .map{ $0.0 }
            
            for file in jpgFiles {
                images.append(UIImage(contentsOfFile: file.path)!)
            }
        } catch {
            print(error.localizedDescription)
        }
    }
    
    @IBOutlet weak var trainButton: UIBarButtonItem!
    @IBOutlet weak var editButton: UIBarButtonItem!
    
    func reloadData() {
        if classes.count >= 2 {
            trainButton.isEnabled = true
        } else {
            trainButton.isEnabled = false
        }
        
        editButton.isEnabled = !(images.count <= 0)
        
        if UserDefaults.standard.string(forKey: "api_key") == nil {
            trainButton.isEnabled = false
        }
        
        collectionView?.reloadData()
    }
    
    @IBAction func train() {
        print("train")
        // Show an activity indicator while its loading.
        let alert = UIAlertController(title: nil, message: "Please wait...", preferredStyle: .alert)
        
        alert.view.tintColor = UIColor.black
        let loadingIndicator: UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRect(x: 10, y: 5, width: 50, height: 50)) as UIActivityIndicatorView
        loadingIndicator.hidesWhenStopped = true
        loadingIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.gray
        loadingIndicator.startAnimating()
        
        alert.view.addSubview(loadingIndicator)
        present(alert, animated: true, completion: nil)
        
        classifier.train(completion: { response in
            self.dismiss(animated: false, completion: nil)
            // Pop back to the classifiers page.
            let viewControllers: [UIViewController] = self.navigationController!.viewControllers as [UIViewController]
            for viewController: UIViewController in viewControllers {
                if viewController.isKind(of: ClassifiersTableViewController.self) {
                    _ = self.navigationController?.popToViewController(viewController, animated: true)
                }
            }
            debugPrint(response)
        })
    }

    @IBAction func unwindToImages(segue: UIStoryboardSegue) {
        // Unwind
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if  segue.identifier == "showSnapper",
            let destination = segue.destination as? SnapperViewController {
            destination.pendingClass = pendingClass
            destination.classifier = classifier
        }
    }
    
    override var previewActionItems: [UIPreviewActionItem] {
        
        let likeAction = UIPreviewAction(title: "Rename", style: .default) { (action, viewController) -> Void in
            // Rename.
        }
        
        let deleteAction = UIPreviewAction(title: "Delete", style: .destructive) { (action, viewController) -> Void in
            // Delete.
        }
        
        return [likeAction, deleteAction]
        
    }
}
