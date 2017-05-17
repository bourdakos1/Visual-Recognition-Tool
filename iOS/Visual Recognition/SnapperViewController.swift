//
//  SnapperViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 5/16/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import AVFoundation
import Photos

class SnapperViewController: UIViewController, AVCapturePhotoCaptureDelegate {
    
    // Set the StatusBar color.
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    // Camera variables.
    var captureSession: AVCaptureSession?
    var photoOutput: AVCapturePhotoOutput?
    var previewLayer: AVCaptureVideoPreviewLayer?
    @IBOutlet var cameraView: UIView!
    
    @IBOutlet var thumbnail: UIView!
    @IBOutlet var thumbnailImage: UIImageView!
    @IBOutlet weak var width: NSLayoutConstraint!
    @IBOutlet weak var height: NSLayoutConstraint!
    
    var flashView = UIView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        initializeCamera()
        
        flashView.frame = view.frame
        flashView.alpha = 0
        flashView.backgroundColor = UIColor.black
        cameraView.addSubview(flashView)
        
        grabPhoto()
    }
    
    func grabPhoto() {
        let imgManager = PHImageManager.default()
        
        let requestOptions = PHImageRequestOptions()
        requestOptions.isSynchronous = true
        requestOptions.deliveryMode = .highQualityFormat
        
        let fetchOptions = PHFetchOptions()
        fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
        fetchOptions.fetchLimit = 1
        
        let width = 60
        
        let fetchResult = PHAsset.fetchAssets(with: .image, options: fetchOptions)
        if fetchResult.count > 0 {
            for i in 0..<fetchResult.count {
                imgManager.requestImage(for: fetchResult.object(at: i), targetSize: CGSize(width: width, height: width), contentMode: .aspectFill, options: requestOptions) { image, error in
                    self.thumbnailImage.image = image!
                }
            }
        }
    }
    
    // Initialize camera.
    func initializeCamera() {
        captureSession = AVCaptureSession()
        captureSession?.sessionPreset = AVCaptureSessionPreset1920x1080
        let backCamera = AVCaptureDevice.defaultDevice(withMediaType: AVMediaTypeVideo)
        
        do {
            let input = try AVCaptureDeviceInput(device: backCamera)
            captureSession?.addInput(input)
            photoOutput = AVCapturePhotoOutput()
            if (captureSession?.canAddOutput(photoOutput) != nil){
                captureSession?.addOutput(photoOutput)
                
                previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
                previewLayer?.videoGravity = AVLayerVideoGravityResizeAspect
                previewLayer?.connection.videoOrientation = AVCaptureVideoOrientation.portrait
                cameraView.layer.addSublayer(previewLayer!)
                captureSession?.startRunning()
            }
        } catch {
            print("Error: \(error)")
        }
        previewLayer?.frame = view.bounds
    }
    
    // Delegate for Camera.
    func capture(_ captureOutput: AVCapturePhotoOutput, didFinishProcessingPhotoSampleBuffer photoSampleBuffer: CMSampleBuffer?, previewPhotoSampleBuffer: CMSampleBuffer?, resolvedSettings: AVCaptureResolvedPhotoSettings, bracketSettings: AVCaptureBracketedStillImageSettings?, error: Error?) {
        
        UIView.animate(withDuration: 0.1, delay: 0, options: [], animations: { () -> Void in
            self.flashView.alpha = 1.0
        }, completion: { (Bool) -> Void in
            UIView.animate(withDuration: 0.1, delay: 0, options: [], animations: { () -> Void in
                self.flashView.alpha = 0.0
            }, completion: nil)
        })
        
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
            
            let image = UIImage(
                cgImage: cgImageRef!,
                scale: 1.0,
                orientation: UIImageOrientation.right
            )
            
            UIView.animate(withDuration: 0.3, delay: 0, options: [.curveEaseOut], animations: { () -> Void in
                self.thumbnailImage.alpha = 0.0
            }, completion: { (Bool) -> Void in
                self.width.constant = 5
                self.height.constant = 5
                self.thumbnailImage.image = image
                self.view.layoutIfNeeded()
                self.width.constant = 60
                self.height.constant = 60
                UIView.animate(withDuration: 0, delay: 0.25, options: [.curveEaseOut], animations: { () -> Void in
                    self.thumbnailImage.alpha = 1.0
                }, completion: nil)
                UIView.animate(withDuration: 0.3, delay: 0.25, options: [.curveEaseOut], animations: { () -> Void in
                    self.view.layoutIfNeeded()
                }, completion: nil)
            })
        }
    }
    
    @IBAction func takePhoto() {
        photoOutput?.capturePhoto(with: AVCapturePhotoSettings(), delegate: self)
    }
}
