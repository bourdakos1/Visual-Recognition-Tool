//
//  CustomToolbar.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 7/8/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit

class CustomToolbar: UIToolbar {
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupToolbar()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupToolbar()
    }
    
    private func setupToolbar() {
        let color = UIColor(red: 187/255, green: 198/255, blue: 206/255, alpha: 1.0)
        let image = getImage(color: color, size: CGSize(width: 1.0, height: 1.0/UIScreen.main.scale))
        self.setShadowImage(image, forToolbarPosition: .bottom)
    }
    
    func getImage(color: UIColor, size: CGSize) -> UIImage {
        let rect = CGRect(origin: CGPoint(x: 0, y: 0), size: CGSize(width: size.width, height: size.height))
        UIGraphicsBeginImageContextWithOptions(size, false, 0)
        color.setFill()
        UIRectFill(rect)
        let image: UIImage = UIGraphicsGetImageFromCurrentImageContext()!
        UIGraphicsEndImageContext()
        return image
    }
    
    override func sizeThatFits(_ size: CGSize) -> CGSize {
        
        var newSize: CGSize = super.sizeThatFits(size)
        newSize.height = 52
        
        return newSize
    }
    
}
