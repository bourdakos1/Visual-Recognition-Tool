//
//  PendingClassifier+CoreDataProperties.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 5/9/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import Foundation
import CoreData


extension PendingClassifier {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<PendingClassifier> {
        return NSFetchRequest<PendingClassifier>(entityName: "PendingClassifier")
    }

    @NSManaged public var name: String?
    @NSManaged public var id: String?
    @NSManaged public var relationship: NSSet?

}

// MARK: Generated accessors for relationship
extension PendingClassifier {

    @objc(addRelationshipObject:)
    @NSManaged public func addToRelationship(_ value: PendingClass)

    @objc(removeRelationshipObject:)
    @NSManaged public func removeFromRelationship(_ value: PendingClass)

    @objc(addRelationship:)
    @NSManaged public func addToRelationship(_ values: NSSet)

    @objc(removeRelationship:)
    @NSManaged public func removeFromRelationship(_ values: NSSet)

}
