//
//  ModelVersionsTableViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 6/26/18.
//  Copyright © 2018 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import SwiftyDropbox
import VisualRecognitionV3

class ModelVersionsTableViewController: UITableViewController {
    
    var modelMetadata: Files.Metadata?
    var versions = [String]()
    var modelDbEntry = [String: Any]()
    
    var modelId = String()
    
    let cloudantURL = NSURL(string:"https://29947a2d-939d-4e00-83f9-2ca5b5bfa392-bluemix:fb14ea5f4359c32dea4bc009014d9083a17d26c47ae8da25945c30aab3c5d55a@29947a2d-939d-4e00-83f9-2ca5b5bfa392-bluemix.cloudant.com")!
    lazy var client = {
        CouchDBClient(url: cloudantURL as URL, username: "29947a2d-939d-4e00-83f9-2ca5b5bfa392-bluemix", password: "fb14ea5f4359c32dea4bc009014d9083a17d26c47ae8da25945c30aab3c5d55a")
    }()
    
    let dbName = "watson-visual-recognition"
    
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

    override func viewDidLoad() {
        super.viewDidLoad()
//        navigationItem.title = modelMetadata?.name ?? ""
        
        tableView.estimatedRowHeight = 80
        tableView.rowHeight = UITableViewAutomaticDimension
        
        navigationItem.rightBarButtonItems?.first?.isEnabled = false
        
        tableView.tableFooterView = UIView()
        
        // TO SHARE THE MODEL ID.
//        let fileName = "myFileName.txt"
//        var filePath = ""
//
//        // Fine documents directory on device
//        let dirs : [String] = NSSearchPathForDirectoriesInDomains(.documentDirectory, .allDomainsMask, true)
//
//        if dirs.count > 0 {
//            let dir = dirs[0] //documents directory
//            filePath = dir.appending("/" + fileName)
//            print("Local path = \(filePath)")
//        } else {
//            print("Could not find local directory to store file")
//            return
//        }
//
//        // Set the contents
//        let fileContentToWrite = "ModelID: AABTc43f6fy4luXuXPNTEVed4Ar_yIF1HuYqK7i2zisVIUAAAAAAAB6cQ"
//
//        do {
//            // Write contents to file
//            try fileContentToWrite.write(toFile: filePath, atomically: false, encoding: .utf8)
//        }
//        catch let error as NSError {
//            print("An error took place: \(error)")
//        }
//
//        let fileURL = URL(fileURLWithPath: filePath)
//
//        // set up activity view controller
//        let textToShare = [ fileURL ]
//        let activityViewController = UIActivityViewController(activityItems: textToShare, applicationActivities: nil)
//        activityViewController.popoverPresentationController?.sourceView = self.view // so that iPads won't crash
//
//        // present the view controller
//        self.present(activityViewController, animated: true, completion: nil)
    }
    
