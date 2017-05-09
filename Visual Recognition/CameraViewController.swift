//
//  CameraView.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 3/17/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import AVFoundation

class CameraViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate, AVCapturePhotoCaptureDelegate {
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    let VISION_API_KEY: String
    
    var captureSession: AVCaptureSession?
    var photoOutput: AVCapturePhotoOutput?
    var previewLayer: AVCaptureVideoPreviewLayer?
    @IBOutlet var cameraView: UIView!
    @IBOutlet var tempImageView: UIImageView!
    
    required init?(coder aDecoder: NSCoder) {
        var keys: NSDictionary?
        
        if let path = Bundle.main.path(forResource: "Keys", ofType: "plist") {
            keys = NSDictionary(contentsOfFile: path)
        }
        
        VISION_API_KEY = (keys?["VISION_API_KEY"] as? String)!
        
        super.init(coder: aDecoder)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        var apiKeyText = UserDefaults.standard.string(forKey: "api_key")
        
        if apiKeyText == nil || apiKeyText == "" {
            apiKeyText = "🔑 API Key"
        } else {
            let a = apiKeyText![apiKeyText!.index(apiKeyText!.startIndex, offsetBy: 0)]
            
            let start = apiKeyText!.index(apiKeyText!.endIndex, offsetBy: -3)
            let end = apiKeyText!.index(apiKeyText!.endIndex, offsetBy: 0)
            let b = apiKeyText![Range(start ..< end)]
            
            apiKeyText = "🔑 \(a)•••••••••••••••••••••••••••••••••••••\(b)"
        }
        
        apiKey.layer.shadowOffset = CGSize(width: 0, height: 1)
        apiKey.layer.shadowOpacity = 0.2
        apiKey.layer.shadowRadius = 5
        apiKey.layer.masksToBounds = false
        apiKey.setAttributedTitle(NSAttributedString(string: apiKeyText!, attributes: [NSForegroundColorAttributeName : UIColor.white, NSStrokeColorAttributeName : UIColor(red: 0.6, green: 0.6, blue: 0.6, alpha: 1.0), NSStrokeWidthAttributeName : -0.5]), for: .normal)
        apiKeyTextField.attributedPlaceholder = NSAttributedString(string: "API Key", attributes: [NSForegroundColorAttributeName: UIColor(red: 1, green: 1, blue: 1, alpha: 0.5)])
        
        apiKeyTextField.setLeftPaddingPoints(20)
        apiKeyTextField.setRightPaddingPoints(50)

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
                
                // Initialize a AVCaptureMetadataOutput object and set it as the output device to the capture session.
                let captureMetadataOutput = AVCaptureMetadataOutput()
                captureSession?.addOutput(captureMetadataOutput)
                captureMetadataOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
                captureMetadataOutput.metadataObjectTypes = [AVMetadataObjectTypeQRCode]
            }
        } catch {
            print("error")
        }
        previewLayer?.frame = view.bounds
        
        captureButton.isHidden = false
        hideRetake()
        view.bringSubview(toFront: captureButton)
    }
    
    func captureOutput(_ captureOutput: AVCaptureOutput!, didOutputMetadataObjects metadataObjects: [Any]!, from connection: AVCaptureConnection!) {
        // Check if the metadataObjects array is not nil and it contains at least one object.
        if metadataObjects == nil || metadataObjects.count == 0 {
            print("No QR code is detected")
            return
        }
        
        // Get the metadata object.
        let metadataObj = metadataObjects[0] as! AVMetadataMachineReadableCodeObject
        
        guard let qrCode = metadataObj.stringValue else {
            return
        }
        print(qrCode)
        testKey(key: qrCode)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
    }
    
    func didPressTakePhoto() {
        photoOutput?.capturePhoto(with: AVCapturePhotoSettings(), delegate: self)
    }
    
    func capture(_ captureOutput: AVCapturePhotoOutput, didFinishProcessingPhotoSampleBuffer photoSampleBuffer: CMSampleBuffer?, previewPhotoSampleBuffer: CMSampleBuffer?, resolvedSettings: AVCaptureResolvedPhotoSettings, bracketSettings: AVCaptureBracketedStillImageSettings?, error: Error?) {
        
        if photoSampleBuffer != nil {
            let imageData = AVCapturePhotoOutput.jpegPhotoDataRepresentation(forJPEGSampleBuffer: photoSampleBuffer!, previewPhotoSampleBuffer: previewPhotoSampleBuffer)
            let dataProvider  = CGDataProvider(data: imageData! as CFData)
            let cgImageRef = CGImage(jpegDataProviderSource: dataProvider!, decode: nil, shouldInterpolate: true, intent: .defaultIntent)

            let image = UIImage(cgImage: cgImageRef!, scale: 1.0, orientation: UIImageOrientation.right)

            let image2 = image.resized(toWidth: 300)!

            print("dimensions : \(image2.size)")
            print("size : \(UIImageJPEGRepresentation(image2, 0.4)!.count)")

            var apiKey = UserDefaults.standard.string(forKey: "api_key")

            if apiKey == nil || apiKey == "" {
                apiKey = self.VISION_API_KEY
            }

            let escapedApiKey = apiKey?.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)


            /// UPLOAD

            let classifierId = UserDefaults.standard.string(forKey: "classifier_id")

            print(escapedApiKey!)

            var r  = URLRequest(url: URL(string: "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key=\(escapedApiKey!)&version=2016-05-20&threshold=0&classifier_ids=\(classifierId ?? "default")")!)
            r.httpMethod = "POST"
            let boundary = "Boundary-\(UUID().uuidString)"
            r.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

            r.httpBody = self.createBody(parameters: [:],
                                    boundary: boundary,
                                    data: UIImageJPEGRepresentation(image2, 0.4)!,
                                    mimeType: "image/jpg",
                                    filename: "hello.jpg")

            let task = URLSession.shared.dataTask(with: r) { data, response, error in
                guard let data = data, error == nil else {               // check for fundamental networking error
                    return
                }
                do {
                    let json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as AnyObject
                    if let drawer = self.parent as? PulleyViewController {
                        if let tablesdsa = drawer.drawerContentViewController as? TableViewController {
                            DispatchQueue.main.async{
                                var myNewData : [[String: AnyObject]] = []
                                let data = ((((json["images"] as! NSArray)[0] as AnyObject)["classifiers"] as! NSArray)[0] as AnyObject)["classes"] as! NSArray
                                for myClass in data {
                                    print ((myClass as AnyObject)["class"] as! String)
                                    myNewData.append(["class_name":(myClass as AnyObject)["class"] as AnyObject, "score":(myClass as AnyObject)["score"] as AnyObject])
                                }
                                myNewData = myNewData.sorted(by: { $0["score"] as! CGFloat > $1["score"] as! CGFloat})
                                tablesdsa.myarray = myNewData
                                tablesdsa.tableView.reloadData()
                            }
                        }
                    }
                } catch let error as NSError {
                    print("error : \(error)")
                }
            }
            task.resume()
            
            self.tempImageView.image = image
            self.tempImageView.isHidden = false
        }
    }
    
    func createBody(parameters: [String: String],
                    boundary: String,
                    data: Data,
                    mimeType: String,
                    filename: String) -> Data {
        let body = NSMutableData()
        
        let boundaryPrefix = "--\(boundary)\r\n"
        
        for (key, value) in parameters {
            body.appendString(boundaryPrefix)
            body.appendString("Content-Disposition: form-data; name=\"\(key)\"\r\n\r\n")
            body.appendString("\(value)\r\n")
        }
        
        body.appendString(boundaryPrefix)
        body.appendString("Content-Disposition: form-data; name=\"file\"; filename=\"\(filename)\"\r\n")
        body.appendString("Content-Type: \(mimeType)\r\n\r\n")
        body.append(data)
        body.appendString("\r\n")
        body.appendString("--".appending(boundary.appending("--")))
        
        return body as Data
    }
    
    var didTakePhoto = Bool()
    
    func didPressTakeAnother() {
        if didTakePhoto {
            tempImageView.isHidden = true
            didTakePhoto = false
            captureButton.isHidden = false
            hideRetake()
            showAPI()
            showButton()

            if let drawer = self.parent as? PulleyViewController
            {
                if let tablesdsa = drawer.drawerContentViewController as? TableViewController {
                    tablesdsa.cameraHidden = false
                    tablesdsa.myarray = []
                    tablesdsa.tableView.reloadData()
                }
            }
        } else {
            captureSession?.startRunning()
            didTakePhoto = true
            didPressTakePhoto()
            captureButton.isHidden = true
            showRetake()
            hideAPI()
            hideButton()

            if let drawer = self.parent as? PulleyViewController
            {
                if let tablesdsa = drawer.drawerContentViewController as? TableViewController {
                    tablesdsa.cameraHidden = true
                    tablesdsa.tableView.reloadData()
                }
            }
        }
    }
    
    func hideButton() {
        classifiersButton.isEnabled = false
        classifiersButton.isHidden = true
    }
    
    func showButton() {
        classifiersButton.isEnabled = true
        classifiersButton.isHidden = false
    }
    
    func hideRetake() {
        retakeButton.isEnabled = false
        retakeButton.isHidden = true
    }
    
    func showRetake() {
        retakeButton.isEnabled = true
        retakeButton.isHidden = false
    }
    
    func hideAPI() {
        apiKey.isEnabled = false
        apiKey.isHidden = true
    }
    
    func showAPI() {
        apiKey.isEnabled = true
        apiKey.isHidden = false
    }
    
    
    @IBOutlet var classifiersButton: UIButton!
    @IBOutlet var captureButton: UIButton!
    @IBOutlet var retakeButton: UIButton!
    @IBOutlet var apiKeyDoneButton: UIButton!
    @IBOutlet var apiKey: UIButton!
    @IBOutlet var apiKeySubmit: UIButton!
    @IBOutlet var apiKeyTextField: UITextField!
    @IBOutlet var hintTextView: UITextView!
    
    let blurredEffectView = UIVisualEffectView(effect: UIBlurEffect(style: .dark))
    
    @IBAction func unwindToVC(segue: UIStoryboardSegue) {

    }
    
    @IBAction func addApiKey() {
        blurredEffectView.frame = CGRect(x: 0, y: 0, width: view.bounds.width, height: view.bounds.height)
        view.addSubview(blurredEffectView)
        
        apiKeyTextField.isHidden = false
        apiKeyTextField.becomeFirstResponder()
        view.addSubview(apiKeyTextField)
        
        apiKeyDoneButton.isHidden = false
        view.addSubview(apiKeyDoneButton)
        
        apiKeySubmit.isHidden = false
        view.addSubview(apiKeySubmit)
        
        
        hintTextView.isHidden = false
        view.addSubview(hintTextView)
        print("add view")
    }
    
    @IBAction func apiKeyDone() {
        apiKeyTextField.isHidden = true
        apiKeyDoneButton.isHidden = true
        apiKeySubmit.isHidden = true
        hintTextView.isHidden = true
        
        blurredEffectView.removeFromSuperview()
        view.endEditing(true)
        apiKeyTextField.text = ""
        print("remove view")
    }
    
    @IBAction func submitApiKey() {
        let key = apiKeyTextField.text
        testKey(key: key!)
    }
    
    func testKey(key: String) {
        var key = key.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)
        var r  = URLRequest(url: URL(string: "https://gateway-a.watsonplatform.net/visual-recognition/api?api_key=\(key!)&version=2016-05-20")!)
        r.httpMethod = "POST"
        
        let task = URLSession.shared.dataTask(with: r) { data, response, error in
            guard let data = data, error == nil else {               // check for fundamental networking error
                return
            }
            do {
                let json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as AnyObject
                
                if json["statusInfo"] as! String == "invalid-api-key" {
                    print("Ivalid api key!")
                } else {
                    UserDefaults.standard.set(key, forKey: "api_key")
                    let a = key![key!.index(key!.startIndex, offsetBy: 0)]
                    
                    let start = key!.index(key!.endIndex, offsetBy: -3)
                    let end = key!.index(key!.endIndex, offsetBy: 0)
                    let b = key![Range(start ..< end)]
                    
                    key = "🔑 \(a)•••••••••••••••••••••••••••••••••••••\(b)"
                    self.apiKey.setAttributedTitle(NSAttributedString(string: key!, attributes: [NSForegroundColorAttributeName : UIColor.white, NSStrokeColorAttributeName : UIColor(red: 0.6, green: 0.6, blue: 0.6, alpha: 1.0), NSStrokeWidthAttributeName : -0.5]), for: .normal)
                }
                DispatchQueue.main.async {
                    self.apiKeyTextField.isHidden = true
                    self.apiKeyDoneButton.isHidden = true
                    self.apiKeySubmit.isHidden = true
                    self.hintTextView.isHidden = true
                    self.blurredEffectView.removeFromSuperview()
                    self.view.endEditing(true)
                    self.apiKeyTextField.text = ""
                    print("remove view")
                }
            } catch let error as NSError {
                print("error : \(error)")
                DispatchQueue.main.async {
                    UserDefaults.standard.set(key, forKey: "api_key")
                    let a = key![key!.index(key!.startIndex, offsetBy: 0)]
                    
                    let start = key!.index(key!.endIndex, offsetBy: -3)
                    let end = key!.index(key!.endIndex, offsetBy: 0)
                    let b = key![Range(start ..< end)]
                    
                    key = "🔑 \(a)•••••••••••••••••••••••••••••••••••••\(b)"

                    self.apiKey.setAttributedTitle(NSAttributedString(string: key!, attributes: [NSForegroundColorAttributeName : UIColor.white, NSStrokeColorAttributeName : UIColor(red: 0.6, green: 0.6, blue: 0.6, alpha: 1.0), NSStrokeWidthAttributeName : -0.5]), for: .normal)
                    self.apiKeyTextField.isHidden = true
                    self.apiKeyDoneButton.isHidden = true
                    self.apiKeySubmit.isHidden = true
                    self.hintTextView.isHidden = true
                    self.blurredEffectView.removeFromSuperview()
                    self.view.endEditing(true)
                    self.apiKeyTextField.text = ""
                    print("remove view")
                }
            }
        }
        task.resume()
    }
    
    @IBAction func takePic() {
        didPressTakeAnother()
    }
    
    @IBAction func retake() {
        didPressTakeAnother()
    }
    
}

