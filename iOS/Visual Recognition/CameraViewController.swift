//
//  CameraView.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 3/17/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import AVFoundation

class CameraViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate, AVCapturePhotoCaptureDelegate, AKPickerViewDelegate, AKPickerViewDataSource {
    
    // Set the StatusBar color.
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    // Blurred effect for the API key form.
    let blurredEffectView = UIVisualEffectView(effect: UIBlurEffect(style: .dark))
    
    // Demo API key constant.
    let VISION_API_KEY: String
    
    // Camera variables.
    var captureSession: AVCaptureSession?
    var photoOutput: AVCapturePhotoOutput?
    var previewLayer: AVCaptureVideoPreviewLayer?
    @IBOutlet var cameraView: UIView!
    @IBOutlet var tempImageView: UIImageView!
    
    // All the buttons.
    @IBOutlet var classifiersButton: UIButton!
    @IBOutlet var captureButton: UIButton!
    @IBOutlet var retakeButton: UIButton!
    @IBOutlet var apiKeyDoneButton: UIButton!
    @IBOutlet var apiKey: UIButton!
    @IBOutlet var apiKeySubmit: UIButton!
    @IBOutlet var apiKeyTextField: UITextField!
    @IBOutlet var hintTextView: UITextView!
    
    @IBOutlet var pickerView: AKPickerView!
    
    // Init with the demo API key.
    required init?(coder aDecoder: NSCoder) {
        var keys: NSDictionary?
        
        if let path = Bundle.main.path(forResource: "Keys", ofType: "plist") {
            keys = NSDictionary(contentsOfFile: path)
        }
        
        VISION_API_KEY = (keys?["VISION_API_KEY"] as? String)!
        
        super.init(coder: aDecoder)
    }
    
