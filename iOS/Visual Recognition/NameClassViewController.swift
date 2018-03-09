//
//  NameClassViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 7/23/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import CoreData

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
        
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow), name: .UIKeyboardWillShow, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillHide), name: NSNotification.Name.UIKeyboardWillHide, object: nil)
    }
    
    @objc func keyboardWillShow(notification: NSNotification) {
        if let keyboardFrame: NSValue = notification.userInfo?[UIKeyboardFrameEndUserInfoKey] as? NSValue {
            let keyboardRectangle = keyboardFrame.cgRectValue
            let keyboardHeight = keyboardRectangle.height
            print("keyboard height: \(keyboardHeight)")
            if view.frame.size.height != UIWindow().frame.size.height - keyboardHeight {
                view.frame.size.height = UIWindow().frame.size.height - keyboardHeight
                
                // Uuuhh no idea why I need to do this...?
                container.frame.size.height = 0
                
                if let tv = childViewControllers[0] as? ThumbCollectionViewController {
                    tv.viewWillAppear(true)
                }
            }
        }
    }
    
    @objc func keyboardWillHide(notification: NSNotification) {
        if view.frame.size.height != UIWindow().frame.size.height {
            view.frame.size.height = UIWindow().frame.size.height
            
            // Uuuhh no idea why I need to do this...?
            container.frame.size.height = 0
            
            if let tv = childViewControllers[0] as? ThumbCollectionViewController {
                tv.viewWillAppear(true)
            }
        }
    }
    
    @IBAction func next(sender: UIBarButtonItem) {
        guard let classCount = classifier.relationship?.count else {
            return
        }
        if classCount >= 2 {
            print("ask to train")
            self.performSegue(withIdentifier: "askToTrain", sender: self)
        } else {
            print("add second class")
            self.performSegue(withIdentifier: "newClass", sender: self)
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if  segue.identifier == "showEmbededCollection",
            let destination = segue.destination as? ThumbCollectionViewController {
            destination.pendingClass = pendingClass
            destination.classifier = classifier
        }
        
        if  segue.identifier == "newClass",
            let destination = segue.destination as? SnapperViewController {
            
            let pendingClassClassName: String = String(describing: PendingClass.self)
            
            let newPendingClass: PendingClass = NSEntityDescription.insertNewObject(forEntityName: pendingClassClassName, into: DatabaseController.getContext()) as! PendingClass
            
            newPendingClass.id = UUID().uuidString
            newPendingClass.name = String()
            newPendingClass.created = Date()
            
            classifier.addToRelationship(newPendingClass)
            
            // Save the class name.
            pendingClass.name = textField.text
            
            DatabaseController.saveContext()
            destination.pendingClass = newPendingClass
            destination.classifier = classifier
        }
        
        if  segue.identifier == "askToTrain",
            let destination = segue.destination as? TrainViewController {
            
            // Save the class name.
            pendingClass.name = textField.text
            
            DatabaseController.saveContext()
            destination.classifier = classifier
        }
    }
}
