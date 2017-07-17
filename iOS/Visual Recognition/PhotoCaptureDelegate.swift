//
//  PhotoCaptureDelegate.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 7/4/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import AVFoundation
import Photos

class PhotoCaptureProcessor: NSObject {
    fileprivate(set) var requestedPhotoSettings: AVCapturePhotoSettings
    
    var photoData: UIImage?
    
    fileprivate let willCapturePhotoAnimation: () -> Void
    
    fileprivate let completionHandler: (PhotoCaptureProcessor) -> Void
    
    init(with requestedPhotoSettings: AVCapturePhotoSettings, willCapturePhotoAnimation: @escaping () -> Void, completionHandler: @escaping (PhotoCaptureProcessor) -> Void) {
        self.requestedPhotoSettings = requestedPhotoSettings
        self.willCapturePhotoAnimation = willCapturePhotoAnimation
        self.completionHandler = completionHandler
    }
    
    fileprivate func didFinish() {
        completionHandler(self)
    }
}

extension PhotoCaptureProcessor: AVCapturePhotoCaptureDelegate {
    func capture(_ output: AVCapturePhotoOutput, didFinishProcessingPhotoSampleBuffer photoSampleBuffer: CMSampleBuffer?, previewPhotoSampleBuffer: CMSampleBuffer?, resolvedSettings: AVCaptureResolvedPhotoSettings, bracketSettings: AVCaptureBracketedStillImageSettings?, error: Error?) {
        if let error = error {
            print("Error capturing photo: \(error)")
        } else {
            if photoSampleBuffer != nil {
                let imageData = AVCapturePhotoOutput.jpegPhotoDataRepresentation(
                    forJPEGSampleBuffer: photoSampleBuffer!,
                    previewPhotoSampleBuffer: previewPhotoSampleBuffer
                )
                
                let dataProvider  = CGDataProvider(data: imageData! as CFData)
                
                let cgImageRef = CGImage(
                    jpegDataProviderSource: dataProvider!,
                    decode: nil,
                    shouldInterpolate: true,
                    intent: .defaultIntent
                )
                
                photoData = UIImage(
                    cgImage: cgImageRef!,
                    scale: 1.0,
                    orientation: UIImageOrientation.right
                )
            }
            print("Captured")
        }
    }
    
    func capture(_ output: AVCapturePhotoOutput, willCapturePhotoForResolvedSettings resolvedSettings: AVCaptureResolvedPhotoSettings) {
        willCapturePhotoAnimation()
    }
    
    func capture(_ output: AVCapturePhotoOutput, didFinishCaptureForResolvedSettings resolvedSettings: AVCaptureResolvedPhotoSettings, error: Error?) {
        didFinish()
    }
}
