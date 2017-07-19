//
//  FaceResult.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 7/19/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit

struct FaceResult {
    let age: Age
    let location: Location
    let gender: Gender
    
    struct Age {
        let max: Int
        let min: Int
        let score: CGFloat
    }
    
    struct Location {
        let height: CGFloat
        let left: CGFloat
        let top: CGFloat
        let width: CGFloat
    }
    
    struct Gender {
        enum Sex: String {
            case male, female
        }
        let sex: Sex
        let score: CGFloat
    }
}

extension FaceResult {
    init?(json: Any) {
        guard let json = json as? [String: Any],
            let age = json["age"] as? [String: Any],
            let location = json["face_location"] as? [String: Any],
            let gender = json["gender"] as? [String: Any],
        
            let maxAge = age["max"] as? Int,
            let minAge = age["min"] as? Int,
            let ageScore = age["score"] as? CGFloat,
        
            let height = location["height"] as? CGFloat,
            let left = location["left"] as? CGFloat,
            let top = location["top"] as? CGFloat,
            let width = location["width"] as? CGFloat,
        
            let genderSex = gender["gender"] as? String,
            let genderScore = gender["score"] as? CGFloat
            else {
                return nil
        }
        
        self.age = Age(max: maxAge, min: minAge, score: ageScore)
        self.location = Location(height: height, left: left, top: top, width: width)
        self.gender = Gender(sex: Gender.Sex(rawValue: genderSex.lowercased())!, score: genderScore)
        
    }
}