extension NSMutableData {
    func appendString(_ string: String) {
        let data = string.data(using: String.Encoding.utf8, allowLossyConversion: false)
        append(data!)
    }
}

extension UIImage {
    func resized(withPercentage percentage: CGFloat) -> UIImage? {
        let canvasSize = CGSize(width: size.width * percentage, height: size.height * percentage)
        UIGraphicsBeginImageContextWithOptions(canvasSize, false, scale)
        defer { UIGraphicsEndImageContext() }
        draw(in: CGRect(origin: .zero, size: canvasSize))
        return UIGraphicsGetImageFromCurrentImageContext()
    }
    func resized(toWidth width: CGFloat) -> UIImage? {
        let canvasSize = CGSize(width: width, height: CGFloat(ceil(width/size.width * size.height)))
        UIGraphicsBeginImageContextWithOptions(canvasSize, false, scale)
        defer { UIGraphicsEndImageContext() }
        draw(in: CGRect(origin: .zero, size: canvasSize))
        return UIGraphicsGetImageFromCurrentImageContext()
    }
}

extension UITextField {
    func setLeftPaddingPoints(_ amount:CGFloat){
        let paddingView = UIView(frame: CGRect(x: 0, y: 0, width: amount, height: self.frame.size.height))
        self.leftView = paddingView
        self.leftViewMode = .always
    }
    func setRightPaddingPoints(_ amount:CGFloat) {
        let paddingView = UIView(frame: CGRect(x: 0, y: 0, width: amount, height: self.frame.size.height))
        self.rightView = paddingView
        self.rightViewMode = .always
    }
}
