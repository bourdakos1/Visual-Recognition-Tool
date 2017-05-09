//
//  TableViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 3/17/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit

class TableViewController: UITableViewController {
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    var myarray : [[String: AnyObject]] = []
    var cameraHidden = false

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.dataSource = self
        tableView.delegate = self
        tableView.estimatedRowHeight = 85.0
        tableView.rowHeight = UITableViewAutomaticDimension
        tableView.reloadData()
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
        if (myarray.count <= 0) {
            if let drawer = self.parent as? PulleyViewController {
                drawer.setDrawerPosition(position: .closed, animated: true)
            }
            if (cameraHidden) {
                let alert = UIAlertController(title: nil, message: "Please wait...", preferredStyle: .alert)
                
                alert.view.tintColor = UIColor.black
                let loadingIndicator: UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRect(x: 10, y: 5, width: 50, height: 50)) as UIActivityIndicatorView
                loadingIndicator.hidesWhenStopped = true
                loadingIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.gray
                loadingIndicator.startAnimating()
                
                alert.view.addSubview(loadingIndicator)
                present(alert, animated: true, completion: nil)

            }
        } else {
            dismiss(animated: false, completion: nil)
            if let drawer = self.parent as? PulleyViewController {
                drawer.setDrawerPosition(position: .partiallyRevealed, animated: true)
            }
        }
        return myarray.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell : TableViewCell
        
        if indexPath.item == 0 {
            cell = tableView.dequeueReusableCell(withIdentifier: "cellLarge", for: indexPath) as! TableViewCell
        } else {
            cell = tableView.dequeueReusableCell(withIdentifier: "cellDefault", for: indexPath) as! TableViewCell
        }
        
        let score = myarray[indexPath.item]["score"] as! CGFloat
        
        cell.label.text = myarray[indexPath.item]["class_name"] as! String?
        cell.progress.progress = score
        cell.score.text = String(format: "%.2f", score)

        return cell
    }
}

extension TableViewController: PulleyDrawerViewControllerDelegate {
    
    func collapsedDrawerHeight() -> CGFloat
    {
        return 68.0
    }
    
    func partialRevealDrawerHeight() -> CGFloat
    {
        return 264.0
    }
    
    func supportedDrawerPositions() -> [PulleyPosition] {
        return PulleyPosition.all // You can specify the drawer positions you support. This is the same as: [.open, .partiallyRevealed, .collapsed, .closed]
    }
    
    func drawerPositionDidChange(drawer: PulleyViewController)
    {
        tableView.isScrollEnabled = drawer.drawerPosition == .open
    }
}
