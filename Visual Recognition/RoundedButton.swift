//
//  RoundedButton.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 3/20/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit

class RoundedButton: UIButton {
    let color = UIColor(red: 143/255, green: 51/255, blue: 255/255, alpha: 1)
    
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        
        print("RECT: \(rect)")
        // Ok button default
        UIGraphicsBeginImageContextWithOptions(rect.size, false, 0.0)
        color.setFill()
        UIRectFill(rect)
        let enabledImage: UIImage = UIGraphicsGetImageFromCurrentImageContext()!
        UIGraphicsEndImageContext()
        
        // Ok button dissabled
        UIGraphicsBeginImageContextWithOptions(rect.size, false, 0.0)
        UIColor(red: 0, green: 0, blue: 0, alpha: 0.45).setStroke()
        let dissabledImage: UIImage = UIGraphicsGetImageFromCurrentImageContext()!
        UIGraphicsEndImageContext()
        
        self.setBackgroundImage(enabledImage, for: .normal)
        self.setBackgroundImage(dissabledImage, for: .disabled)
        self.layer.borderWidth = 1.0
        
        self.layer.borderColor = color.cgColor
        
        // TODO: Something is wrong here... I have to hard code it for it to work
        self.layer.cornerRadius = 24
        self.clipsToBounds = true
    }
    
    override var isEnabled: Bool {
        didSet {
            if isEnabled {
                self.layer.borderColor = color.cgColor
            } else {
                self.layer.borderColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.45).cgColor
            }
        }
    }
}
