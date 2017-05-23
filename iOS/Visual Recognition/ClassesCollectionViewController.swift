//
//  ClassesCollectionViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 5/12/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import Photos
import CoreData
import Zip
import Alamofire

class ClassesCollectionViewController: UICollectionViewController, UICollectionViewDelegateFlowLayout {
    
    struct ClassObj {
        var pendingClass: PendingClass
        var image: UIImage
        var imageCount: Int
    }
    
    var classifier = PendingClassifier()
    var classes = [ClassObj]()

    override func viewDidLoad() {
        super.viewDidLoad()
        title = classifier.name!
        
        let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        
        do {
            // Get the directory contents urls (including subfolders urls)
            let directoryContents = try FileManager.default.contentsOfDirectory(at: documentsUrl.appendingPathComponent(classifier.name!), includingPropertiesForKeys: nil, options: [])
            
            let files = directoryContents.map{ $0.pathComponents.last! }
            
            print(files)
            
        } catch {
            print(error.localizedDescription)
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.toolbar.isHidden = false
        
        classes = []
        for result in classifier.relationship?.allObjects as! [PendingClass] {
            classes.append(grabPhoto(for: result))
        }
        collectionView?.reloadData()
    }

    override func numberOfSections(in collectionView: UICollectionView) -> Int {
        return 1
    }

    override func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return classes.count + 1
    }

    override func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        if indexPath.item < classes.count {
            let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "classCell", for: indexPath) as! ClassCollectionViewCell
            if classes[indexPath.item].imageCount > 0 {
                cell.classImageImageView.image = classes[indexPath.item].image
            } else {
                cell.classImageImageView.backgroundColor = UIColor(red: 249/255, green: 249/255, blue: 249/255, alpha: 1)
                cell.classImageImageView.image = nil
            }
            cell.classImageImageView.layer.cornerRadius = 5
            cell.classImageImageView.clipsToBounds = true
            cell.classNameLabel.text = classes[indexPath.item].pendingClass.name
            cell.classImageCountLabel.text = String(describing: classes[indexPath.item].imageCount)
            return cell
        } else {
            let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "newClassCell", for: indexPath)
            cell.viewWithTag(1)?.layer.cornerRadius = 5
            cell.viewWithTag(1)?.clipsToBounds = true
            return cell
        }
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        let width = (collectionView.frame.width - 40) / 2 - 10

        return CGSize(width: width, height: width + 50)
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumLineSpacingForSectionAt section: Int) -> CGFloat {
        return CGFloat(10.0)
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumInteritemSpacingForSectionAt section: Int) -> CGFloat {
        return CGFloat(10.0)
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, insetForSectionAt section: Int) -> UIEdgeInsets {
        return UIEdgeInsetsMake(CGFloat(20.0), CGFloat(20.0), CGFloat(20.0), CGFloat(20.0))
    }
    
    func grabPhoto(for pendingClass: PendingClass) -> ClassObj {
        let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        
        do {
            // Get the directory contents urls (including subfolders urls)
            let directoryContents = try FileManager.default.contentsOfDirectory(at: documentsUrl.appendingPathComponent(classifier.name!).appendingPathComponent(pendingClass.name!), includingPropertiesForKeys: nil, options: [])
            
            // if you want to filter the directory contents you can do like this:
            let jpgFiles = directoryContents.filter{ $0.pathExtension == "jpg" }
                .map { url -> (URL, TimeInterval) in
                    var lastModified = try? url.resourceValues(forKeys: [URLResourceKey.contentModificationDateKey])
                    return (url, lastModified?.contentModificationDate?.timeIntervalSinceReferenceDate ?? 0)
                }
                .sorted(by: { $0.1 > $1.1 }) // sort descending modification dates
                .map{ $0.0 }
            
            return ClassObj(
                pendingClass: pendingClass,
                image: UIImage(contentsOfFile: jpgFiles.first!.path)!,
                imageCount: jpgFiles.count
            )
            
        } catch {
            print(error.localizedDescription)
        }
        return ClassObj(pendingClass: pendingClass, image: UIImage(), imageCount: 0)
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if  segue.identifier == "showImages",
            let destination = segue.destination as? ImagesCollectionViewController,
            let index = collectionView?.indexPathsForSelectedItems?.first?.item {
            destination.pendingClass = classes[index].pendingClass
            destination.classifier = classifier
        }
    }
    
    func handleTextDidChange(_ sender:UITextField) {
        // Enforce a minimum length of >= 1 for secure text alerts.
        AddAlertSaveAction!.isEnabled = (sender.text?.utf16.count)! >= 1
    }
    
    weak var AddAlertSaveAction: UIAlertAction?
    
    @IBAction func createClass() {
        let alert = UIAlertController(title: "New Class", message: "Enter a name for this class.", preferredStyle: .alert)
        
        alert.addTextField(configurationHandler: {(textField: UITextField) in
            textField.placeholder = "Title"
            textField.addTarget(self, action: #selector(self.handleTextDidChange(_:)), for: .editingChanged)
        })
        
        // Create the actions.
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel) { action in
            print("cancel")
        }
        
        let saveAction = UIAlertAction(title: "Save", style: .default) { action in
            let textfield = alert.textFields!.first!
            print("saving: \(textfield.text!)")
            
            let classNames = self.classes.map{ $0.pendingClass.name! }
            
            if classNames.contains(textfield.text!) {
                let error = UIAlertController(title: "Class Already Exists", message: "Please choose a different name.", preferredStyle: .alert)
                
                let dismiss = UIAlertAction(title: "Dismiss", style: .cancel) { action in
                    
                }
                
                error.addAction(dismiss)
                
                self.present(error, animated: true, completion: nil)
                return
            }
            
            let pendingClassClassName: String = String(describing: PendingClass.self)
            
            let pendingClass: PendingClass = NSEntityDescription.insertNewObject(forEntityName: pendingClassClassName, into: DatabaseController.getContext()) as! PendingClass
            
            pendingClass.name = textfield.text!
            
            self.classifier.addToRelationship(pendingClass)

            self.classes.append(self.grabPhoto(for: pendingClass))
            
            self.collectionView?.reloadData()
            
            DatabaseController.saveContext()
        }
        
        // disable the 'save' button initially
        saveAction.isEnabled = false
        
        // save the save action to toggle the enabled/disabled state when the text changed.
        AddAlertSaveAction = saveAction
        
        // Add the actions.
        alert.addAction(cancelAction)
        alert.addAction(saveAction)
        
        present(alert, animated: true, completion: nil)
    }
    
    @IBAction func train() {
        print("train")
        do {
            let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!.appendingPathComponent(classifier.name!)
            
            var paths = [URL]()
            
            for result in classifier.relationship?.allObjects as! [PendingClass] {
                let destination = documentsUrl.appendingPathComponent(result.name!).appendingPathExtension("zip")
                
                paths.append(destination)
                
                if FileManager.default.fileExists(atPath: destination.path) {
                    print("File already exists")
                } else {
                    try Zip.zipFiles(paths: [documentsUrl.appendingPathComponent(result.name!)], zipFilePath: destination, password: nil, progress: { progress in
                        print(progress)
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
}
