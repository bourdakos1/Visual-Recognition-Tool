//
//  TrainViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 7/24/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import CoreData

class TrainViewController: UIViewController {
    var classifier = PendingClassifier()

    @IBAction func train() {
        print("train")
        // Show an activity indicator while its loading.
        let alert = UIAlertController(title: nil, message: "Please wait...", preferredStyle: .alert)
        
        alert.view.tintColor = UIColor.black
        let loadingIndicator: UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRect(x: 10, y: 5, width: 50, height: 50)) as UIActivityIndicatorView
        loadingIndicator.hidesWhenStopped = true
        loadingIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.gray
        loadingIndicator.startAnimating()
        
        alert.view.addSubview(loadingIndicator)
        present(alert, animated: true, completion: nil)
        classifier.train(completion: { response in
            self.dismiss(animated: false, completion: nil)
            self.performSegue(withIdentifier: "unwindToClassifiersFromTrain", sender: self)
            print(response)
        })
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if  segue.identifier == "additionalClasses",
            let destination = segue.destination as? SnapperViewController {
            
            let pendingClassClassName: String = String(describing: PendingClass.self)
            
            let newPendingClass: PendingClass = NSEntityDescription.insertNewObject(forEntityName: pendingClassClassName, into: DatabaseController.getContext()) as! PendingClass
            
            newPendingClass.id = UUID().uuidString
            newPendingClass.name = String()
            newPendingClass.created = Date()
            
            classifier.addToRelationship(newPendingClass)
            
            DatabaseController.saveContext()
            destination.pendingClass = newPendingClass
            destination.classifier = classifier
        }
    }

}
