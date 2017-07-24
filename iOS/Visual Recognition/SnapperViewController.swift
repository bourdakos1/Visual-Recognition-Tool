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
    
    @IBOutlet var nextButton: UIButton!
    @IBOutlet var infoLabel: UITextView!
    
    @IBOutlet var numLabel: UILabel!
    @IBOutlet var numLabelView: UIView!
    
    // MARK: View Controller Life Cycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        thumbnailImage.layer.cornerRadius = 5.0
        infoLabel.layer.cornerRadius = 5.0
        infoLabel.clipsToBounds = true
        
        infoLabel.textContainerInset = UIEdgeInsetsMake(20, 20, 20, 20)
        
        numLabelView.layer.cornerRadius = 12.0
        numLabelView.clipsToBounds = true
        numLabelView.isHidden = true
        numLabel.isHidden = true
        
        grabPhoto()
    }
    
    func grabPhoto() {
        let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        
        do {
            // Get the directory contents urls (including subfolders urls)
            let directoryContents = try FileManager.default.contentsOfDirectory(at: documentsUrl.appendingPathComponent(classifier.id!).appendingPathComponent(pendingClass.id!), includingPropertiesForKeys: nil, options: [])
            
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
    
    var images = [UIImageView]()
    override func captured(image: UIImage) {
        DispatchQueue.main.async { [unowned self] in
            let newImageView = UIImageView()
            self.images.append(newImageView)
            
            // Show bar
            if self.images.count == 1 {
                let border = UIView()
                let frame = CGRect(x: self.thumbnail.frame.origin.x - 1.0, y: self.thumbnail.frame.origin.y - 1.0, width: self.thumbnail.frame.size.width + 2.0, height: self.thumbnail.frame.size.height + 2.0)
                border.backgroundColor = UIColor(red: 0.0, green: 0.0, blue: 0.0, alpha: 0.25)
                border.frame = frame
                border.layer.cornerRadius = 7.0
                self.view.insertSubview(border, belowSubview: self.thumbnail)
            }
            
            self.numLabelView.isHidden = false
            self.numLabel.isHidden = false
            self.numLabel.text = String(self.images.count)
            self.infoLabel.isHidden = true
            
            if self.images.count >= 10 {
                self.nextButton.isEnabled = true
            } else {
                self.nextButton.isEnabled = false
            }
            
            if self.images.count <= 10 {
                newImageView.contentMode = .scaleAspectFill
                newImageView.frame = self.thumbnailImage.frame
                newImageView.frame.origin.x = newImageView.frame.origin.x + (((self.thumbnail.frame.width - 1) / 10 + 1) * CGFloat(self.images.count - 1)) - CGFloat(self.images.count - 1)
                newImageView.frame.size.height = 50
                newImageView.frame.size.width = self.thumbnail.frame.width / 20
                self.view.insertSubview(newImageView, aboveSubview: self.thumbnail)
                newImageView.image = image
                
                if self.images.count == 1 {
                    let rect = CGRect(x: 0, y: 0, width: self.thumbnail.frame.width / 10 + 1, height: 60)
                    let maskPath = UIBezierPath(roundedRect: rect, byRoundingCorners: [.topLeft, .bottomLeft, .topRight, .bottomRight], cornerRadii: CGSize(width: 5.0, height: 5.0))
                    
                    let shape = CAShapeLayer()
                    shape.path = maskPath.cgPath
                    self.images[0].layer.mask = shape
                    
                    let frameLayer = CAShapeLayer()
                    frameLayer.path = maskPath.cgPath
                    frameLayer.lineWidth = 1.0
                    frameLayer.strokeColor = UIColor(red: 1, green: 1, blue: 1, alpha: 0.6).cgColor
                    frameLayer.fillColor = nil
                    if let layers = self.images[0].layer.sublayers {
                        for layer in layers {
                            layer.removeFromSuperlayer()
                        }
                    }
                    self.images[0].layer.addSublayer(frameLayer)
                } else {
                    let rect = CGRect(x: 0, y: 0, width: self.thumbnail.frame.width / 10 + 1, height: 60)
                    
                    for thingy in self.images {
                        self.images.last!.layer.mask = nil
                        let maskPath = UIBezierPath(roundedRect: rect, byRoundingCorners: [], cornerRadii: CGSize(width: 5.0, height: 5.0))
                        
                        let shape = CAShapeLayer()
                        shape.path = maskPath.cgPath
                        thingy.layer.mask = shape
                        
                        let frameLayer = CAShapeLayer()
                        frameLayer.path = maskPath.cgPath
                        frameLayer.lineWidth = 1.0
                        frameLayer.strokeColor = UIColor(red: 1, green: 1, blue: 1, alpha: 0.6).cgColor
                        frameLayer.fillColor = nil
                        
                        if let layers = thingy.layer.sublayers {
                            for layer in layers {
                                layer.removeFromSuperlayer()
                            }
                        }
                        thingy.layer.addSublayer(frameLayer)
                    }
                    
                    let maskPath = UIBezierPath(roundedRect: rect, byRoundingCorners: [.topLeft, .bottomLeft], cornerRadii: CGSize(width: 5.0, height: 5.0))
                    
                    let shape = CAShapeLayer()
                    shape.path = maskPath.cgPath
                    self.images[0].layer.mask = shape
                    
                    let frameLayer = CAShapeLayer()
                    frameLayer.path = maskPath.cgPath
                    frameLayer.lineWidth = 1.0
                    frameLayer.strokeColor = UIColor(red: 1, green: 1, blue: 1, alpha: 0.6).cgColor
                    frameLayer.fillColor = nil
                    if let layers = self.images[0].layer.sublayers {
                        for layer in layers {
                            layer.removeFromSuperlayer()
                        }
                    }
                    self.images[0].layer.addSublayer(frameLayer)
                    
                    let maskPath2 = UIBezierPath(roundedRect: rect, byRoundingCorners: [.topRight, .bottomRight], cornerRadii: CGSize(width: 5.0, height: 5.0))
                    
                    let shape2 = CAShapeLayer()
                    shape2.path = maskPath2.cgPath
                    self.images.last!.layer.mask = shape2
                    
                    let frameLayer2 = CAShapeLayer()
                    frameLayer2.path = maskPath2.cgPath
                    frameLayer2.lineWidth = 1.0
                    frameLayer2.strokeColor = UIColor(red: 1, green: 1, blue: 1, alpha: 0.6).cgColor
                    frameLayer2.fillColor = nil
                    if let layers = self.images.last!.layer.sublayers {
                        for layer in layers {
                            layer.removeFromSuperlayer()
                        }
                    }
                    self.images.last!.layer.addSublayer(frameLayer2)
                }
                
                UIView.animate(withDuration: 0.3, delay: 0.0, options: [.curveEaseOut], animations: { () -> Void in
                    newImageView.frame.size.width = self.thumbnail.frame.width / 10 + 1
                    newImageView.frame.size.height = 60
                    newImageView.alpha = 1.0
                }, completion: nil)
            }
        }
        
        let reducedImage = image.resized(toWidth: 300)!
        
        let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        
        let path = documentsUrl.appendingPathComponent(self.classifier.id!).appendingPathComponent(self.pendingClass.id!)
        
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
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if  segue.identifier == "showNameClass",
            let destination = segue.destination as? NameClassViewController {
            destination.pendingClass = pendingClass
            destination.classifier = classifier
        }
    }
}

