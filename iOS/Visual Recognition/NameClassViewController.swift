//
//  NameClassViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 7/23/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit

class NameClassViewController: UIViewController {
    var classifier = PendingClassifier()
    var pendingClass = PendingClass()
    
    @IBOutlet var container: UIView!
    @IBOutlet var textField: UITextField!
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        textField.becomeFirstResponder()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        container.layer.cornerRadius = 17
        container.clipsToBounds = true
        
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow), name: NSNotification.Name.UIKeyboardWillShow, object: nil)
    }
    
    func keyboardWillShow(notification: NSNotification) {
        if let keyboardFrame: NSValue = notification.userInfo?[UIKeyboardFrameEndUserInfoKey] as? NSValue {
            let keyboardRectangle = keyboardFrame.cgRectValue
            let keyboardHeight = keyboardRectangle.height
            print("keyboard height: \(keyboardHeight)")
            if view.frame.size.height == UIWindow().frame.size.height {
                view.frame.size.height -= keyboardHeight
                
                // Uuuhh no idea why I need to do this...?
                container.frame.size.height = 0
                
                if let tv = childViewControllers[0] as? ThumbCollectionViewController {
                    tv.viewWillAppear(true)
                }
            }
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if  segue.identifier == "showEmbededCollection",
            let destination = segue.destination as? ThumbCollectionViewController {
            destination.pendingClass = pendingClass
            destination.classifier = classifier
        }
    }
}
