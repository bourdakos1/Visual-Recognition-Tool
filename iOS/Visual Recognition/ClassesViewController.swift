//
//  ViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 7/28/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit

class ClassesViewController: UIViewController {
    
    var classifier = PendingClassifier()

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "embedClasses",
            let destination = segue.destination as? ClassesCollectionViewController {
            destination.classifier = classifier
        }
    }
}
