//
//  ViewController.swift
//  Visual Recognition
//
//  Created by Nicholas Bourdakos on 7/28/17.
//  Copyright © 2017 Nicholas Bourdakos. All rights reserved.
//

import UIKit

class ClassesViewController: UIViewController, UICollectionViewDelegateFlowLayout {
    
    var classifier = PendingClassifier()
    
    @IBOutlet weak var blackBackground: UIView!
    @IBOutlet weak var classifierName: UITextField!

    override func viewDidLoad() {
        super.viewDidLoad()
        blackBackground.isHidden = true
        
        classifierName.layer.shadowColor = UIColor.black.cgColor
        classifierName.layer.shadowOpacity = 0
        classifierName.layer.shadowRadius = 2
        classifierName.layer.shadowOffset = CGSize(width: 0, height: 0)
        
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow), name: .UIKeyboardWillShow, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillHide), name: NSNotification.Name.UIKeyboardWillHide, object: nil)

        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        tap.cancelsTouchesInView = true
        blackBackground.addGestureRecognizer(tap)
    }
    
    // Variable to save the last position visited, default to zero.
    private var lastContentOffset: CGFloat = 0
    
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView.contentOffset.y <= 0 && lastContentOffset > 0 {
            animateShadow(opacity: 0, offset: CGSize(width: 0, height: 0))
        } else if scrollView.contentOffset.y > 0 && lastContentOffset <= 0 {
            animateShadow(opacity: 0.2, offset: CGSize(width: 0, height: 2))
        }
        lastContentOffset = scrollView.contentOffset.y
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        let width = (collectionView.frame.width - 40) / 2 - 10
        
        return CGSize(width: width, height: width + 50)
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumLineSpacingForSectionAt section: Int) -> CGFloat {
        return CGFloat(10.0)
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumInteritemSpacingForSectionAt section: Int) -> CGFloat {
        return CGFloat(10.0)
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, insetForSectionAt section: Int) -> UIEdgeInsets {
        return UIEdgeInsetsMake(CGFloat(86.0), CGFloat(20.0), CGFloat(86.0), CGFloat(20.0))
    }
    
    func animateShadow(opacity: CGFloat, offset: CGSize) {
        CATransaction.begin()
        let opacityAnimation = CABasicAnimation(keyPath: "shadowOpacity")
        opacityAnimation.toValue = opacity
        opacityAnimation.duration = 0.3
        opacityAnimation.timingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionEaseOut)
        opacityAnimation.fillMode = kCAFillModeBoth
        opacityAnimation.isRemovedOnCompletion = false
        
        let offsetAnimation = CABasicAnimation(keyPath: "shadowOffset")
        offsetAnimation.toValue = offset
        offsetAnimation.duration = 0.3
        offsetAnimation.timingFunction = opacityAnimation.timingFunction
        offsetAnimation.fillMode = opacityAnimation.fillMode
        offsetAnimation.isRemovedOnCompletion = false
        
        classifierName.layer.add(offsetAnimation, forKey: offsetAnimation.keyPath!)
        classifierName.layer.add(opacityAnimation, forKey: opacityAnimation.keyPath!)
        CATransaction.commit()
    }
    
    func dismissKeyboard() {
        view.endEditing(true)
    }
    
    func keyboardWillShow(notification: NSNotification) {
        blackBackground.alpha = 0
        blackBackground.isHidden = false
        
        if lastContentOffset <= 0 {
            animateShadow(opacity: 0.2, offset: CGSize(width: 0, height: 2))
        }
        
        UIView.animate(withDuration: 0.2, delay: 0, options: [], animations: {
            self.blackBackground.alpha = 1
        }, completion: nil)
    }
    
    func keyboardWillHide(notification: NSNotification) {
        if lastContentOffset <= 0 {
            animateShadow(opacity: 0, offset: CGSize(width: 0, height: 0))
        }
        
        UIView.animate(withDuration: 0.2, delay: 0, options: [], animations: {
            self.blackBackground.alpha = 0
        }, completion: { _ in
            self.blackBackground.isHidden = true
        })
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "embedClasses",
            let destination = segue.destination as? ClassesCollectionViewController {
            destination.classifier = classifier
            destination.collectionView?.delegate = self
        }
    }
}
