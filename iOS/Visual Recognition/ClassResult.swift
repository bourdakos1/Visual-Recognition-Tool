//
//  ClassResult.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 7/17/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit

struct ClassResult {
    let className: String
    let score: CGFloat
}

extension ClassResult {
    init?(json: Any) {
        guard let json = json as? [String: Any],
            let className = json["class"] as? String,
            let score = json["score"] as? CGFloat
            else {
                return nil
        }
        
        self.className = className
        self.score = score
    }
}