    func populateVersionList() {
        // I don't want a global authorizedClient. but why?
        guard let authorizedClient = DropboxClientsManager.authorizedClient else {
            return
        }
        
        guard let folderPath = modelMetadata as? Files.FolderMetadata else {
            return
        }
        
        authorizedClient.users.getCurrentAccount()
            .response { response, error in
                guard let response = response else {
                    return
                }
                let index = response.accountId.index(response.accountId.startIndex, offsetBy: 5)
                let index2 = folderPath.id.index(folderPath.id.startIndex, offsetBy: 3)
                
                self.modelId = String(response.accountId[index...] + folderPath.id[index2...])
                
                self.navigationItem.rightBarButtonItems?.first?.isEnabled = true
                
                
                let selector = [ "_id": self.modelId ]

                let find = FindDocumentsOperation(selector: selector, databaseName: self.dbName, documentFoundHandler: { (document) in

                    // Do something with the document.
                    self.modelDbEntry = document
                    self.versions = document["classifier_ids"] as! [String]

                    DispatchQueue.main.async {
                        self.tableView.reloadData()
                    }
                }) { (response, httpInfo, error) in
                    if let error = error {
                        print(error)
                    } else {
                        print("yay")
                    }
                }
                self.client.add(operation: find)
        }
        
        let dispatchGroup = DispatchGroup()
        
        dispatchGroup.enter()
        
        authorizedClient.files.listFolder(path: folderPath.pathLower!)
            .response { response, error in
                guard let response = response else {
                    dispatchGroup.leave()
                    return
                }
                
                for entry in response.entries {
                    dispatchGroup.enter()
                    authorizedClient.files.listFolder(path: entry.pathLower!)
                        .response { response, error in
                            guard let response = response else {
                                dispatchGroup.leave()
                                return
                            }
                            let fileManager = FileManager.default
                            let directoryURL = fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
                            let destURL = directoryURL.appendingPathComponent((response.entries.first?.name)!)
                            let destination: (URL, HTTPURLResponse) -> URL = { temporaryURL, response in
                                return destURL
                            }
                            dispatchGroup.enter()
                            
                            authorizedClient.files.download(path: (response.entries.first?.pathLower)!, overwrite: true, destination: destination)
                                .response { response, error in
                                    guard let response = response else {
                                        dispatchGroup.leave()
                                        return
                                    }
                                
                                    let path = directoryURL.appendingPathComponent(response.0.name)
                                    print(path.absoluteString)
                                    self.shitake.append(UIImage(contentsOfFile: path.relativePath)!)
                                    print("1")
                                    dispatchGroup.leave()
                                    
                            }
                            dispatchGroup.leave()
                    }
                }
                
                dispatchGroup.leave()
        }
        
        dispatchGroup.notify(queue: .main) {
            print("W00P")
            self.tableView.reloadRows(at: [IndexPath(row: 0, section: 0)], with: .automatic)
        }
    }
    
    var shitake = [UIImage]()
    
    override func viewDidAppear(_ animated: Bool) {
        populateVersionList()
        
//        visualRecognition.listClassifiers { (classifiers) in
//            var idSelector = [[String: String]]()
//
//            for classifier in classifiers.classifiers {
//                idSelector.append(["$eq": classifier.classifierID])
//            }
//
//            let selector = [
//                "classifier_ids": [
//                    "$elemMatch": [
//                        "$or": idSelector
//                    ]
//                ],
//                "url": self.modelMetadata?.pathLower ?? ""
//            ] as [String : Any]
//
//            let fields = ["_id", "classifier_ids", "url"]
//
//            let find = FindDocumentsOperation(selector: selector, databaseName: self.dbName, fields: fields, documentFoundHandler: { (document) in
//                // Do something with the document.
//                let classifierIds = document["classifier_ids"] as! [String]
//                print(classifierIds)
//
//                self.modelDbEntry = document
//                print(self.modelDbEntry)
//
//                self.versions = classifierIds
//                DispatchQueue.main.async {
//                    self.tableView.reloadData()
//                }
//            }) { (response, httpInfo, error) in
//                if let error = error {
//                    // handle the error.
//                    print(error)
//                } else {
//                    // do something on success.
//                    print("yay")
//                }
//            }
//            self.client.add(operation: find)
//        }
    }

