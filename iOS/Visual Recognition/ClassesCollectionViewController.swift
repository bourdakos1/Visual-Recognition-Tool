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

class ClassesCollectionViewController: UICollectionViewController, UICollectionViewDelegateFlowLayout {
    
    var classifier = PendingClassifier()
    var images = [UIImage]()
    var classes = [PendingClass]()

    override func viewDidLoad() {
        super.viewDidLoad()
        title = classifier.name!
        
        classes = []
        for result in classifier.relationship?.allObjects as! [PendingClass] {
            classes.append(result)
        }
        grabPhotos(classes.count)
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
            cell.classImageImageView.image = images[indexPath.item]
            cell.classImageImageView.layer.cornerRadius = 5
            cell.classImageImageView.clipsToBounds = true
            cell.classNameLabel.text = classes[indexPath.item].name
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

    func grabPhotos(_ amount: Int) {
        var limit = amount
        if limit == 0 {
            limit = 1
        }
        
        let imgManager = PHImageManager.default()
        
        let requestOptions = PHImageRequestOptions()
        requestOptions.isSynchronous = true
        requestOptions.deliveryMode = .highQualityFormat
        
        let fetchOptions = PHFetchOptions()
        fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
        fetchOptions.fetchLimit = limit
        
        let width = (collectionView?.frame.width)! / 2 - 10
        
        let fetchResult = PHAsset.fetchAssets(with: .image, options: fetchOptions)
        if fetchResult.count > 0 {
            for i in 0..<fetchResult.count {
                imgManager.requestImage(for: fetchResult.object(at: i), targetSize: CGSize(width: width, height: width), contentMode: .aspectFill, options: requestOptions) { image, error in
                    self.images.append(image!)
                }
            }
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if  segue.identifier == "showImages",
            let destination = segue.destination as? ImagesCollectionViewController,
            let index = collectionView?.indexPathsForSelectedItems?.first?.item {
            destination.pendingClass = classes[index]
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
            
            let pendingClassClassName:String  = String(describing: PendingClass.self)
            
            let pendingClass:PendingClass = NSEntityDescription.insertNewObject(forEntityName: pendingClassClassName, into: DatabaseController.getContext()) as! PendingClass
            
            pendingClass.name = textfield.text!
            
            self.classifier.addToRelationship(pendingClass)
            
            self.classes.append(pendingClass)
            self.grabPhotos(self.classes.count)
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
}
