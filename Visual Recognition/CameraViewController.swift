//
//  CameraView.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 3/17/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit
import AVFoundation

class CameraViewController: UIViewController, UIImagePickerControllerDelegate {
    
    let API_KEY = "<MY_API_KEY>"
    
    var captureSession : AVCaptureSession?
    var stillImageOutput : AVCaptureStillImageOutput?
    var previewLayer : AVCaptureVideoPreviewLayer?
    @IBOutlet var cameraView: UIView!
    @IBOutlet var tempImageView: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
    
        captureSession = AVCaptureSession()
        captureSession?.sessionPreset = AVCaptureSessionPreset1920x1080
        
        let backCamera = AVCaptureDevice.defaultDevice(withMediaType: AVMediaTypeVideo)
        
        do {
            let input = try AVCaptureDeviceInput(device: backCamera)
            captureSession?.addInput(input)
            
            //            photoOutput = AVCapturePhotoOutput()
            stillImageOutput = AVCaptureStillImageOutput()
            
            if (captureSession?.canAddOutput(stillImageOutput) != nil){
                captureSession?.addOutput(stillImageOutput)
                
                previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
                previewLayer?.videoGravity = AVLayerVideoGravityResizeAspect
                previewLayer?.connection.videoOrientation = AVCaptureVideoOrientation.portrait
                cameraView.layer.addSublayer(previewLayer!)
                captureSession?.startRunning()
            }
        } catch {
            print("error")
        }
        previewLayer?.frame = view.bounds
        
        captureButton.isHidden = false
        hideRetake()
        view.bringSubview(toFront: captureButton)
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
        if let videoConnection = stillImageOutput?.connection(withMediaType: AVMediaTypeVideo){
            videoConnection.videoOrientation = AVCaptureVideoOrientation.portrait
            //photoOutput?.capturePhoto(with: AVCapturePhotoSettings, delegate: )
            
            stillImageOutput?.captureStillImageAsynchronously(from: videoConnection, completionHandler: {
                (sampleBuffer, error) in
                
                if sampleBuffer != nil {
                    let imageData = AVCaptureStillImageOutput.jpegStillImageNSDataRepresentation(sampleBuffer)
                    let dataProvider  = CGDataProvider(data: imageData as! CFData)
                    let cgImageRef = CGImage(jpegDataProviderSource: dataProvider!, decode: nil, shouldInterpolate: true, intent: .defaultIntent)
                    
                    let image = UIImage(cgImage: cgImageRef!, scale: 1.0, orientation: UIImageOrientation.right)
                    
                    let image2 = image.resized(toWidth: 300)!
                    
                    print("dimensions : \(image2.size)")
                    print("size : \(UIImageJPEGRepresentation(image2, 0.4)!.count)")
                    
                    /// UPLOAD
                    var r  = URLRequest(url: URL(string: "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key=\(self.API_KEY)&version=2016-05-20")!)
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
                            let json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as? AnyObject
                            
                            if let parseJSON = json {
                                print("resp :\(parseJSON)")
                                if let drawer = self.parent as? PulleyViewController {
                                    if let tablesdsa = drawer.drawerContentViewController as? TableViewController {
                                        DispatchQueue.main.async{
                                            var myNewData : [[String: AnyObject]] = []
                                            var data = ((((parseJSON["images"] as! NSArray)[0] as! AnyObject)["classifiers"] as! NSArray)[0] as! AnyObject)["classes"] as! NSArray
                                            for myClass in data {
                                                print ((myClass as! AnyObject)["class"] as! String)
                                                myNewData.append(["class_name":(myClass as! AnyObject)["class"] as! AnyObject, "score":(myClass as! AnyObject)["score"] as! AnyObject])
                                            }
                                            myNewData = myNewData.sorted(by: { $0["score"] as! CGFloat > $1["score"] as! CGFloat})
                                            tablesdsa.myarray = myNewData
                                            tablesdsa.tableView.reloadData()
                                        }
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
            })
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
            if let drawer = self.parent as? PulleyViewController
            {
                if let tablesdsa = drawer.drawerContentViewController as? TableViewController {
                    tablesdsa.cameraHidden = true
                    tablesdsa.tableView.reloadData()
                }
            }
        }
    }
    
    func hideRetake() {
        retakeButton.isEnabled = false
        retakeButton.isHidden = true
    }
    
    func showRetake() {
        retakeButton.isEnabled = true
        retakeButton.isHidden = false
    }
    
    @IBOutlet var captureButton: UIButton!
    @IBOutlet var retakeButton: UIButton!
    
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
