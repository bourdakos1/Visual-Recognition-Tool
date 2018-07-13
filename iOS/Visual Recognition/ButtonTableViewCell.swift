//
//  ButtonTableViewCell.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 7/5/18.
//  Copyright © 2018 Nicholas Bourdakos. All rights reserved.
//

import UIKit

class ButtonTableViewCell: UITableViewCell {
    
    @IBOutlet weak var trainButton: UIButton!
    @IBOutlet weak var editButton: UIButton!

    override func awakeFromNib() {
        super.awakeFromNib()
        trainButton.layer.cornerRadius = 8
        editButton.layer.cornerRadius = 8
    }

}
