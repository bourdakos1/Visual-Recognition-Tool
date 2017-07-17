//
//  RoundedButton.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 3/20/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit

class RoundedButton: UIButton {
    @IBInspectable
    public var isSolid: Bool = true
    
    let color = UIColor(red: 255/255, green: 255/255, blue: 255/255, alpha: 1)
    
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Ok button default
        UIGraphicsBeginImageContextWithOptions(rect.size, false, 0.0)
        if isSolid {
            color.setFill()
            UIRectFill(rect)
        }
        let enabledImage: UIImage = UIGraphicsGetImageFromCurrentImageContext()!
        UIGraphicsEndImageContext()
        
        self.setBackgroundImage(enabledImage, for: .normal)
        self.layer.borderWidth = 1.0
        
        self.layer.borderColor = color.cgColor
        
        self.layer.cornerRadius = rect.height / 2
        self.clipsToBounds = true
        
        if !isEnabled {
            self.alpha = 0.45
        } else {
            self.alpha = 1.0
        }
    }
    
    override var isEnabled: Bool {
        didSet {
            if !isEnabled {
                self.alpha = 0.45
            } else {
                self.alpha = 1.0
            }
        }
    }
}
