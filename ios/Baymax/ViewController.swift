//
//  ViewController.swift
//  Baymax
//
//  Created by runpeng liu on 7/2/15.
//  Copyright (c) 2015 Runpeng Liu. All rights reserved.
//

import UIKit
import Foundation
import AVFoundation
import CoreData
import CoreMotion

class BaymaxViewController: UIViewController, UITextViewDelegate, UIWebViewDelegate {

    @IBOutlet weak var webView: UIWebView!
    @IBOutlet weak var userInput: UITextView!
    @IBOutlet weak var startButton: UIButton!
    
    /* let synth = AVSpeechSynthesizer()
       var reply = AVSpeechUtterance(string: "")
       var defaultRate = Float(0.125)
       var defaultPitch = Float(0.85) */
    
    var requestURL = "http://72.29.29.198:1337/"
    var requestObj = NSURLRequest(URL: NSURL(string: "http://72.29.29.198/baymax")!)
    
    var previousResponse = ""
    var user = ""
    
    let managedObjectContext = (UIApplication.sharedApplication().delegate as! AppDelegate).managedObjectContext
    
    let manager = CMMotionManager()
    var rotationThreshold = Double(40.0)
    var shakeThreshold = Double(8.0)
    var restingThreshold = Double(0.5)
    var isBeingThrown = false
    
    override func viewDidLoad() {
        baymaxRequest("Baymax, startup.")
        super.viewDidLoad()
        
        self.webView.delegate = self
        self.webView.loadRequest(requestObj)
        self.webView.scrollView.bounces = false
        
        self.userInput.delegate = self
        self.becomeFirstResponder()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func prefersStatusBarHidden() -> Bool {
        return true
    }
    
    func webViewDidFinishLoad(webView: UIWebView) {
        self.userInput.editable = true
        self.userInput.font = UIFont(name: "Roboto-Light", size: 24)
        
        UIView.animateWithDuration(1.0, delay: 0, options: UIViewAnimationOptions.CurveEaseIn, animations: {
            self.webView.alpha = 1.0
            self.startButton.alpha = 0.6
            }, completion: nil)
        
        self.fetch()
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "changeInputMode:", name: UITextInputCurrentInputModeDidChangeNotification, object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "rotated", name: UIDeviceOrientationDidChangeNotification, object: nil)
        self.startGyro()
    }
    
    @IBAction func toggleKeyboard(sender: UIButton) {
        self.userInput.text = ""
        self.userInput.becomeFirstResponder()
    }
    
    func rotated() {
        if UIDeviceOrientationIsLandscape(UIDevice.currentDevice().orientation) {
            self.userInput.becomeFirstResponder()
            self.startButton.hidden = true
        } else if UIDeviceOrientationIsPortrait(UIDevice.currentDevice().orientation) {
            self.startButton.hidden = false
        }
    }
    
    func textViewDidChange(textView: UITextView) {
        let s = self.userInput.text
        if !s.isEmpty {
            let lastChar = s[advance(s.startIndex, count(s)-1)]
            if lastChar == "\n" {
                self.userInput.text = "";
                self.userInput.endEditing(true)
                baymaxRequest(s.substringToIndex(advance(s.startIndex, count(s) - 1)))
                self.becomeFirstResponder()
            }
        }
    }
    
    func changeInputMode(sender: NSNotification) {
        var primaryLanguage = userInput.textInputMode?.primaryLanguage
        if primaryLanguage != nil {
            var activeLocale:NSLocale = NSLocale(localeIdentifier: primaryLanguage!)
            if primaryLanguage == "dictation" {
                println("Dictation started.")
            } else {
                baymaxRequest(userInput.text)
                userInput.text = ""
                self.view.endEditing(true)
                userInput.becomeFirstResponder()
            }
        }
    }

    override func canBecomeFirstResponder() -> Bool {
        return true
    }
    
