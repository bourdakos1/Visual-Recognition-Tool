//
//  ModelsTableViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 6/26/18.
//  Copyright © 2018 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import SwiftyDropbox

class ModelsTableViewController: UITableViewController {
    
    var modelMetadataList = [Files.Metadata]()

    override func viewDidLoad() {
        super.viewDidLoad()

        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        let client = DropboxClientsManager.authorizedClient
        
        if client == nil,
            let viewController = storyboard?.instantiateViewController(withIdentifier: "dropboxLoginViewController"),
            let dropboxLoginViewController = viewController as? DropboxLoginViewController {
            present(dropboxLoginViewController, animated: true, completion: nil)
        }
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        populateModelList()
    }
    
    func populateModelList() {
        // I don't want a global authorizedClient. but why?
        guard let authorizedClient = DropboxClientsManager.authorizedClient else {
            return
        }
        
        authorizedClient.files.listFolder(path: "")
            .response { response, error in
                if let response = response {
                    
                    // TODO: Check to make sure that it's a folder.
                    self.modelMetadataList = response.entries
                    self.tableView.reloadData()
                    
                } else if let error = error {
                    print(error)
                }
        }
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return modelMetadataList.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "modelCell", for: indexPath)

        cell.textLabel?.text = modelMetadataList[indexPath.row].name
        
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

    // MARK: - Navigation

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        guard let destination = segue.destination as? ModelVersionsTableViewController,
            let selected = tableView.indexPathForSelectedRow?.row else {
            return
        }
            
        destination.modelMetadata = modelMetadataList[selected]
    }

}
