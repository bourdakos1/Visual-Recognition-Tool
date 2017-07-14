//
//  CameraView.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 3/17/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import AVFoundation
import Alamofire

class MainCameraViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate, AVCapturePhotoCaptureDelegate, AKPickerViewDelegate, AKPickerViewDataSource {
    
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
//    var image = UIImage()
    @IBOutlet var cameraView: UIView!
    @IBOutlet var tempImageView: UIImageView!
    
    // All the buttons.
    @IBOutlet var classifiersButton: UIButton!
    @IBOutlet var captureButton: UIButton!
    @IBOutlet var retakeButton: UIButton!
    @IBOutlet var apiKeyDoneButton: UIButton!
    @IBOutlet var apiKeySubmit: UIButton!
    @IBOutlet var apiKeyLogOut: UIButton!
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
            
            // Set the title to be the size of the navigation bar so we can click anywhere.
            apiKey2.frame.size.width = (drawer.navigationController?.navigationBar.frame.width)!
            apiKey2.frame.size.height = (drawer.navigationController?.navigationBar.frame.height)!
            
            // Style the API text.
            apiKey2.layer.shadowOffset = CGSize(width: 0, height: 1)
            apiKey2.layer.shadowOpacity = 0.2
            apiKey2.layer.shadowRadius = 5
            apiKey2.layer.masksToBounds = false
            apiKey2.titleLabel?.font = UIFont.boldSystemFont(ofSize: 17)
            apiKey2.setAttributedTitle(NSAttributedString(string: apiKeyText!, attributes: [NSForegroundColorAttributeName : UIColor.white, NSStrokeColorAttributeName : UIColor(red: 0.6, green: 0.6, blue: 0.6, alpha: 1.0), NSStrokeWidthAttributeName : -0.5]), for: .normal)
            drawer.navigationItem.titleView = apiKey2
            