    func startGyro() {
        if manager.gyroAvailable {
            manager.gyroUpdateInterval = 0.5
            manager.startGyroUpdates()
        }
        let queue = NSOperationQueue()
        self.manager.startGyroUpdatesToQueue(queue) {
            [weak self] (data: CMGyroData!, error: NSError!) in
                let x = data.rotationRate.x
                let y = data.rotationRate.y
                let z = data.rotationRate.z
            
                let sum = fabs(x) + fabs(y) + fabs(z)
                var sumString = String(format: "%.2f", sum)
                println("Sum: \(sumString)")
            
                if (self?.isBeingThrown)! && sum < self?.restingThreshold {
                    self?.isBeingThrown = false
                }
            
                if !(self?.isBeingThrown)! {
                    if sum > self?.rotationThreshold {
                        self?.isBeingThrown = true
                        NSOperationQueue.mainQueue().addOperationWithBlock {
                            self?.throwBaymax()
                        }
                    } else if sum > self?.shakeThreshold {
                        NSOperationQueue.mainQueue().addOperationWithBlock {
                            self?.showBaymax()
                        }
                    }
                }
        }
    }
    
    /* func speak(text: String) {
            let sentences = text.componentsSeparatedByString(". ")
            for sentence in sentences {
                reply = AVSpeechUtterance(string: sentence)
                reply.rate = defaultRate
                reply.pitchMultiplier = defaultPitch
                reply.postUtteranceDelay = 0.005
                synth.speakUtterance(reply)
            }
    } */
    
    func baymaxRequest(input: String) -> () {
        if (!input.isEmpty) {
            var request = NSMutableURLRequest(URL: NSURL(string: requestURL)!)
            var session = NSURLSession.sharedSession()
            request.HTTPMethod = "POST"
            
            var params = ["input": input,  "user": user, "previous": previousResponse, "reply": true]
            println("Sending to server: \(params)")
            
            var err: NSError?
            request.HTTPBody = NSJSONSerialization.dataWithJSONObject(params, options: nil, error: &err)
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            request.addValue("application/json", forHTTPHeaderField: "Accept")
            
            var task = session.dataTaskWithRequest(request, completionHandler: {data, response, error -> Void in
                
                if let strData = NSString(data: data, encoding: NSUTF8StringEncoding) {
                    self.previousResponse = strData as String
                }
                
                var err: NSError?
                let result = NSJSONSerialization.JSONObjectWithData(data, options: .MutableLeaves, error: &err) as? NSDictionary
                
                if (err != nil) {
                    println(err!.localizedDescription)
                } else {
                    if (result != nil) {
                        if let response = result!["response"] as? NSDictionary {
                            if let text = response["text"] as? String {
                                println("Reply: \(text)")
                            }
                        }
                        if let user = result!["user"] as? String {
                            if self.user.isEmpty && !user.isEmpty {
                                self.user = user
                                let newUser = NSEntityDescription.insertNewObjectForEntityForName("UserItem", inManagedObjectContext: self.managedObjectContext!) as! UserItem
                                newUser.name = user
                                self.save()
                                println("User saved: \(newUser.name)")
                            }
                        }
                    }
                }
            })
            task.resume()
        }
    }
    
    func showBaymax() {
        self.view.endEditing(true)
        var request = NSMutableURLRequest(URL: NSURL(string: requestURL)!)
        var session = NSURLSession.sharedSession()
        request.HTTPMethod = "POST"
        var params = ["baymax" : true]

        var err: NSError?
        request.HTTPBody = NSJSONSerialization.dataWithJSONObject(params, options: nil, error: &err)
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        var task = session.dataTaskWithRequest(request, completionHandler: {data, response, error -> Void in
        })
        task.resume();
    }
    
    func throwBaymax() {
        self.view.endEditing(true)
        var request = NSMutableURLRequest(URL: NSURL(string: requestURL)!)
        var session = NSURLSession.sharedSession()
        request.HTTPMethod = "POST"
        var params = ["thrown" : true]
        
        var err: NSError?
        request.HTTPBody = NSJSONSerialization.dataWithJSONObject(params, options: nil, error: &err)
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        var task = session.dataTaskWithRequest(request, completionHandler: {data, response, error -> Void in
        })
        task.resume();
    }
    
    func fetch() {
        let fetchRequest = NSFetchRequest(entityName: "UserItem")
        if let fetchResults = managedObjectContext!.executeFetchRequest(fetchRequest, error: nil) as? [UserItem] {
            if (fetchResults.count > 0) {
                self.user = fetchResults[0].name
            }
        }
    }
    
    func save() {
        var error : NSError?
        if managedObjectContext!.save(&error) {
            println(error?.localizedDescription)
        }
    }

}

