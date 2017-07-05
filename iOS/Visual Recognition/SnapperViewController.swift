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
    
    var classifier = PendingClassifier()
    var pendingClass = PendingClass()
    var image = UIImage()
    
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
    
    override func viewDidAppear(_ animated: Bool) {
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        DispatchQueue(label: "session queue", attributes: [], target: nil).async { [unowned self] in
            self.initializeCamera()
        }
        
        view.backgroundColor = UIColor.black
        cameraView.backgroundColor = UIColor.clear
        
        let blurEffectView = UIVisualEffectView(effect: UIBlurEffect(style: UIBlurEffectStyle.light))
        blurEffectView.frame = view.bounds
        blurEffectView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.insertSubview(blurEffectView, at: 0)
        
        let tmpImageView = UIImageView()
        tmpImageView.frame = view.bounds
        tmpImageView.image = image
        view.insertSubview(tmpImageView, at: 0)
        
        flashView.frame = view.bounds
        flashView.alpha = 0
        flashView.backgroundColor = UIColor.black
        view.insertSubview(flashView, aboveSubview: cameraView)
        
        grabPhoto()
    }
    
    func grabPhoto() {
        let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        
        do {
            // Get the directory contents urls (including subfolders urls)
            let directoryContents = try FileManager.default.contentsOfDirectory(at: documentsUrl.appendingPathComponent(classifier.name!).appendingPathComponent(pendingClass.name!), includingPropertiesForKeys: nil, options: [])
            
            // if you want to filter the directory contents you can do like this:
            let jpgFile = directoryContents.filter{ $0.pathExtension == "jpg" }
                .map { url -> (URL, TimeInterval) in
                    var lastModified = try? url.resourceValues(forKeys: [URLResourceKey.contentModificationDateKey])
                    return (url, lastModified?.contentModificationDate?.timeIntervalSinceReferenceDate ?? 0)
                }
                .sorted(by: { $0.1 > $1.1 }) // sort descending modification dates
                .map{ $0.0 }.first!
            
            thumbnailImage.image = UIImage(contentsOfFile: jpgFile.path)!
            
        } catch {
            print(error.localizedDescription)
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
                DispatchQueue.main.async {
                    self.previewLayer?.frame = self.view.bounds
                    self.cameraView.layer.addSublayer(self.previewLayer!)
                    self.cameraView.alpha = 0.0
                }
                
                let observation = captureSession?.observe(\.running, changeHandler: { [weak self] (session, change) in
                    if session.isRunning {
                        DispatchQueue.main.async {
                            UIView.animate(withDuration: 0.3, animations: {
                                self?.cameraView.alpha = 1.0
                            })
                        }
                    }
                })
                
                if observation == nil {
                    print("Error: No camera session observation")
                }
                
                captureSession?.startRunning()
            }
        } catch {
            print("Error: \(error)")
        }
    }
    
    // Delegate for Camera.
    func capture(_ captureOutput: AVCapturePhotoOutput, didFinishProcessingPhotoSampleBuffer photoSampleBuffer: CMSampleBuffer?, previewPhotoSampleBuffer: CMSampleBuffer?, resolvedSettings: AVCaptureResolvedPhotoSettings, bracketSettings: AVCaptureBracketedStillImageSettings?, error: Error?) {
        
        if !transitioning {
            UIView.animate(withDuration: 0.1, delay: 0, options: [], animations: { () -> Void in
                self.flashView.alpha = 1.0
            }, completion: { (Bool) -> Void in
                UIView.animate(withDuration: 0.1, delay: 0, options: [], animations: { () -> Void in
                    self.flashView.alpha = 0.0
                }, completion: nil)
            })
        }
        
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
            
            if transitioning {
                transitioning = false
                self.image = image
//                self.performSegue(withIdentifier: "unwindToImages", sender: self)
                return
            }
            
            let reducedImage = image.resized(toWidth: 300)!
            
            let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
            
            let path = documentsUrl.appendingPathComponent(classifier.name!).appendingPathComponent(pendingClass.name!)
            
            do {
                try FileManager.default.createDirectory(atPath: path.path, withIntermediateDirectories: true, attributes: nil)
            } catch {
                print(error.localizedDescription)
            }
            
            let filename = path.appendingPathComponent("\(NSUUID().uuidString).jpg")
            
            do {
                try UIImageJPEGRepresentation(reducedImage, 0.4)!.write(to: filename)
            } catch {
                print(error.localizedDescription)
            }
            
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
    
//    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
//        if  segue.identifier == "unwindToImages",
//            let destination = segue.destination as? ImagesCollectionViewController {
//            destination.image = image
//        }
//    }
    
    var transitioning = false
    @IBAction func goToImages() {
        transitioning = true
        photoOutput?.capturePhoto(with: AVCapturePhotoSettings(), delegate: self)
        self.performSegue(withIdentifier: "unwindToImages", sender: self)
    }
    
    @IBAction func takePhoto() {
        photoOutput?.capturePhoto(with: AVCapturePhotoSettings(), delegate: self)
    }
}