    override open func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        if let drawer = self.parent as? PulleyViewController {
            // Look in user defaults to see if we have a real key.
            var apiKeyText = UserDefaults.standard.string(forKey: "api_key")
            
            if apiKeyText == nil || apiKeyText == "" {
                // If we don't have a key set the text of the bar to "API Key".
                apiKeyText = "🔑 API Key"
            } else {
                // If we do have a key, obscure it.
                apiKeyText = obscureKey(key: apiKeyText!)
            }
            
            let apiKey2 = UIButton()
            
            // Style the API text.
            apiKey2.layer.shadowOffset = CGSize(width: 0, height: 1)
            apiKey2.layer.shadowOpacity = 0.2
            apiKey2.layer.shadowRadius = 5
            apiKey2.layer.masksToBounds = false
            apiKey2.titleLabel?.font = UIFont.boldSystemFont(ofSize: 17)
            apiKey2.setAttributedTitle(NSAttributedString(string: apiKeyText!, attributes: [NSForegroundColorAttributeName : UIColor.white, NSStrokeColorAttributeName : UIColor(red: 0.6, green: 0.6, blue: 0.6, alpha: 1.0), NSStrokeWidthAttributeName : -0.5]), for: .normal)
            drawer.navigationItem.titleView = apiKey2
        }
    }
    
    var classifiers = [[String: AnyObject]]()
    var select = -1
    
    func numberOfItemsInPickerView(_ pickerView: AKPickerView) -> Int {
        return classifiers.count
    }
    
    func pickerView(_ pickerView: AKPickerView, titleForItem item: Int) -> String {
        if classifiers[item]["classifier_id"] as? String == UserDefaults.standard.string(forKey: "classifier_id") {
            select = item
        }
        return classifiers[item]["name"] as! String
    }
    
    func pickerView(_ pickerView: AKPickerView, didSelectItem item: Int) {
        UserDefaults.standard.set(classifiers[item]["classifier_id"], forKey: "classifier_id")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        classifiers.append(["name": "Loading..." as AnyObject])
        
        pickerView.delegate = self
        pickerView.dataSource = self
        
        pickerView.interitemSpacing = CGFloat(25.0)
        pickerView.pickerViewStyle = .flat
        pickerView.maskDisabled = true
        pickerView.font = UIFont.boldSystemFont(ofSize: 14)
        pickerView.highlightedFont = UIFont.boldSystemFont(ofSize: 14)
        pickerView.highlightedTextColor = UIColor.white
        pickerView.textColor = UIColor(red: 1, green: 1, blue: 1, alpha: 0.6)
        
        
        // Give the API TextField styles and a stroke.
        apiKeyTextField.attributedPlaceholder = NSAttributedString(string: "API Key", attributes: [NSForegroundColorAttributeName: UIColor(red: 1, green: 1, blue: 1, alpha: 0.5)])
        apiKeyTextField.setLeftPaddingPoints(20)
        apiKeyTextField.setRightPaddingPoints(50)
        
        initializeCamera()

        // Retake just resets the UI.
        retake()
        view.bringSubview(toFront: captureButton)
        
        // Create and hide the blur effect.
        blurredEffectView.frame = CGRect(x: 0, y: 0, width: view.bounds.width, height: view.bounds.height)
        view.addSubview(blurredEffectView)
        blurredEffectView.isHidden = true
        
        // Bring all the API key views to the front
        view.bringSubview(toFront: apiKeyTextField)
        view.bringSubview(toFront: apiKeyDoneButton)
        view.bringSubview(toFront: apiKeySubmit)
        view.bringSubview(toFront: hintTextView)
        
        // Load from Watson
        let apiKey = UserDefaults.standard.string(forKey: "api_key")
        
        var r  = URLRequest(url: URL(string: "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers")!)
        
        r.query(params: [
            "api_key": apiKey!,
            "version": "2016-05-20",
            "verbose": "true"
            ])
        
        let task = URLSession.shared.dataTask(with: r) { data, response, error in
            // Check for fundamental networking error.
            guard let data = data, error == nil else {
                return
            }
            do {
                let json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as AnyObject
                DispatchQueue.main.async{
                    var data = json["classifiers"] as! [[String: AnyObject]]
                    
                    let dateFormatter = DateFormatter()
                    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
                    data = data.sorted(by: { dateFormatter.date(from: $0["created"] as! String)! > dateFormatter.date(from: $1["created"] as! String)! }).filter({ $0["status"] as? String == "ready" })
                    self.classifiers = data
                    self.classifiers.append(["name": "Default" as AnyObject, "status": "ready" as AnyObject])
                    
                    self.pickerView.reloadData()
                    if self.select >= 0 {
                        self.pickerView.selectItem(self.select)
                    }
                }
            } catch let error as NSError {
                print("error : \(error)")
            }
        }
        task.resume()
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
                
                // Initialize a AVCaptureMetadataOutput object and set it as the output device to the capture session.
                let captureMetadataOutput = AVCaptureMetadataOutput()
                captureSession?.addOutput(captureMetadataOutput)
                captureMetadataOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
                captureMetadataOutput.metadataObjectTypes = [AVMetadataObjectTypeQRCode]
            }
        } catch {
            print("Error: \(error)")
        }
        previewLayer?.frame = view.bounds
    }
    
    // Delegate for QR Codes.
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
    
    // Delegate for Camera.
    func capture(_ captureOutput: AVCapturePhotoOutput, didFinishProcessingPhotoSampleBuffer photoSampleBuffer: CMSampleBuffer?, previewPhotoSampleBuffer: CMSampleBuffer?, resolvedSettings: AVCaptureResolvedPhotoSettings, bracketSettings: AVCaptureBracketedStillImageSettings?, error: Error?) {
        
        var apiKey = UserDefaults.standard.string(forKey: "api_key")
        
        if apiKey == nil || apiKey == "" {
            apiKey = VISION_API_KEY
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
            
            let reducedImage = image.resized(toWidth: 300)!
            
            let classifierId = UserDefaults.standard.string(forKey: "classifier_id")
            
            let url = "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify"
            
            var r = URLRequest(url: URL(string: url)!)
            
            r.query(params: [
                "api_key": apiKey!,
                "version": "2016-05-20",
                "threshold": "0",
                "classifier_ids": "\(classifierId ?? "default")"
            ])
            
            // Attach the small image at 40% quality.
            r.attach(
                jpeg: UIImageJPEGRepresentation(reducedImage, 0.4)!,
                filename: "test.jpg"
            )
            
            let task = URLSession.shared.dataTask(with: r) { data, response, error in
                // Check for fundamental networking error.
                guard let data = data, error == nil else {
                    return
                }
                
                var json: AnyObject?
                
                do {
                    json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as AnyObject
                } catch {
                    print("Error: \(error)")
                }
                
                guard let images = json?["images"] as? [Any],
                    let image = images.first as? [String: Any],
                    let classifiers = image["classifiers"] as? [Any],
                    let classifier = classifiers.first as? [String: Any],
                    let classes = classifier["classes"] as? [Any] else {
                        print("Error: No classes returned.")
                        var myNewData = [[String: Any]]()
                        
                        myNewData.append([
                            "class_name": "No classes found" as Any,
                            "score": CGFloat(0.0) as Any
                        ])
                        self.push(data: myNewData)
                        return
                }
                
                var myNewData = [[String: Any]]()
                
                for case let classObj as [String: Any] in classes {
                    myNewData.append([
                        "class_name": classObj["class"] as Any,
                        "score": classObj["score"] as Any
                    ])
                }
                
                // Sort data by score and reload table.
                myNewData = myNewData.sorted(by: { $0["score"] as! CGFloat > $1["score"] as! CGFloat})
                self.push(data: myNewData)
            }
            task.resume()
            
            // Set the screen to our captured photo.
            tempImageView.image = image
            tempImageView.isHidden = false
        }
    }
    
    // Convenience method for pushing data to the TableView.
    func push(data: [[String: Any]]) {
        getTableController { tableController, drawer in
            tableController.classes = data
            self.dismiss(animated: false, completion: nil)
            drawer.setDrawerPosition(position: .partiallyRevealed, animated: true)
        }
    }
    
    // Convenience method for reloading the TableView.
    func getTableController(run: @escaping (_ tableController: ResultsTableViewController, _ drawer: PulleyViewController) -> Void) {
        if let drawer = self.parent as? PulleyViewController {
            if let tableController = drawer.drawerContentViewController as? ResultsTableViewController {
                DispatchQueue.main.async {
                    run(tableController, drawer)
                    tableController.tableView.reloadData()
                }
            }
        }
    }
    
    // Convenience method for obscuring the API key.
    func obscureKey(key: String) -> String {
        let a = key[key.index(key.startIndex, offsetBy: 0)]
        
        let start = key.index(key.endIndex, offsetBy: -3)
        let end = key.index(key.endIndex, offsetBy: 0)
        let b = key[Range(start ..< end)]
        
        return "🔑 \(a)•••••••••••••••••••••••••••••••••••••\(b)"
    }
    
    // Verify the API entered or scanned.
    func testKey(key: String) {
        var r  = URLRequest(url: URL(string: "https://gateway-a.watsonplatform.net/visual-recognition/api")!)
        r.query(params: [
            "api_key": key,
            "version": "2016-05-20"
        ])
        
        let task = URLSession.shared.dataTask(with: r) { data, response, error in
            // Check for fundamental networking error.
            guard let data = data, error == nil else {
                return
            }
            
            DispatchQueue.main.async {
                self.apiKeyDone()
            }
            
            do {
                let json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as AnyObject
                
                if json["statusInfo"] as! String == "invalid-api-key" {
                    print("Ivalid api key!")
                    return
                }
                
            } catch {
                print("Error: \(error)")
            }
            
            DispatchQueue.main.async {
                print("Key set!")
                UserDefaults.standard.set(key, forKey: "api_key")
                
                let key = self.obscureKey(key: key)
                
                self.apiKey.setAttributedTitle(NSAttributedString(string: key, attributes: [NSForegroundColorAttributeName : UIColor.white, NSStrokeColorAttributeName : UIColor(red: 0.6, green: 0.6, blue: 0.6, alpha: 1.0), NSStrokeWidthAttributeName : -0.5]), for: .normal)
            }
        }
        task.resume()
    }
    
    @IBAction func unwindToVC(segue: UIStoryboardSegue) {
        
    }
    
    @IBAction func addApiKey() {
        blurredEffectView.isHidden = false
        apiKeyTextField.isHidden = false
        apiKeyDoneButton.isHidden = false
        apiKeySubmit.isHidden = false
        hintTextView.isHidden = false
        
        apiKeyTextField.becomeFirstResponder()
    }
    
    @IBAction func apiKeyDone() {
        apiKeyTextField.isHidden = true
        apiKeyDoneButton.isHidden = true
        apiKeySubmit.isHidden = true
        hintTextView.isHidden = true
        blurredEffectView.isHidden = true
        
        view.endEditing(true)
        apiKeyTextField.text = ""
    }
    
    @IBAction func submitApiKey() {
        let key = apiKeyTextField.text
        testKey(key: key!)
    }
    
    @IBAction func takePhoto() {
        photoOutput?.capturePhoto(with: AVCapturePhotoSettings(), delegate: self)
        captureButton.isHidden = true
        retakeButton.isHidden = false
        apiKey.isHidden = true
        classifiersButton.isHidden = true
        
        // Show an activity indicator while its loading.
        let alert = UIAlertController(title: nil, message: "Please wait...", preferredStyle: .alert)
        
        alert.view.tintColor = UIColor.black
        let loadingIndicator: UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRect(x: 10, y: 5, width: 50, height: 50)) as UIActivityIndicatorView
        loadingIndicator.hidesWhenStopped = true
        loadingIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.gray
        loadingIndicator.startAnimating()
        
        alert.view.addSubview(loadingIndicator)
        present(alert, animated: true, completion: nil)
    }
    
    @IBAction func retake() {
        tempImageView.isHidden = true
        captureButton.isHidden = false
        retakeButton.isHidden = true
        apiKey.isHidden = false
        classifiersButton.isHidden = false
        
        getTableController { tableController, drawer in
            drawer.setDrawerPosition(position: .closed, animated: true)
            tableController.classes = []
        }
    }
}

