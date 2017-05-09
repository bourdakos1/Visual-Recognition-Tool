//
//  ClassifiersTableViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 3/20/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import CoreData

class ClassifiersTableViewController: UITableViewController {
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .default
    }
    
    let VISION_API_KEY: String
    
    var progress = [PendingClassifier]()
    
    var array: [[String: AnyObject]] = []
    
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
            pendingClassifier.id = "g3eq80eun09132ue13e9012u9e01" // make this an actual id, this will be the directory
            pendingClassifier.name = textfield.text!
            
            self.progress.append(pendingClassifier)
            self.tableView.reloadData()
            
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

    override func viewDidLoad() {
        super.viewDidLoad()
    
        let fetchRequest:NSFetchRequest<PendingClassifier> = PendingClassifier.fetchRequest()
        
        do {
            let searchResults = try DatabaseController.getContext().fetch(fetchRequest)
            progress = []
            for result in searchResults as [PendingClassifier] {
                progress.append(result)
                print("\(result.name!)_\(result.id!):")
                for result in result.relationship?.allObjects as! [PendingClass] {
                    print("\t\(result.name!)")
                }
            }
        }
        catch {
            print("Error: \(error)")
        }
        
        // Load from Watson
        let apiKey = UserDefaults.standard.string(forKey: "api_key")
        
        if apiKey == nil || apiKey == "" {
            return
        }
        
        let escapedApiKey = apiKey?.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)
        
        
        /// UPLOAD
        var r  = URLRequest(url: URL(string: "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers?api_key=\(escapedApiKey!)&version=2016-05-20&verbose=true")!)
        r.httpMethod = "GET"
        
        let task = URLSession.shared.dataTask(with: r) { data, response, error in
            guard let data = data, error == nil else {               // check for fundamental networking error
                return
            }
            do {
                let json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as AnyObject
                DispatchQueue.main.async{
                    var data = json["classifiers"] as! [[String: AnyObject]]
                    
                    let dateFormatter = DateFormatter()
                    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
                    data = data.sorted(by: { dateFormatter.date(from: $0["created"] as! String)! > dateFormatter.date(from: $1["created"] as! String)! })
                    self.array = data
                    self.array.append(["name": "Default" as AnyObject, "status": "ready" as AnyObject])
                    
                    // Test classifier
                    self.array.insert(["name": "Test Training" as AnyObject, "classifier_id": "test_training_2146114590" as AnyObject, "status": "training" as AnyObject], at: 0)
                    
                    self.tableView.reloadData()
                }
            } catch let error as NSError {
                print("error : \(error)")
            }
        }
        task.resume()

        
        tableView.delegate = self
        tableView.dataSource = self
        tableView.estimatedRowHeight = 85.0
        tableView.rowHeight = UITableViewAutomaticDimension
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 2
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if section == 0 {
            return progress.count
        } else {
            return array.count
        }
    }
    
    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        if section == 0 {
            return "in progress"
        } else {
            return "my classifiers"
        }
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if indexPath.section == 0 {
            let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
            
            cell.textLabel?.text = progress[indexPath.item].name!
            
            return cell
        } else {
            let cell = tableView.dequeueReusableCell(withIdentifier: "cell2", for: indexPath) as! ClassiferTableViewCell
            
            let classifierData = array[indexPath.item]
            
            cell.classifierNameLabel?.text = classifierData["name"] as? String
            cell.classifierIdLabel?.text = classifierData["classifier_id"] as? String
            cell.classifierStatusLabel?.text = classifierData["status"] as? String
            cell.statusIndicator?.layer.cornerRadius = 6
            
            if classifierData["status"] as? String == "ready"{
                cell.statusIndicator?.backgroundColor = UIColor(red: 105/255, green: 219/255, blue: 48/255, alpha: 1)
                cell.activityIndicator?.stopAnimating()
                cell.activityIndicator?.isHidden = true
            } else if classifierData["status"] as? String == "training" || classifierData["status"] as? String == "retraining" {
                cell.classifierNameLabel?.alpha = 0.4
                cell.classifierIdLabel?.alpha = 0.4
                cell.classifierStatusLabel?.alpha = 0.4
                cell.statusIndicator?.backgroundColor = UIColor(red: 255/255, green: 171/255, blue: 0/255, alpha: 0.4)
                cell.activityIndicator?.startAnimating()
                cell.activityIndicator?.isHidden = false
            } else {
                cell.classifierNameLabel?.alpha = 0.4
                cell.classifierIdLabel?.alpha = 0.4
                cell.classifierStatusLabel?.alpha = 0.4
                cell.statusIndicator?.backgroundColor = UIColor(red: 244/255, green: 67/255, blue: 54/255, alpha: 0.4)
                cell.activityIndicator?.stopAnimating()
                cell.activityIndicator?.isHidden = true
            }
            
            cell.tapAction = { (cell) in
                print(self.array[tableView.indexPath(for: cell)!.item]["classifier_id"] ?? "default")

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
                if classifierData["classifier_id"] as? String == classifierId {
                    cell.checkmark?.isHidden = false
                } else {
                    cell.checkmark?.isHidden = true
                }
            } else {
                if classifierData["name"] as? String == "Default" {
                    cell.checkmark?.isHidden = false
                } else {
                    cell.checkmark?.isHidden = true
                }
            }
            
            return cell
        }
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if indexPath.section == 1 {
            let classifierData = array[indexPath.item]
            if classifierData["status"] as? String == "ready"{
                UserDefaults.standard.set(array[indexPath.item]["classifier_id"], forKey: "classifier_id")
            }
        }
        self.tableView.reloadData()
    }
    
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        if indexPath.section == 1 {
            return false
        }
        return true
    }
    
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            DatabaseController.getContext().delete(progress[indexPath.item])
            progress.remove(at: indexPath.item)
            tableView.deleteRows(at: [indexPath], with: .fade)
        }
    }

}
