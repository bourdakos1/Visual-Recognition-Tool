//
//  DropboxViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 6/20/18.
//  Copyright © 2018 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import SwiftyDropbox
import VisualRecognitionV3

class DropboxViewController: UIViewController {
    
    let visualRecognition: VisualRecognition = {
        guard let path = Bundle.main.path(forResource: "Keys", ofType: "plist") else {
            // Please create a Credentials.plist file with your Visual Recognition credentials.
            fatalError()
        }
        guard let apiKey = NSDictionary(contentsOfFile: path)?["VISION_API_KEY"] as? String else {
            // No Visual Recognition API key found. Make sure you add your API key to the Credentials.plist file.
            fatalError()
        }
        return VisualRecognition(apiKey: apiKey, version: VisualRecognitionConstants.version)
    }()
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        let client = DropboxClientsManager.authorizedClient
                
        if client == nil,
            let viewController = storyboard?.instantiateViewController(withIdentifier: "dropboxLoginViewController"),
            let dropboxLoginViewController = viewController as? DropboxLoginViewController {
            present(dropboxLoginViewController, animated: true, completion: nil)
        }
    }
    
    @IBAction func train() {
        // I don't want a global authorizedClient.
        guard let authorizedClient = DropboxClientsManager.authorizedClient else {
            return
        }
        
        // Download to URL
        let fileManager = FileManager.default
        let directoryURL = fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
        
        var errors = false
        var classes = [PositiveExample]()
        let dispatchGroup = DispatchGroup()
        
        dispatchGroup.enter()
        
        // Hard code the connectors path for now.
        authorizedClient.files.listFolder(path: "/connectors")
            .response { response, error in
                if let response = response {
                    
                    for entry in response.entries {
                        // Should probably check if this is a directory first.
                        
                        guard let path = entry.pathLower else {
                            return
                        }
                        
                        // Entry name includes the extension, but this is a directory so it shouldn't have one
                        let destURL = directoryURL.appendingPathComponent(entry.name).appendingPathExtension("zip")
                        classes.append(PositiveExample(name: entry.name, examples: destURL))
                        let destination: (URL, HTTPURLResponse) -> URL = { temporaryURL, response in
                            return destURL
                        }
                        
                        dispatchGroup.enter()
                        
                        // Download each subfolder as a zip file.
                        authorizedClient.files.downloadZip(path: path, overwrite: true, destination: destination)
                            .response { response, error in
                                dispatchGroup.leave()
                                if let response = response {
                                    print(response)
                                } else if let error = error {
                                    errors = true
                                    print(error)
                                }
                            }
                            .progress { progressData in
                                print(progressData)
                        }
                    }
                    
                } else if let error = error {
                    errors = true
                    print(error)
                }
                
                dispatchGroup.leave()
        }
        
        dispatchGroup.notify(queue: .main) {
            print(errors ? "errors" : "no errors")
            print("Finished all requests.")
            print(classes)
            self.visualRecognition.createClassifier(name: "Connectors", positiveExamples: classes, failure: { error in
                print(error)
            }, success: { classifier in
                print(classifier)
            })
            
            for positiveExample in classes {
                do {
                    try fileManager.removeItem(at: positiveExample.examples)
                } catch {
                    print(error)
                }
            }
        }
        
    }
    
}
