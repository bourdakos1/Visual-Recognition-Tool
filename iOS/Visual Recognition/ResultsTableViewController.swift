//
//  TableViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 3/17/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit

class ResultsTableViewController: UITableViewController {
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    var classes = [ClassResult]()
    var faces = [FaceResult]()

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.estimatedRowHeight = 85.0
        tableView.rowHeight = UITableViewAutomaticDimension
    }

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return classes.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell: ResultTableViewCell
        
        if indexPath.item == 0 {
            cell = tableView.dequeueReusableCell(withIdentifier: "cellLarge", for: indexPath) as! ResultTableViewCell
        } else {
            cell = tableView.dequeueReusableCell(withIdentifier: "cellDefault", for: indexPath) as! ResultTableViewCell
        }
        
        let score = classes[indexPath.item].score
        
        cell.label.text = classes[indexPath.item].className
        cell.progress.progress = score
        cell.score.text = String(format: "%.2f", score)
        
        print(cell.score.frame.width)

        return cell
    }
}

extension ResultsTableViewController: PulleyDrawerViewControllerDelegate {
    func collapsedDrawerHeight() -> CGFloat {
        return 68.0
    }
    
    func partialRevealDrawerHeight() -> CGFloat {
        return 264.0
    }
    
    func supportedDrawerPositions() -> [PulleyPosition] {
        // You can specify the drawer positions you support. This is the same as: [.open, .partiallyRevealed, .collapsed, .closed]
        return PulleyPosition.all
    }
    
    func drawerPositionDidChange(drawer: PulleyViewController) {
        tableView.isScrollEnabled = drawer.drawerPosition == .open
    }
}
