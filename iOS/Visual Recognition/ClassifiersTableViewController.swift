//
//  ClassifiersTableViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 3/20/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import CoreData
import Alamofire

class ClassifiersTableViewController: UITableViewController {
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .default
    }
    
    let VISION_API_KEY: String
    
    var pending = [PendingClassifier]()
    
    var classifiers = [Classifier]()
    
    required init?(coder aDecoder: NSCoder) {
        var keys: NSDictionary?
        
        if let path = Bundle.main.path(forResource: "Keys", ofType: "plist") {
            keys = NSDictionary(contentsOfFile: path)
        }
        
        VISION_API_KEY = (keys?["VISION_API_KEY"] as? String)!
        
        super.init(coder: aDecoder)
    }

    weak var AddAlertSaveAction: UIAlertAction?
    
    @IBAction func createClassifier() {
        let alert = UIAlertController(title: "New Classifier", message: "Enter a name for this classifier.", preferredStyle: .alert)
        
        alert.addTextField(configurationHandler: {(textField: UITextField) in
            textField.placeholder = "Title"
            textField.addTarget(self, action: #selector(self.handleTextDidChange(_:)), for: .editingChanged)
        })
        
        // Create the actions.
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel) { action in
            print("cancel")
        }
        
        let saveAction = UIAlertAction(title: "Save", style: .default) { action in
            let textfield = alert.textFields!.first!
            print("saving: \(textfield.text!)")
            let pendingClassifierClassName:String  = String(describing: PendingClassifier.self)
    
            let pendingClassifier:PendingClassifier = NSEntityDescription.insertNewObject(forEntityName: pendingClassifierClassName, into: DatabaseController.getContext()) as! PendingClassifier
            pendingClassifier.id = UUID().uuidString
            pendingClassifier.name = textfield.text!
            
            self.pending.insert(pendingClassifier, at: 0)
            if self.tableView.numberOfSections == 2 {
                self.tableView.insertRows(at: [IndexPath(row: 0, section: 0)], with: .automatic)
            } else {
                self.tableView.beginUpdates()
                self.tableView.insertSections([0], with: .automatic)
                self.tableView.insertRows(at: [IndexPath(row: 0, section: 0)], with: .automatic)
                self.tableView.endUpdates()
            }
            
            DatabaseController.saveContext()
        }
        
        // disable the 'save' button initially
        saveAction.isEnabled = false
        
        // save the save action to toggle the enabled/disabled state when the text changed.
        AddAlertSaveAction = saveAction
        
        // Add the actions.
        alert.addAction(cancelAction)
        alert.addAction(saveAction)
        
        present(alert, animated: true, completion: nil)
    }
    
    func handleTextDidChange(_ sender:UITextField) {
        // Enforce a minimum length of >= 1 for secure text alerts.
        AddAlertSaveAction!.isEnabled = (sender.text?.utf16.count)! >= 1
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        self.navigationController?.toolbar.isHidden = true
        v.removeFromSuperview()
    }
    
    var isLoading = false
    func loadClassifiers() {
        print("loading classifiers")
        // Load from Watson
        let apiKey = UserDefaults.standard.string(forKey: "api_key")
        
        if apiKey == nil || apiKey == "" {
            classifiers = []
            classifiers.append(Classifier(name: "Default"))
            // This should be okay.
            tableView.reloadData()
            refreshControl?.endRefreshing()
            return
        }
        
        // Let's not show the loading indicator.
        
        let url = "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers"
        let params = [
            "api_key": apiKey!,
            "version": "2016-05-20",
            "verbose": "true"
        ]
        if self.isLoading {
            // We are loading something already so escape.
            return
        }
        isLoading = true
        Alamofire.request(url, parameters: params).validate().responseJSON { response in
            self.isLoading = false
            print("done")
            self.refreshControl?.endRefreshing()
            switch response.result {
            case .success:
                if let json = response.result.value as? [String : Any] {
                    if let classifiersJSON = json["classifiers"] as? [Any] {
                        
                        // Build classifiers from json.
                        var classifiers = [Classifier]()
                        for classifierJSON in classifiersJSON {
                            let classifier = Classifier(json: classifierJSON)!
                            classifiers.append(classifier)
                        }
                        
                        classifiers = classifiers.sorted(by: { $0.created > $1.created })
                        classifiers.append(contentsOf: Classifier.defaults)
                        
                        // Don't know if this is thread safe. We could do this better...
                        let training = classifiers.filter({ $0.status == .training || $0.status == .training })
                        if training.count > 0 {
                            self.reloadClassifiers()
                        } else {
                            self.classifiers = classifiers
                            self.tableView.reloadData()
                            // We can return here because we reload the entire table.
                            return
                        }
                        
                        // If the count and head are the same nothing was deleted or added.
                        if !(self.classifiers.first!.isEqual(classifiers.first!)
                            && self.classifiers.count == classifiers.count) {
                            
                            // Instead of blindly reloading the entire list, we should use insert/remove row.
                            var indexesToAdd = [IndexPath]()
                            for classifier in classifiers {
                                if !self.classifiers.contains(where: { $0.isEqual(classifier) }) {
                                    indexesToAdd.append(IndexPath(row: indexesToAdd.count, section: self.tableView.numberOfSections - 1))
                                }
                            }
                            
                            var indexesToDelete = [IndexPath]()
                            for classifier in self.classifiers {
                                if !classifiers.contains(where: { $0.isEqual(classifier)}) {
                                    let itemToDelete = self.classifiers.index(where: {$0.classifierId == classifier.classifierId})!
                                    indexesToDelete.append(IndexPath(row: itemToDelete, section: self.tableView.numberOfSections - 1))
                                }
                            }
                            
                            self.classifiers = classifiers
                            self.tableView.beginUpdates()
                            self.tableView.insertRows(at: indexesToAdd, with: .automatic)
                            self.tableView.deleteRows(at: indexesToDelete, with: .automatic)
                            self.tableView.endUpdates()
                        }
                    }
                }
            case .failure(let error):
                print(error)
            }
        }
    }
    
    func reloadClassifiers() {
        DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(4), execute: {
            self.loadClassifiers()
        })
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewDidAppear(false)
        v.removeFromSuperview()
    }
    
    let v = UIView(frame: CGRect(x: 0, y: -64, width: 500, height: 64))
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        loadClassifiers()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        refreshControl?.addTarget(self, action: #selector(self.loadClassifiers), for: .valueChanged)
        
        v.backgroundColor = UIColor.white
        tableView.addSubview(v)
        tableView.bringSubview(toFront: v)
        
        tableView.estimatedRowHeight = 85.0
        tableView.rowHeight = UITableViewAutomaticDimension
        
        
        let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        
        do {
            // Get the directory contents urls (including subfolders urls)
            let directoryContents = try FileManager.default.contentsOfDirectory(at: documentsUrl, includingPropertiesForKeys: nil, options: [])
            
            let files = directoryContents.map{ $0.pathComponents.last! }
            
            print(files)
            
        } catch {
            print(error.localizedDescription)
        }
        
        
        // This doesn't need reloaded everytime we show the page
        let fetchRequest:NSFetchRequest<PendingClassifier> = PendingClassifier.fetchRequest()
        
        do {
            let searchResults = try DatabaseController.getContext().fetch(fetchRequest)
            pending = []
            for result in searchResults as [PendingClassifier] {
                pending.append(result)
            }
        }
        catch {
            print("Error: \(error)")
        }
    }

    override func numberOfSections(in tableView: UITableView) -> Int {
        if pending.count <= 0 {
            return 1
        }
        // There should always be at least 1 classifier.
        return 2
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if tableView.numberOfSections > 1 && section == 0 {
            return pending.count
        } else {
            return classifiers.count
        }
    }
    
    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        if tableView.numberOfSections > 1 && section == 0 {
            return "🏋️‍♀️ training data"
        } else {
            return "🚀 trained"
        }
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if tableView.numberOfSections > 1 && indexPath.section == 0 {
            let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
            
            cell.textLabel?.text = pending[indexPath.item].name!
            
            return cell
        } else {
            let cell = tableView.dequeueReusableCell(withIdentifier: "cell2", for: indexPath) as! ClassiferTableViewCell
            
            let classifierData = classifiers[indexPath.item]
            
            cell.classifierNameLabel?.text = classifierData.name
            cell.classifierIdLabel?.text = classifierData.classifierId
            
            switch classifierData.status {
            case .ready:
                cell.classifierStatusEmoji?.text = ""
            case .training, .retraining:
                cell.classifierStatusEmoji?.text = "😴"
                cell.classifierIdLabel?.text = classifierData.status.rawValue
            case .failed:
                cell.classifierStatusEmoji?.text = "😭"
                cell.classifierIdLabel?.text = "Verify there are at least 10 images per class."
            }
            
            if classifierData.status == .ready {
                cell.classifierNameLabel?.alpha = 1.0
                cell.classifierIdLabel?.alpha = 1.0
                cell.activityIndicator?.stopAnimating()
                cell.activityIndicator?.isHidden = true
            } else if classifierData.status == .training || classifierData.status == .retraining {
                cell.classifierNameLabel?.alpha = 0.4
                cell.classifierIdLabel?.alpha = 0.4
                cell.activityIndicator?.startAnimating()
                cell.activityIndicator?.isHidden = false
            } else {
                cell.classifierNameLabel?.alpha = 0.4
                cell.classifierIdLabel?.alpha = 0.4
                cell.activityIndicator?.stopAnimating()
                cell.activityIndicator?.isHidden = true
            }
            
            if classifierData.classifierId == String() && classifierData.name == "Loading..." {
                cell.activityIndicator?.startAnimating()
                cell.activityIndicator?.isHidden = false
                
                cell.classifierNameLabel?.text = String()
                cell.classifierIdLabel?.text = "Loading..."
            }
            
            cell.tapAction = { (cell) in
                let optionMenu = UIAlertController(title: nil, message: nil, preferredStyle: .actionSheet)
                
                
                let apiAction = UIAlertAction(title: "API Reference", style: .default, handler: {
                    (alert: UIAlertAction!) -> Void in
                    print("API Reference")
                })
                
                let updateAction = UIAlertAction(title: "Update", style: .default, handler: {
                    (alert: UIAlertAction!) -> Void in
                    print("Update")
                })
                
                let deleteAction = UIAlertAction(title: "Delete", style: .destructive, handler: {
                    (alert: UIAlertAction!) -> Void in
                    print("Delete")
                })
                
                let cancelAction = UIAlertAction(title: "Cancel", style: .cancel, handler: {
                    (alert: UIAlertAction!) -> Void in
                    print("Cancel")
                })
                
                optionMenu.addAction(apiAction)
                optionMenu.addAction(updateAction)
                optionMenu.addAction(deleteAction)
                optionMenu.addAction(cancelAction)
                
                self.present(optionMenu, animated: true, completion: nil)
            }
            
            let classifierId = UserDefaults.standard.string(forKey: "classifier_id")
            
            if classifierId != nil {
                // If the classifierId == String() that means its empty.
                if classifierData.classifierId == String() && classifierData.name == classifierId {
                    cell.checkmark?.isHidden = false
                } else if classifierData.classifierId == classifierId {
                    cell.checkmark?.isHidden = false
                } else {
                    cell.checkmark?.isHidden = true
                }
            } else {
                if classifierData.name == "Default" {
                    cell.checkmark?.isHidden = false
                } else {
                    cell.checkmark?.isHidden = true
                }
            }
            
            return cell
        }
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if !(tableView.numberOfSections > 1 && indexPath.section == 0) {
            let classifierData = classifiers[indexPath.item]
            if classifierData.status == .ready && !(classifierData.classifierId == String() && classifierData.name == "Loading...") {
                if classifierData.classifierId == String() {
                    UserDefaults.standard.set(classifiers[indexPath.item].name, forKey: "classifier_id")
                } else {
                    UserDefaults.standard.set(classifiers[indexPath.item].classifierId, forKey: "classifier_id")
                }
            }
        }
        self.tableView.reloadData()
    }
    
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        if !(tableView.numberOfSections > 1 && indexPath.section == 0) {
            // Don't let them edit if there is no classifier id.
            if classifiers[indexPath.item].classifierId == String() {
                return false
            }
        }
        return true
    }
    
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            if tableView.numberOfSections > 1 && indexPath.section == 0 {
                let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
                
                let path = documentsUrl.appendingPathComponent(pending[indexPath.item].id!)
                
                do {
                    try FileManager.default.removeItem(at: path)
                    DatabaseController.getContext().delete(pending[indexPath.item])
                    DatabaseController.saveContext()
                    pending.remove(at: indexPath.item)
                    if (pending.count <= 0) {
                        tableView.beginUpdates()
                        tableView.deleteSections([0], with: .automatic)
                        tableView.moveSection(1, toSection: 0)
                        tableView.endUpdates()
                        // This seems to be some kind of weird bug...
                        tableView.setEditing(false, animated: false)
                    } else {
                        tableView.deleteRows(at: [indexPath], with: .automatic)
                    }
                } catch {
                    // If it fails don't delete the row.
                    // We don't want it stuck for all eternity.
                    print("Error: \(error.localizedDescription)")
                    if FileManager.default.fileExists(atPath: path.path) {
                        print("still exists")
                    } else {
                        print("File does not exist")
                        DatabaseController.getContext().delete(pending[indexPath.item])
                        DatabaseController.saveContext()
                        pending.remove(at: indexPath.item)
                        if (pending.count <= 0) {
                            tableView.beginUpdates()
                            tableView.deleteSections([0], with: .automatic)
                            tableView.moveSection(1, toSection: 0)
                            tableView.endUpdates()
                            tableView.setEditing(false, animated: false)
                        } else {
                            tableView.deleteRows(at: [indexPath], with: .fade)
                        }
                    }
                }
            } else {
                let url = URL(string: "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers/\(classifiers[indexPath.item].classifierId)")!
                
                let parameters: Parameters = [
                    "api_key": UserDefaults.standard.string(forKey: "api_key")!,
                    "version": "2016-05-20",
                    ]
                
                Alamofire.request(url, method: .delete, parameters: parameters).responseData { response in
                    switch response.result {
                    case .success:
                        break
                    case .failure(let error):
                        print(error)
                    }
                }
                
                // Don't worry about deleting these right away.
                classifiers.remove(at: indexPath.item)
                tableView.deleteRows(at: [indexPath], with: .fade)
            }
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if pending.count > 0 && segue.identifier == "showClasses" && (tableView.numberOfSections > 1 && tableView.indexPathForSelectedRow?.section == 0),
            let destination = segue.destination as? ClassesCollectionViewController,
            let index = tableView.indexPathForSelectedRow?.item {
            destination.classifier = pending[index]
        }
    }
}