            let recognizer = UITapGestureRecognizer(target: self, action: #selector(addApiKey))
            drawer.navigationItem.titleView?.isUserInteractionEnabled = true
            drawer.navigationItem.titleView?.addGestureRecognizer(recognizer)
        }
        loadClassifiers()
    }
    
    func loadClassifiers() {
        print("loading classifiers")
        // Load from Watson
        let apiKey = UserDefaults.standard.string(forKey: "api_key")
        
        if apiKey == nil {
            classifiers = []
            classifiers.append(Classifier(name: "Default"))
            pickerView.selectItem(0)
            pickerView.reloadData()
            return
        }
        
        if classifiers.count <= 0 {
            classifiers.append(Classifier(name: "Loading..."))
            pickerView.selectItem(0)
            pickerView.reloadData()
        }
        
        let url = "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers"
        let params = [
            "api_key": apiKey ?? "none",
            "version": "2016-05-20",
            "verbose": "true"
        ]
        Alamofire.request(url, parameters: params).validate().responseJSON { response in
            switch response.result {
            case .success:
                if let json = response.result.value as? [String : Any] {
                    if let classifiersJSON = json["classifiers"] as? [Any] {
                        
                        // Build classifiers from json.
                        var classifiers = [Classifier]()
                        for classifierJSON in classifiersJSON {
                            let classifier = Classifier(json: classifierJSON)!
                            classifiers.append(classifier)
                        }
                        
                        self.classifiers = classifiers.sorted(by: { $0.created > $1.created })
                        self.classifiers.append(Classifier(name: "Default"))
                        
                        // it should be safe to check the first and last date and the length is the same
                        // count - 1 to account for no default
                        if !(self.classifiers.first!.created == classifiers.first!.created
                            && self.classifiers[self.classifiers.count - 2].created  == classifiers.last!.created
                            && self.classifiers.count - 1 == classifiers.count) {
                            self.classifiers = []
                            self.classifiers = classifiers
                            self.classifiers.append(Classifier(name: "Default"))
                            
                            if self.select >= self.classifiers.count {
                                self.pickerView.selectItem(self.classifiers.count - 1)
                            }
                            
                            self.pickerView.reloadData()
                            if self.select >= 0 {
                                self.pickerView.selectItem(self.select)
                            }
                        }
                    }
                }
            case .failure(let error):
                print(error)
            }
        }
    }
    
    var classifiers = [Classifier]()
    var select = -1
    
    func numberOfItemsInPickerView(_ pickerView: AKPickerView) -> Int {
        return classifiers.filter({ $0.status == .ready }).count
    }
    
    func pickerView(_ pickerView: AKPickerView, titleForItem item: Int) -> String {
        if classifiers.filter({ $0.status == .ready })[item].classifierId == UserDefaults.standard.string(forKey: "classifier_id") {
            select = item
        }
        return classifiers.filter({ $0.status == .ready })[item].name
    }
    
    func pickerView(_ pickerView: AKPickerView, didSelectItem item: Int) {
        UserDefaults.standard.set(classifiers.filter({ $0.status == .ready })[item].classifierId, forKey: "classifier_id")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        pickerView.delegate = self
        pickerView.dataSource = self
        
        pickerView.interitemSpacing = CGFloat(25.0)
        pickerView.pickerViewStyle = .flat
        pickerView.maskDisabled = true
        pickerView.font = UIFont.boldSystemFont(ofSize: 14)
        pickerView.highlightedFont = UIFont.boldSystemFont(ofSize: 14)
        pickerView.highlightedTextColor = UIColor.white
        pickerView.textColor = UIColor(red: 1, green: 1, blue: 1, alpha: 0.6)
        if classifiers.count <= 0 {
            classifiers.append(Classifier(name: "Loading..."))
        }
        pickerView.reloadData()
        
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
        view.bringSubview(toFront: apiKeyLogOut)
        view.bringSubview(toFront: hintTextView)
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
            
//            let url = "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify"
//
//            var r = URLRequest(url: URL(string: url)!)
//
//            r.query(params: [
//                "api_key": apiKey!,
//                "version": "2016-05-20",
//                "threshold": "0",
//                "classifier_ids": "\(classifierId ?? "default")"
//            ])
//
//            // Attach the small image at 40% quality.
//            r.attach(
//                jpeg: UIImageJPEGRepresentation(reducedImage, 0.4)!,
//                filename: "test.jpg"
//            )
//
//            let task = URLSession.shared.dataTask(with: r) { data, response, error in
//                // Check for fundamental networking error.
//                guard let data = data, error == nil else {
//                    return
//                }
//
//                var json: AnyObject?
//
//                do {
//                    json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as AnyObject
//                } catch {
//                    print("Error: \(error)")
//                }
//
//                guard let images = json?["images"] as? [Any],
//                    let image = images.first as? [String: Any],
//                    let classifiers = image["classifiers"] as? [Any],
//                    let classifier = classifiers.first as? [String: Any],
//                    let classes = classifier["classes"] as? [Any] else {
//                        print("Error: No classes returned.")
//                        var myNewData = [[String: Any]]()
//
//                        myNewData.append([
//                            "class_name": "No classes found" as Any,
//                            "score": CGFloat(0.0) as Any
//                        ])
//                        self.push(data: myNewData)
//                        return
//                }
//
//                var myNewData = [[String: Any]]()
//
//                for case let classObj as [String: Any] in classes {
//                    myNewData.append([
//                        "class_name": classObj["class"] as Any,
//                        "score": classObj["score"] as Any
//                    ])
//                }
//
//                // Sort data by score and reload table.
//                myNewData = myNewData.sorted(by: { $0["score"] as! CGFloat > $1["score"] as! CGFloat})
//                self.push(data: myNewData)
//            }
//            task.resume()
            
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
        // Escape if they are already logged in with this key.
        if key == UserDefaults.standard.string(forKey: "api_key") {
            return
        }
        
        apiKeyDone()
        
        let alert = UIAlertController(title: nil, message: "Please wait...", preferredStyle: .alert)
        
        alert.view.tintColor = UIColor.black
        let loadingIndicator: UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRect(x: 10, y: 5, width: 50, height: 50)) as UIActivityIndicatorView
        loadingIndicator.hidesWhenStopped = true
        loadingIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.gray
        loadingIndicator.startAnimating()
        
        alert.view.addSubview(loadingIndicator)
        present(alert, animated: true, completion: nil)
        
