//
//  ImagesCollectionViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 5/12/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import Photos
import Zip
import Alamofire

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
            let directoryContents = try FileManager.default.contentsOfDirectory(at: documentsUrl.appendingPathComponent(classifier.id!).appendingPathComponent(pendingClass.name!), includingPropertiesForKeys: nil, options: [])
            
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
        do {
            let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!.appendingPathComponent(classifier.id!)
            
            var paths = [URL]()
            
            for result in classifier.relationship?.allObjects as! [PendingClass] {
                let destination = documentsUrl.appendingPathComponent(result.name!).appendingPathExtension("zip")
                
                paths.append(destination)
                
                if FileManager.default.fileExists(atPath: destination.path) {
                    print("Exists, deleting")
                    // Exist so delete first and then try.
                    do {
                        try FileManager.default.removeItem(at: destination)
                    } catch {
                        print("Error: \(error.localizedDescription)")
                        if FileManager.default.fileExists(atPath: destination.path) {
                            print("still exists")
                        }
                    }
                }
                
                // Make sure it's actually gone...
                if !FileManager.default.fileExists(atPath: destination.path) {
                    try Zip.zipFiles(paths: [documentsUrl.appendingPathComponent(result.name!)], zipFilePath: destination, password: nil, progress: { progress in
                        print("Zipping: \(progress)")
                    })
                }
            }
            
            let url = URL(string: "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers")!
            
            let urlRequest = URLRequest(url: url)
            
            let parameters: Parameters = [
                "api_key": UserDefaults.standard.string(forKey: "api_key")!,
                "version": "2016-05-20",
                ]
            
            let encodedURLRequest = try URLEncoding.queryString.encode(urlRequest, with: parameters)
            
            Alamofire.upload(
                multipartFormData: { multipartFormData in
                    for path in paths {
                        multipartFormData.append(
                            path,
                            withName: "\((path.pathComponents.last! as NSString).deletingPathExtension)_positive_examples"
                        )
                    }
                    multipartFormData.append(self.classifier.name!.data(using: .utf8, allowLossyConversion: false)!, withName :"name")
            },
                to: encodedURLRequest.url!,
                encodingCompletion: { encodingResult in
                    switch encodingResult {
                    case .success(let upload, _, _):
                        upload.responseJSON { response in
                            self.dismiss(animated: false, completion: nil)
                            self.navigationController?.popViewController(animated: true)
                            debugPrint(response)
                        }
                        upload.uploadProgress(closure: { //Get Progress
                            progress in
                            print(progress.fractionCompleted)
                        })
                    case .failure(let encodingError):
                        print(encodingError)
                    }
            })
        }
        catch {
            print(error)
        }
    }

    @IBAction func unwindToImages(segue: UIStoryboardSegue) {
        // Unwind
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if  segue.identifier == "showSnapper",
            let destination = segue.destination as? CameraViewController {
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
