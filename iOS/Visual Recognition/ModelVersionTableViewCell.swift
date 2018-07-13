//
//  ModelVersionTableViewCell.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 6/26/18.
//  Copyright © 2018 Nicholas Bourdakos. All rights reserved.
//

import UIKit

class ModelVersionTableViewCell: UITableViewCell {

    @IBOutlet weak var activityIndicator: UIActivityIndicatorView!
    @IBOutlet weak var classifierIdLabel: UILabel!
    @IBOutlet weak var classifierNameLabel: UILabel!
    @IBOutlet weak var classifierStatusEmoji: UILabel!
    @IBOutlet weak var leftPadding: NSLayoutConstraint!

}
