//
//  FramedImageView.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 7/5/18.
//  Copyright © 2018 Nicholas Bourdakos. All rights reserved.
//

import UIKit

class FramedImageView: UIImageView {
    
    var images = [UIImage]() {
        didSet {
            
            let size = frame.size
            
            if images.count < 4 && images.count > 0 {
                
                UIGraphicsBeginImageContextWithOptions(size, true, UIScreen.main.scale)
                
                let area0 = CGRect(x: 0, y: 0, width: size.width, height: size.height)
                cropToBounds(image: images[0], width: size.width / 2, height: size.height / 2).draw(in: area0)
                
                let newImage = UIGraphicsGetImageFromCurrentImageContext()!
                UIGraphicsEndImageContext()
                
                image = newImage
                
            } else if images.count >= 4 {
                
                UIGraphicsBeginImageContextWithOptions(size, true, UIScreen.main.scale)
                
                let area0 = CGRect(x: 0, y: 0, width: size.width / 2, height: size.height / 2)
                let area1 = CGRect(x: size.width / 2, y: 0, width: size.width / 2, height: size.height / 2)
                let area2 = CGRect(x: 0, y:size.height / 2, width: size.width / 2, height: size.height / 2)
                let area3 = CGRect(x: size.width / 2, y: size.height / 2, width: size.width / 2, height: size.height / 2)
                cropToBounds(image: images[0], width: size.width / 2, height: size.height / 2).draw(in: area0)
                cropToBounds(image: images[1], width: size.width / 2, height: size.height / 2).draw(in: area1)
                cropToBounds(image: images[2], width: size.width / 2, height: size.height / 2).draw(in: area2)
                cropToBounds(image: images[3], width: size.width / 2, height: size.height / 2).draw(in: area3)
                
                let newImage = UIGraphicsGetImageFromCurrentImageContext()!
                UIGraphicsEndImageContext()
                
                image = newImage
                
            } else {
                image = nil
            }
        }
    }
    
    func cropToBounds(image: UIImage, width: CGFloat, height: CGFloat) -> UIImage {
        
        let cgimage = image.cgImage!
        let contextImage: UIImage = UIImage(cgImage: cgimage)
        let contextSize: CGSize = contextImage.size
        var posX: CGFloat = 0.0
        var posY: CGFloat = 0.0
        var cgwidth: CGFloat = CGFloat(width)
        var cgheight: CGFloat = CGFloat(height)
        
        // See what size is longer and create the center off of that
        if contextSize.width > contextSize.height {
            posX = ((contextSize.width - contextSize.height) / 2)
            posY = 0
            cgwidth = contextSize.height
            cgheight = contextSize.height
        } else {
            posX = 0
            posY = ((contextSize.height - contextSize.width) / 2)
            cgwidth = contextSize.width
            cgheight = contextSize.width
        }
        
        let rect: CGRect = CGRect(x: posX, y: posY, width: cgwidth, height: cgheight)
        
        // Create bitmap image from context using the rect
        let imageRef: CGImage = cgimage.cropping(to: rect)!
        
        // Create a new image based on the imageRef and rotate back to the original orientation
        let image: UIImage = UIImage(cgImage: imageRef, scale: image.scale, orientation: image.imageOrientation)
        
        return image
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        backgroundColor = UIColor(red: 249/255, green: 249/255, blue: 249/255, alpha: 1)
        
        layer.cornerRadius = 5
        clipsToBounds = true
        
        layer.borderColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.15).cgColor
        layer.borderWidth = 1.0 / UIScreen.main.scale
    }
}