extension NSMutableData {
    func appendString(_ string: String) {
        let data = string.data(using: String.Encoding.utf8, allowLossyConversion: false)
        append(data!)
    }
}

extension Dictionary {
    func toHttpParameters() -> String {
        let parameterArray = self.map { (key, value) -> String in
            let percentEscapedKey = (key as! String).addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)
            let percentEscapedValue = (value as! String).addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)
            return "\(percentEscapedKey!)=\(percentEscapedValue!)"
        }
        return parameterArray.joined(separator: "&")
    }
}

extension URLRequest {
    mutating func attach(jpeg: Data, filename: String) {
        httpMethod = "POST"
        let boundary = "Boundary-\(UUID().uuidString)"
        setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        httpBody = createBody(
            parameters: [:],
            boundary: boundary,
            data: jpeg,
            mimeType: "image/jpg",
            filename: filename
        )
    }
    
    mutating func attach(zip: Data, name: String) {
        httpMethod = "POST"
        let boundary = "Boundary-\(UUID().uuidString)"
        setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        httpBody = createBody(
            parameters: ["name": "Star Wars"],
            boundary: boundary,
            data: zip,
            mimeType: "application/zip",
            filename: "\(name).zip",
            name: name
        )
    }
    
    private func createBody(parameters: [String: String],
                            boundary: String,
                            data: Data,
                            mimeType: String,
                            filename: String,
                            name: String) -> Data {
        let body = NSMutableData()
        
        let boundaryPrefix = "--\(boundary)\r\n"
        
        for (key, value) in parameters {
            body.appendString(boundaryPrefix)
            body.appendString("Content-Disposition: form-data; name=\"\(key)\"\r\n\r\n")
            body.appendString("\(value)\r\n")
        }
        
        body.appendString(boundaryPrefix)
        // Don't worry about negative examples for now
        body.appendString("Content-Disposition: form-data; name=\"\(name)_positive_examples\"; filename=\"\(filename)\"\r\n")
        body.appendString("Content-Type: \(mimeType)\r\n\r\n")
        body.append(data)
        body.appendString("\r\n")
        
        body.appendString(boundaryPrefix)
        // Don't worry about negative examples for now
        body.appendString("Content-Disposition: form-data; name=\"\(name)2_positive_examples\"; filename=\"\(filename)\"\r\n")
        body.appendString("Content-Type: \(mimeType)\r\n\r\n")
        body.append(data)
        body.appendString("\r\n")
        
        body.appendString("--".appending(boundary.appending("--")))
        
        return body as Data
    }
    
    mutating func query(params: [String: String]) {
        let parameterArray = params.map { (key, value) -> String in
            let percentEscapedKey = key.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)
            let percentEscapedValue = value.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)
            return "\(percentEscapedKey!)=\(percentEscapedValue!)"
        }
        let baseUrl = (url?.absoluteString)!
        url = URL(string: "\(baseUrl)?\(parameterArray.joined(separator: "&"))")
    }
    
    private func createBody(parameters: [String: String],
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
