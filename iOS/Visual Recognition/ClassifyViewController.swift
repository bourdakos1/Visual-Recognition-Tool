//
//  ClassifyViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 7/17/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import AVFoundation
import VisualRecognitionV3

struct VisualRecognitionConstants {
    static let version = "2017-11-10"
}

class ClassifyViewController: UIViewController {
    
    // MARK: - IBOutlets
    
    @IBOutlet var cameraView: UIView!
    @IBOutlet var tempImageView: UIImageView!
    @IBOutlet var selectUI: UIImageView!
    @IBOutlet var captureButton: UIButton!
    @IBOutlet var retakeButton: UIButton!
    @IBOutlet var switchCameraButton: UIButton!
    @IBOutlet var pickerView: AKPickerView!
    
    // MARK: - Variable Declarations
    
    let classifiers = ["Default", "Food", "Face Detection"]
    
    var reducedImageWidth: CGFloat = 224
    var usingFrontCamera = false
    var captureSession: AVCaptureSession?
    var photoOutput: AVCapturePhotoOutput?
    var previewLayer: AVCaptureVideoPreviewLayer?
    var visualRecognition: VisualRecognition = {
        guard let path = Bundle.main.path(forResource: "Keys", ofType: "plist") else {
            // Please create a Credentials.plist file with your Visual Recognition credentials.
            fatalError()
        }
        guard let apiKey = NSDictionary(contentsOfFile: path)?["VISION_API_KEY"] as? String else {
            // No Visual Recognition API key found. Make sure you add your API key to the Credentials.plist file.
            fatalError()
        }
        return VisualRecognition(apiKey: apiKey, version: VisualRecognitionConstants.version)
    }()
    
    // MARK: - Override Functions
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        initializeCamera()
        resetUI()
        
        // Set up PickerView.
        pickerView.dataSource = self
        pickerView.interitemSpacing = CGFloat(25.0)
        pickerView.pickerViewStyle = .flat
        pickerView.maskDisabled = true
        pickerView.font = UIFont.boldSystemFont(ofSize: 14)
        pickerView.highlightedFont = UIFont.boldSystemFont(ofSize: 14)
        pickerView.highlightedTextColor = UIColor.white
        pickerView.textColor = UIColor(red: 1, green: 1, blue: 1, alpha: 0.6)
        pickerView.reloadData()
    }
    
    func initializeCamera() {
        // This needs to be fixed up.
        guard let backCamera = AVCaptureDevice.default(for: .video) else {
            return
        }
        
        guard let frontCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) else {
            return
        }
        
        let captureDevice = usingFrontCamera ? frontCamera : backCamera
        
        guard let input = try? AVCaptureDeviceInput(device: captureDevice) else {
            return
        }
        
        if let inputs = captureSession?.inputs {
            for i in inputs {
                captureSession?.removeInput(i)
            }
        }
        
        captureSession = AVCaptureSession()
        captureSession?.sessionPreset = .high
        captureSession?.addInput(input)
        photoOutput = AVCapturePhotoOutput()
    
        if (captureSession?.canAddOutput(photoOutput!) != nil) {
            captureSession?.addOutput(photoOutput!)
            previewLayer = AVCaptureVideoPreviewLayer(session: captureSession!)
            previewLayer?.videoGravity = .resize
            previewLayer?.connection?.videoOrientation = .portrait
            cameraView.layer.addSublayer(previewLayer!)
            captureSession?.startRunning()
        }
        
        previewLayer?.frame = view.bounds
    }
    
    func classifyImage(for image: UIImage, localThreshold: Double = 0.0) {
        showClassifyUI(forImage: image)
        
        let reducedImage = image.resized(toWidth: reducedImageWidth)!
        
        // Show an activity indicator while its loading.
        let alert = UIAlertController(title: nil, message: "Please wait...", preferredStyle: .alert)

        alert.view.tintColor = UIColor.black
        let loadingIndicator: UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRect(x: 10, y: 5, width: 50, height: 50)) as UIActivityIndicatorView
        loadingIndicator.hidesWhenStopped = true
        loadingIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.gray
        loadingIndicator.startAnimating()

        alert.view.addSubview(loadingIndicator)
        present(alert, animated: true, completion: nil)
        
        let failure = { (error: Error) in
            self.showAlert("Could not classify image", alertMessage: error.localizedDescription)
        }
        
        let classifierId = classifiers[pickerView.selectedItem].lowercased()
        
        if classifierId == "face detection" {
            visualRecognition.detectFaces(image: reducedImage, failure: failure) { classifiedImages in
                // Update UI on main thread
                DispatchQueue.main.async {
                    self.dismiss(animated: false, completion: nil)
                    
                    guard let faces = classifiedImages.images.first?.faces else {
                        return
                    }
                    
                    let scale = self.tempImageView.frame.width / self.reducedImageWidth
                    
                    for case let face in faces {
     
                        let label = UILabel()
                        // This is pretty lame but fine for now...
                        var genderString = String()
                        if let gender = face.gender?.gender {
                            genderString = "\(gender): "
                        }
                        
                        var ageString = String()
                        if let ageMin = face.age?.min {
                            if let ageMax = face.age?.max {
                                ageString = "\(ageMin) - \(ageMax)"
                            } else {
                                ageString = "\(ageMin)"
                            }
                        } else {
                            if let ageMax = face.age?.max {
                                ageString = "\(ageMax)"
                            }
                        }
                        
                        label.text = "   \(genderString)age \(ageString)"
                        label.frame.origin.x = CGFloat(face.faceLocation!.left) * scale
                        label.frame.origin.y = CGFloat(face.faceLocation!.top) * scale - 35
                        label.frame.size.width = CGFloat(face.faceLocation!.width) * scale
                        label.frame.size.height = 40
                        
                        let rect = CGRect(x: 0, y: 0, width: label.frame.width, height: label.frame.height)
                        let maskPath = UIBezierPath(roundedRect: rect, byRoundingCorners: [.topLeft, .topRight], cornerRadii: CGSize(width: 5.0, height: 5.0))
                        
                        let shape = CAShapeLayer()
                        shape.path = maskPath.cgPath
                        label.layer.mask = shape
                        
                        label.textColor = UIColor.white
                        label.backgroundColor = label.tintColor
                        
                        let view = UIView()
                        view.frame.size.width = CGFloat(face.faceLocation!.width) * scale
                        view.frame.size.height = CGFloat(face.faceLocation!.height) * scale
                        view.frame.origin.x = CGFloat(face.faceLocation!.left) * scale
                        view.frame.origin.y = CGFloat(face.faceLocation!.top) * scale
                        view.layer.borderWidth = 5
                        view.layer.cornerRadius = 5
                        view.layer.borderColor = view.tintColor.cgColor
                        view.clipsToBounds = true
                        self.tempImageView.addSubview(view)
                        self.tempImageView.addSubview(label)
                    }
                }
            }
        } else {
            print(reducedImage.imageOrientation.rawValue)
            
            let rotatedImage = UIImage(cgImage: reducedImage.cgImage!, scale: reducedImage.scale, orientation: managePhotoOrientation())
            
            visualRecognition.classify(image: rotatedImage, threshold: localThreshold, classifierIDs: [classifierId], failure: failure) { classifiedImages in
                if classifiedImages.images.count > 0 && classifiedImages.images[0].classifiers.count > 0 {
                    // Update UI on main thread
                    DispatchQueue.main.async {
                        self.dismiss(animated: false, completion: nil)
                        self.pushResults(classes: classifiedImages.images[0].classifiers[0].classes)
                    }
                }
            }
        }
    }
    
    func dismissResults() {
        pushResults(classes: [], position: .closed)
    }
    
    func pushResults(classes: [VisualRecognitionV3.ClassResult], position: PulleyPosition = .partiallyRevealed) {
        guard let drawer = pulleyViewController?.drawerContentViewController as? ResultsTableViewController else {
            return
        }
        drawer.classifications = classes
        pulleyViewController?.setDrawerPosition(position: position, animated: true)
        drawer.tableView.reloadData()
    }
    
    func showClassifyUI(forImage image: UIImage) {
        tempImageView.image = image
        tempImageView.isHidden = false
        captureButton.isHidden = true
        switchCameraButton.isHidden = true
        retakeButton.isHidden = false
        pickerView.isHidden = true
        selectUI.isHidden = true
    }
    
    func resetUI() {
        tempImageView.subviews.forEach({ $0.removeFromSuperview() })
        switchCameraButton.isHidden = false
        pickerView.isHidden = false
        tempImageView.isHidden = true
        captureButton.isHidden = false
        retakeButton.isHidden = true
        selectUI.isHidden = false
        dismissResults()
    }
    
    // MARK: - IBActions
    
    @IBAction func takePhoto() {
        photoOutput?.capturePhoto(with: AVCapturePhotoSettings(), delegate: self)
    }
    
    @IBAction func switchCamera() {
        usingFrontCamera = !usingFrontCamera
        initializeCamera()
    }
    
    @IBAction func retake() {
        resetUI()
    }
}

