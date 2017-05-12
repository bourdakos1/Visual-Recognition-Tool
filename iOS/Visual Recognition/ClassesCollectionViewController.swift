//
//  ClassesCollectionViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 5/12/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import Photos

class ClassesCollectionViewController: UICollectionViewController, UICollectionViewDelegateFlowLayout {
    
    var classifier = PendingClassifier()
    var classes = [UIImage]()

    override func viewDidLoad() {
        super.viewDidLoad()
        title = classifier.name!
        grabPhotos()
    }

    override func numberOfSections(in collectionView: UICollectionView) -> Int {
        return 1
    }

    override func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return classes.count + 1
    }

    override func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell: UICollectionViewCell
        if indexPath.item < classes.count {
            cell = collectionView.dequeueReusableCell(withReuseIdentifier: "classCell", for: indexPath)
            (cell.viewWithTag(1) as! UIImageView).image = classes[indexPath.item]
            cell.viewWithTag(1)?.layer.cornerRadius = 5
            cell.viewWithTag(1)?.clipsToBounds = true
            let height = (cell.viewWithTag(2)?.frame.height)!
            print(height)
        } else {
            cell = collectionView.dequeueReusableCell(withReuseIdentifier: "newClassCell", for: indexPath)
        }
        return cell
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

    func grabPhotos() {
        let imgManager = PHImageManager.default()
        
        let requestOptions = PHImageRequestOptions()
        requestOptions.isSynchronous = true
        requestOptions.deliveryMode = .highQualityFormat
        
        let fetchOptions = PHFetchOptions()
        fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
        fetchOptions.fetchLimit = 6
        
        let width = (collectionView?.frame.width)! / 2 - 10
        
        let fetchResult = PHAsset.fetchAssets(with: .image, options: fetchOptions)
        if fetchResult.count > 0 {
            for i in 0..<fetchResult.count {
                imgManager.requestImage(for: fetchResult.object(at: i), targetSize: CGSize(width: width, height: width), contentMode: .aspectFill, options: requestOptions) { image, error in
                    self.classes.append(image!)
                }
            }
        }
    }
}
