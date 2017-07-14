//
//  SnapperViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 7/14/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import AVFoundation
import Photos

class SnapperViewController: CameraViewController {
    var classifier = PendingClassifier()
    var pendingClass = PendingClass()
    
    @IBOutlet var thumbnail: UIView!
    @IBOutlet var thumbnailImage: UIImageView!
    @IBOutlet weak var width: NSLayoutConstraint!
    @IBOutlet weak var height: NSLayoutConstraint!
    
    // MARK: View Controller Life Cycle
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        // load the thumbnail of images.
        // This needs to happen in view did appear so it loads in the right spot.
        let border = UIView()
        let frame = CGRect(x: self.thumbnailImage.frame.origin.x - 1.0, y: self.thumbnailImage.frame.origin.y - 1.0, width: self.thumbnailImage.frame.size.height + 2.0, height: self.thumbnailImage.frame.size.height + 2.0)
        border.backgroundColor = UIColor(red: 0.0, green: 0.0, blue: 0.0, alpha: 0.25)
        border.frame = frame
        border.layer.cornerRadius = 7.0
        self.view.insertSubview(border, belowSubview: self.thumbnailImage)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.thumbnailImage.layer.cornerRadius = 5.0
        
        grabPhoto()
    }
    
    func grabPhoto() {
        let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        
        do {
            // Get the directory contents urls (including subfolders urls)
            let directoryContents = try FileManager.default.contentsOfDirectory(at: documentsUrl.appendingPathComponent(classifier.id!).appendingPathComponent(pendingClass.name!), includingPropertiesForKeys: nil, options: [])
            
            // if you want to filter the directory contents you can do like this:
            let jpgFile = directoryContents.filter{ $0.pathExtension == "jpg" }
                .map { url -> (URL, TimeInterval) in
                    var lastModified = try? url.resourceValues(forKeys: [URLResourceKey.contentModificationDateKey])
                    return (url, lastModified?.contentModificationDate?.timeIntervalSinceReferenceDate ?? 0)
                }
                .sorted(by: { $0.1 > $1.1 }) // sort descending modification dates
                .map{ $0.0 }.first!
            
            thumbnailImage.image = UIImage(contentsOfFile: jpgFile.path)!
            
        } catch {
            print(error.localizedDescription)
        }
    }
    
    override func captured(image: UIImage) {
        DispatchQueue.main.async { [unowned self] in
            self.width.constant = 5
            self.height.constant = 5
            self.thumbnailImage.image = image
            self.view.layoutIfNeeded()
            self.width.constant = 60
            self.height.constant = 60
            UIView.animate(withDuration: 0.3, delay: 0.0, options: [.curveEaseOut], animations: { () -> Void in
                self.thumbnailImage.alpha = 1.0
            }, completion: nil)
            UIView.animate(withDuration: 0.3, delay: 0.0, options: [.curveEaseOut], animations: { () -> Void in
                self.view.layoutIfNeeded()
            }, completion: nil)
        }
        
        let reducedImage = image.resized(toWidth: 300)!
        
        let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        
        let path = documentsUrl.appendingPathComponent(self.classifier.id!).appendingPathComponent(self.pendingClass.name!)
        
        do {
            try FileManager.default.createDirectory(atPath: path.path, withIntermediateDirectories: true, attributes: nil)
        } catch {
            print(error.localizedDescription)
        }
        
        let filename = path.appendingPathComponent("\(NSUUID().uuidString).jpg")
        
        do {
            try UIImageJPEGRepresentation(reducedImage, 0.4)!.write(to: filename)
        } catch {
            print(error.localizedDescription)
        }
    }
}