// MARK: - Error Handling

extension ClassifyViewController {
    func showAlert(_ alertTitle: String, alertMessage: String) {
        let alert = UIAlertController(title: alertTitle, message: alertMessage, preferredStyle: UIAlertControllerStyle.alert)
        alert.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.default, handler: nil))
        self.present(alert, animated: true, completion: nil)
    }
    
    func modelUpdateFail(error: Error) {
        let error = error as NSError
        var errorMessage = ""
        
        switch error.code {
        case 403:
            errorMessage = "Please check your Visual Recognition API key and try again."
        case 401:
            errorMessage = "Invalid credentials. Please check your Visual Recognition credentials and try again."
        case 500:
            errorMessage = "Internal server error. Please try again."
        default:
            errorMessage = "Please try again."
        }
        showAlert("Unable to download model", alertMessage: errorMessage)
    }
}

// MARK: - AKPickerViewDataSource

extension ClassifyViewController: AKPickerViewDataSource {
    func numberOfItemsInPickerView(_ pickerView: AKPickerView) -> Int {
        return classifiers.count
    }
    
    func pickerView(_ pickerView: AKPickerView, titleForItem item: Int) -> String {
        return classifiers[item]
    }
}

// MARK: - AVCapturePhotoCaptureDelegate

extension ClassifyViewController: AVCapturePhotoCaptureDelegate {
    func managePhotoOrientation() -> UIImageOrientation {
        let currentDevice = UIDevice.current
        UIDevice.current.beginGeneratingDeviceOrientationNotifications()
        let deviceOrientation = currentDevice.orientation
        
        if deviceOrientation == .portrait {
            print("Device: Portrait")
            return .up
        } else if (deviceOrientation == .landscapeLeft) {
            print("Device: LandscapeLeft")
            return .left
        } else if (deviceOrientation == .landscapeRight) {
            print("Device LandscapeRight")
            return .right
        } else if (deviceOrientation == .portraitUpsideDown) {
            print("Device PortraitUpsideDown")
            return .down
        } else {
            return .up
        }
    }
    
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        if let error = error {
            print(error.localizedDescription)
            return
        }
        guard let photoData = photo.fileDataRepresentation() else {
            return
        }
        guard let image = UIImage(data: photoData) else {
            return
        }
        classifyImage(for: image)
    }
}
