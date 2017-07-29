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

struct ClassObj {
    var pendingClass: PendingClass
    var image: UIImage
    var imageCount: Int
}

class ClassesCollectionViewController: UICollectionViewController, UICollectionViewDelegateFlowLayout {
    
    var classifier = PendingClassifier()
    var classes = [ClassObj]()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        
        do {
            // Get the directory contents urls (including subfolders urls)
            let directoryContents = try FileManager.default.contentsOfDirectory(at: documentsUrl.appendingPathComponent(classifier.id!), includingPropertiesForKeys: nil, options: [])
            
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
        
        let epoch = Date().addingTimeInterval(0 - Date().timeIntervalSince1970)
        classes = classes.sorted(by: { $0.pendingClass.created ?? epoch < $1.pendingClass.created ?? epoch })
        
        reloadData()
    }
    
    func reloadData() {
        collectionView?.reloadData()
    }
    
    func insertItem() {
        collectionView?.insertItems(at: [IndexPath(row: classes.count - 1, section: 0)])
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
            
            cell.classImageImageView.layer.borderColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.15).cgColor
            cell.classImageImageView.layer.borderWidth = 1.0 / UIScreen.main.scale
            
            cell.classNameLabel.text = classes[indexPath.item].pendingClass.name
            cell.classImageCountLabel.text = String(describing: classes[indexPath.item].imageCount)
            return cell
        } else {
            let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "newClassCell", for: indexPath)
            cell.viewWithTag(1)?.layer.cornerRadius = 5
            cell.viewWithTag(1)?.clipsToBounds = true
            cell.viewWithTag(1)?.layer.borderColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.15).cgColor
            cell.viewWithTag(1)?.layer.borderWidth = 1.0 / UIScreen.main.scale
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
        return UIEdgeInsetsMake(CGFloat(70.0), CGFloat(20.0), CGFloat(70.0), CGFloat(20.0))
    }
    
    func grabPhoto(for pendingClass: PendingClass) -> ClassObj {
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
    
    @IBAction func createClass() {
        let classNames = self.classes.map{ $0.pendingClass.name! }
        
        let basename = "Untitled"
        var name = basename
        var count = 1
        
        while classNames.contains(name) {
            count += 1
            name = "\(basename)-\(count)"
        }
        
        let pendingClassClassName: String = String(describing: PendingClass.self)
        
        let pendingClass: PendingClass = NSEntityDescription.insertNewObject(forEntityName: pendingClassClassName, into: DatabaseController.getContext()) as! PendingClass
        
        pendingClass.name = name
        pendingClass.id = UUID().uuidString
        pendingClass.created = Date()
        
        self.classifier.addToRelationship(pendingClass)
        
        self.classes.append(self.grabPhoto(for: pendingClass))
        
        self.insertItem()
        
        DatabaseController.saveContext()
    }
}
