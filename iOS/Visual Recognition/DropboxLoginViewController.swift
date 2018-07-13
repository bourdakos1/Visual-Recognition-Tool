//
//  DropboxLoginViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 6/20/18.
//  Copyright © 2018 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import SwiftyDropbox

class DropboxLoginViewController: UIViewController {
    
    @IBAction func authorize() {
        DropboxClientsManager.authorizeFromController(.shared, controller: self, openURL: { (url: URL) -> Void in
            UIApplication.shared.open(url, options: [:], completionHandler: { (Bool) -> Void in
            })
        })
    }
    
}
