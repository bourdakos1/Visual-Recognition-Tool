//
//  PendingClass+CoreDataProperties.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 5/9/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import Foundation
import CoreData


extension PendingClass {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<PendingClass> {
        return NSFetchRequest<PendingClass>(entityName: "PendingClass")
    }

    @NSManaged public var name: String?
    @NSManaged public var created: Date?

}
