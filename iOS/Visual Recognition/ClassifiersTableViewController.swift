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
    
    var classifiers = [[String: AnyObject]]()
    
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
            
            self.pending.append(pendingClassifier)
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
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        self.navigationController?.toolbar.isHidden = true
        v.removeFromSuperview()
//        var fixedFrame = v.frame
//        fixedFrame.origin.y = 0
//        v.frame = fixedFrame
//        UIApplication.shared.keyWindow?.addSubview(v)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewDidAppear(false)
        v.removeFromSuperview()
    }
    
//    override func scrollViewDidScroll(_ scrollView: UIScrollView) {
//        var fixedFrame = v.frame
//        fixedFrame.origin.y = scrollView.contentOffset.y
//        v.frame = fixedFrame
//    }
//    
    let v = UIView(frame: CGRect(x: 0, y: -64, width: 500, height: 64))

    override func viewDidLoad() {
        super.viewDidLoad()
        
        v.backgroundColor = UIColor.white
//        v.translatesAutoresizingMaskIntoConstraints = false
        tableView.addSubview(v)
        tableView.bringSubview(toFront: v)
        
        tableView.estimatedRowHeight = 85.0
        tableView.rowHeight = UITableViewAutomaticDimension
    
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
        
        // Load from Watson
        let apiKey = UserDefaults.standard.string(forKey: "api_key")
        
        if apiKey == nil || apiKey == "" {
            self.classifiers.append(["name": "Default" as AnyObject, "status": "ready" as AnyObject])
            // Don't need to reload, because its synchronous.
            return
        }
        
        var r  = URLRequest(url: URL(string: "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers")!)
        
        r.query(params: [
            "api_key": apiKey!,
            "version": "2016-05-20",
            "verbose": "true"
        ])
        
        let task = URLSession.shared.dataTask(with: r) { data, response, error in
            // Check for fundamental networking error.
            guard let data = data, error == nil else {
                return
            }
            do {
                let json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as AnyObject
                DispatchQueue.main.async{
                    var data = json["classifiers"] as! [[String: AnyObject]]
                    
                    let dateFormatter = DateFormatter()
                    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
                    data = data.sorted(by: { dateFormatter.date(from: $0["created"] as! String)! > dateFormatter.date(from: $1["created"] as! String)! })
                    self.classifiers = data
                    self.classifiers.append(["name": "Default" as AnyObject, "status": "ready" as AnyObject])
                    
                    self.tableView.reloadData()
                }
            } catch let error as NSError {
                print("error : \(error)")
            }
        }
        task.resume()
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
            return "in progress"
        } else {
            return "my classifiers"
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
            
            cell.classifierNameLabel?.text = classifierData["name"] as? String
            cell.classifierIdLabel?.text = classifierData["classifier_id"] as? String
            cell.classifierStatusLabel?.text = classifierData["status"] as? String
            cell.statusIndicator?.layer.cornerRadius = 6
            
            if classifierData["status"] as? String == "ready" {
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
                print(self.classifiers[tableView.indexPath(for: cell)!.item]["classifier_id"] ?? "default")

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
        if !(tableView.numberOfSections > 1 && indexPath.section == 0) {
            let classifierData = classifiers[indexPath.item]
            if classifierData["status"] as? String == "ready"{
                UserDefaults.standard.set(classifiers[indexPath.item]["classifier_id"], forKey: "classifier_id")
            }
        }
        self.tableView.reloadData()
    }
    
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        if !(tableView.numberOfSections > 1 && indexPath.section == 0) {
            if indexPath.item == classifiers.count - 1 {
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
                
                let path = documentsUrl.appendingPathComponent(pending[indexPath.item].name!)
                
                do {
                    try FileManager.default.removeItem(at: path)
                    DatabaseController.getContext().delete(pending[indexPath.item])
                    pending.remove(at: indexPath.item)
                    if (pending.count <= 0) {
                        tableView.deleteSections([indexPath.section], with: .fade)
                    } else {
                        tableView.deleteRows(at: [indexPath], with: .fade)
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
                        pending.remove(at: indexPath.item)
                        if (pending.count <= 0) {
                            tableView.deleteSections([indexPath.section], with: .fade)
                        } else {
                            tableView.deleteRows(at: [indexPath], with: .fade)
                        }
                    }
                }
            } else {
                let url = URL(string: "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers/\(classifiers[indexPath.item]["classifier_id"]!)")!
                
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
