//
//  Classifier.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 7/17/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import Foundation

struct Classifier {
    enum Status: String {
        case ready, training, retraining, failed
    }
    
    let name: String
    let classes: [String]
    let classifierId: String
    let created: Date
    let status: Status
}

extension Classifier {
    init(name: String) {
        self.name = name
        self.classes = [String]()
        self.classifierId = String()
        self.created = Date()
        self.status = .ready
    }
    
    init?(json: Any) {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        
        guard let json = json as? [String: Any],
            let name = json["name"] as? String,
            let classesArray = json["classes"] as? [Any],
            let classifierId = json["classifier_id"] as? String,
            let created = json["created"] as? String,
            let date = dateFormatter.date(from: created),
            let statusString = json["status"] as? String,
            let status = Status(rawValue: statusString)
            else {
                return nil
        }
        
        var classes = [String]()
        for classJSON in classesArray {
            guard let classJSON = classJSON as? [String: Any],
                let classItem = classJSON["class"] as? String
                else {
                    return nil
            }
            classes.append(classItem)
        }
        
        self.name = name
        self.classes = classes
        self.classifierId = classifierId
        self.created = date
        self.status = status
    }
    
    func isEqual(_ object: Classifier) -> Bool {
        // Status might be something we want to check... don't know.
        return classifierId == object.classifierId && name == object.name
    }
    
    static var defaults = [Classifier(name: "Default"), Classifier(name: "Food"), Classifier(name: "Face Detection")]
}
