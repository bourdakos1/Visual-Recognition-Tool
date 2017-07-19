//
//  PendingClassifier+CoreDataClass.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 5/9/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import Foundation
import CoreData
import Zip
import Alamofire

public class PendingClassifier: NSManagedObject {
    func train(completion: @escaping (_ results: Any) -> Void) {
        print("train")
        do {
            let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!.appendingPathComponent(id!)
            
            var paths = [URL]()
            
            for result in relationship?.allObjects as! [PendingClass] {
                let destination = documentsUrl.appendingPathComponent(result.name!).appendingPathExtension("zip")
                
                paths.append(destination)
                
                if FileManager.default.fileExists(atPath: destination.path) {
                    print("Exists, deleting")
                    // Exist so delete first and then try.
                    do {
                        try FileManager.default.removeItem(at: destination)
                    } catch {
                        print("Error: \(error.localizedDescription)")
                        if FileManager.default.fileExists(atPath: destination.path) {
                            print("still exists")
                        }
                    }
                }
                
                // Make sure it's actually gone...
                if !FileManager.default.fileExists(atPath: destination.path) {
                    try Zip.zipFiles(paths: [documentsUrl.appendingPathComponent(result.name!)], zipFilePath: destination, password: nil, progress: { progress in
                        print("Zipping: \(progress)")
                    })
                }
            }
            
            let url = URL(string: "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers")!
            
            let urlRequest = URLRequest(url: url)
            
            let parameters: Parameters = [
                "api_key": UserDefaults.standard.string(forKey: "api_key")!,
                "version": "2016-05-20",
                ]
            
            let encodedURLRequest = try URLEncoding.queryString.encode(urlRequest, with: parameters)
            
            Alamofire.upload(
                multipartFormData: { multipartFormData in
                    for path in paths {
                        multipartFormData.append(
                            path,
                            withName: "\((path.pathComponents.last! as NSString).deletingPathExtension)_positive_examples"
                        )
                    }
                    multipartFormData.append(self.name!.data(using: .utf8, allowLossyConversion: false)!, withName :"name")
            },
                to: encodedURLRequest.url!,
                encodingCompletion: { encodingResult in
                    switch encodingResult {
                    case .success(let upload, _, _):
                        upload.responseJSON { response in
                            completion(response)
                            debugPrint(response)
                        }
                        upload.uploadProgress(closure: { //Get Progress
                            progress in
                            print(progress.fractionCompleted)
                        })
                    case .failure(let encodingError):
                        print(encodingError)
                    }
            })
        }
        catch {
            print(error)
            completion("FAILUREEEEE")
        }
    }
}
