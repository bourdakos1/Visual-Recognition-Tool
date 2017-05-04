//
//  ClassifiersTableViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 3/20/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit

class ClassifiersTableViewController: UITableViewController {
    
    let VISION_API_KEY: String
    
    var array: [[String: AnyObject]] = []
    
    required init?(coder aDecoder: NSCoder) {
        var keys: NSDictionary?
        
        if let path = Bundle.main.path(forResource: "Keys", ofType: "plist") {
            keys = NSDictionary(contentsOfFile: path)
        }
        
        VISION_API_KEY = (keys?["VISION_API_KEY"] as? String)!
        
        super.init(coder: aDecoder)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        var apiKey = UserDefaults.standard.string(forKey: "api_key")
        
        if apiKey == nil || apiKey == "" {
            apiKey = self.VISION_API_KEY
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
                let json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as? AnyObject
                
                if let parseJSON = json {
                    print("resp :\(parseJSON)")
                    DispatchQueue.main.async{
                        var data = parseJSON["classifiers"] as! [[String: AnyObject]]
                        
                        let dateFormatter = DateFormatter()
                        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
                        data = data.sorted(by: { dateFormatter.date(from: $0["created"] as! String)! > dateFormatter.date(from: $1["created"] as! String)! })
                        self.array = data
                        self.array.append(["name": "Default" as AnyObject])
                        self.tableView.reloadData()
                    }
                }
            } catch let error as NSError {
                print("error : \(error)")
            }
        }
        task.resume()

        
        tableView.delegate = self
        tableView.dataSource = self
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return array.count
    }


    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)

        cell.textLabel?.text = array[indexPath.item]["name"] as? String
        
        let classifierId = UserDefaults.standard.string(forKey: "classifier_id")
        
        if classifierId != nil {
            if array[indexPath.item]["classifier_id"] as? String == classifierId {
                cell.accessoryType = .checkmark
            } else {
                cell.accessoryType = .none
            }
        } else {
            if array[indexPath.item]["name"] as? String == "Default" {
                cell.accessoryType = .checkmark
            } else {
                cell.accessoryType = .none
            }
        }

        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        UserDefaults.standard.set(array[indexPath.item]["classifier_id"], forKey: "classifier_id")
        self.tableView.reloadData()
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