    @IBAction func trainModel() {
        UIApplication.shared.isIdleTimerDisabled = true
        SwiftSpinner.show("Processing Images")
        // I don't want a global authorizedClient.
        guard let authorizedClient = DropboxClientsManager.authorizedClient,
            let path = modelMetadata?.pathLower,
            let name = modelMetadata?.name else {
                UIApplication.shared.isIdleTimerDisabled = false
                SwiftSpinner.hide()
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
        authorizedClient.files.listFolder(path: path)
            .response { response, error in
                if let response = response {
                    
                    for entry in response.entries {
                        // Should probably check if this is a directory first.
                        
                        guard let path = entry.pathLower else {
                            UIApplication.shared.isIdleTimerDisabled = false
                            SwiftSpinner.hide()
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
            
            SwiftSpinner.hide() {
                SwiftSpinner.show("Creating Model")
            }
            
            self.visualRecognition.createClassifier(name: name, positiveExamples: classes, failure: { error in
                DispatchQueue.main.async {
                    UIApplication.shared.isIdleTimerDisabled = false
                    SwiftSpinner.hide()
                    self.showAlert("Fail", alertMessage: "Nick, you probably have a `-` in the name...")
                    print(error)
                }
            }, success: { classifier in
                print(classifier)
                
                let getDocumentOp = GetDocumentOperation(id: self.modelId, databaseName: self.dbName) { (response, httpInfo, error) in
                    if let error = error {
                        // handle the error.
                        print(error)
                        let classifierIds = [classifier.classifierID]
                        
                        let body: [String: Any] = [
                            "classifier_ids": classifierIds,
                            "url": path
                        ]
                        
                        let putDocumentOp = PutDocumentOperation(id: self.modelId, body: body, databaseName: self.dbName) { (response, httpInfo, error) in
                            
                            if let error = error {
                                // handle the error.
                                UIApplication.shared.isIdleTimerDisabled = false
                                SwiftSpinner.hide()
                                print(error)
                            } else {
                                // do something on success.
                                print("document added successfully")
                                UIApplication.shared.isIdleTimerDisabled = false
                                SwiftSpinner.hide()
                                self.showAlert("Success", alertMessage: "We did it!")
                            }
                        }
                        self.client.add(operation: putDocumentOp)
                    } else {
                        // do something on success.
                        print("document got successfully")
                        
                        
                        var classifierIds = response!["classifier_ids"] as! [String]
                        
                        classifierIds.append(classifier.classifierID)
                        
                        let body: [String: Any] = [
                            "classifier_ids": classifierIds,
                            "url": path
                        ]
                        
                        let id = response!["_id"] as! String
                        let rev = response!["_rev"] as! String
                        
                        let putDocumentOp = PutDocumentOperation(id: id, revision: rev, body: body, databaseName: self.dbName) { (response, httpInfo, error) in

                            if let error = error {
                                // handle the error.
                                UIApplication.shared.isIdleTimerDisabled = false
                                SwiftSpinner.hide()
                                print(error)
                            } else {
                                // do something on success.
                                print("document added successfully")
                                UIApplication.shared.isIdleTimerDisabled = false
                                SwiftSpinner.hide()
                                self.showAlert("Success", alertMessage: "We did it!")
                            }
                        }
                        self.client.add(operation: putDocumentOp)
                    }
                }
                self.client.add(operation: getDocumentOp)
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
    
    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return versions.count + 2 // for buttons + title
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        var cell = UITableViewCell()
        print("im cellin around")
        
        if indexPath.row == 0 {
            cell = tableView.dequeueReusableCell(withIdentifier: "titleCell", for: indexPath)
            print("firsty!")
            if let cell = cell as? HeaderTableViewCell {
                print("head")
                cell.thumbnails.images = shitake
            }
            
        } else if indexPath.row == 1 {
            cell = tableView.dequeueReusableCell(withIdentifier: "buttonCell", for: indexPath)
        } else {
            cell = tableView.dequeueReusableCell(withIdentifier: "versionCell", for: indexPath)
            
            if let cell = cell as? ModelVersionTableViewCell {
                cell.classifierNameLabel.text = versions[indexPath.row - 2]
                cell.activityIndicator.isHidden = true
                cell.leftPadding.constant = 0
                cell.classifierStatusEmoji.text = ""
            }
        }
        return cell
    }

    /*
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to: IndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}

// MARK: - Error Handling

extension ModelVersionsTableViewController {
    func showAlert(_ alertTitle: String, alertMessage: String) {
        let alert = UIAlertController(title: alertTitle, message: alertMessage, preferredStyle: UIAlertControllerStyle.alert)
        alert.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.default, handler: nil))
        self.present(alert, animated: true, completion: nil)
    }
}