//        var r  = URLRequest(url: URL(string: "https://gateway-a.watsonplatform.net/visual-recognition/api")!)
//        r.query(params: [
//            "api_key": key,
//            "version": "2016-05-20"
//        ])
//
//        let task = URLSession.shared.dataTask(with: r) { data, response, error in
//            // Check for fundamental networking error.
//            guard let data = data, error == nil else {
//                self.dismiss(animated: true, completion: nil)
//                return
//            }
//
//            do {
//                let json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as AnyObject
//
//                print(json)
//
//                if json["statusInfo"] as! String == "invalid-api-key" {
//                    self.loadClassifiers()
//                    print("Ivalid api key!")
//                    let alert = UIAlertController(title: nil, message: "Invalid api key.", preferredStyle: .alert)
//
//                    let cancelAction = UIAlertAction(title: "Okay", style: .cancel) { action in
//                        print("cancel")
//                    }
//
//                    alert.addAction(cancelAction)
//                    self.dismiss(animated: true, completion: {
//                        self.present(alert, animated: true, completion: nil)
//                    })
//                    return
//                }
//
//            } catch {
//                print("Error: \(error)")
//            }
//
//            DispatchQueue.main.async {
//                print("Key set!")
//                self.dismiss(animated: true, completion: nil)
//                UserDefaults.standard.set(key, forKey: "api_key")
//                self.loadClassifiers()
//
//                let key = self.obscureKey(key: key)
//
//                if let drawer = self.parent as? PulleyViewController {
//                    (drawer.navigationItem.titleView as! UIButton).setAttributedTitle(NSAttributedString(string: key, attributes: [NSForegroundColorAttributeName : UIColor.white, NSStrokeColorAttributeName : UIColor(red: 0.6, green: 0.6, blue: 0.6, alpha: 1.0), NSStrokeWidthAttributeName : -0.5]), for: .normal)
//                }
//            }
//        }
//        task.resume()
    }
    
    @IBAction func unwindToVC(segue: UIStoryboardSegue) {
        
    }
    
    @IBAction func addApiKey() {
        if let drawer = self.parent as? PulleyViewController {
            drawer.navigationController?.navigationBar.isHidden = true
        }
        
        blurredEffectView.isHidden = false
        apiKeyTextField.isHidden = false
        apiKeyDoneButton.isHidden = false
        apiKeySubmit.isHidden = false
        apiKeyLogOut.isHidden = false
        hintTextView.isHidden = false
        
        // If the key isn't set disable the logout button.
        apiKeyLogOut.isEnabled = UserDefaults.standard.string(forKey: "api_key") != nil
        
        apiKeyTextField.becomeFirstResponder()
    }
    
    @IBAction func apiKeyDone() {
        if let drawer = self.parent as? PulleyViewController {
            drawer.navigationController?.navigationBar.isHidden = false
        }
        
        apiKeyTextField.isHidden = true
        apiKeyDoneButton.isHidden = true
        apiKeySubmit.isHidden = true
        apiKeyLogOut.isHidden = true
        hintTextView.isHidden = true
        blurredEffectView.isHidden = true

        view.endEditing(true)
        apiKeyTextField.text = ""
    }
    
    @IBAction func submitApiKey() {
        let key = apiKeyTextField.text
        testKey(key: key!)
    }
    
    @IBAction func logOut() {
        apiKeyDone()
        UserDefaults.standard.set(nil, forKey: "api_key")
        if let drawer = self.parent as? PulleyViewController {
            (drawer.navigationItem.titleView as! UIButton).setAttributedTitle(NSAttributedString(string: "🔑 API Key", attributes: [NSForegroundColorAttributeName : UIColor.white, NSStrokeColorAttributeName : UIColor(red: 0.6, green: 0.6, blue: 0.6, alpha: 1.0), NSStrokeWidthAttributeName : -0.5]), for: .normal)
        }
        loadClassifiers()
    }
    
    @IBAction func takePhoto() {
        photoOutput?.capturePhoto(with: AVCapturePhotoSettings(), delegate: self)
        captureButton.isHidden = true
        retakeButton.isHidden = false
        classifiersButton.isHidden = true
        
        if let drawer = self.parent as? PulleyViewController {
            drawer.navigationController?.navigationBar.isHidden = true
        }
        
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
        classifiersButton.isHidden = false
        
        if let drawer = self.parent as? PulleyViewController {
            drawer.navigationController?.navigationBar.isHidden = false
        }
        
        getTableController { tableController, drawer in
            drawer.setDrawerPosition(position: .closed, animated: true)
            tableController.classes = []
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "showClassifiers",
            let destination = segue.destination as? ClassifiersTableViewController {
            //destination.classifiers = self.classifiers
        }
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

struct Classifier {
    enum Status: String {
        case ready, training, retraining, failed
    }
    
    let name: String
    let classes: [String]
    let classifierId: String
    let created: Date
    let status: Status
}

extension Classifier {
    init(name: String) {
        self.name = name
        self.classes = [String]()
        self.classifierId = String()
        self.created = Date()
        self.status = .ready
    }
}
    
extension Classifier {
    init?(json: Any) {
        guard let json = json as? [String: Any]
            else {
                return nil
        }
        
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        
        guard let name = json["name"] as? String,
            let classesArray = json["classes"] as? [Any],
            let classifierId = json["classifier_id"] as? String,
            let created = json["created"] as? String,
            let date = dateFormatter.date(from: created),
            let statusString = json["status"] as? String,
            let status = Status(rawValue: statusString)
            else {
                return nil
        }
        
        var classes = [String]()
        for classJSON in classesArray {
            guard let classJSON = classJSON as? [String: Any],
                let classItem = classJSON["class"] as? String
                else {
                    return nil
            }
            classes.append(classItem)
        }
        
        self.name = name
        self.classes = classes
        self.classifierId = classifierId
        self.created = date
        self.status = status
    }
}
