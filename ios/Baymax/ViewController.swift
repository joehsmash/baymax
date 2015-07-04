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
import Darwin

class BaymaxViewController: UIViewController, UITextViewDelegate, UIWebViewDelegate {

    @IBOutlet weak var webView: UIWebView!
    @IBOutlet weak var userInput: UITextView!
    
    //let synth = AVSpeechSynthesizer()
    //var reply = AVSpeechUtterance(string: "")
    //var defaultRate = Float(0.125)
    //var defaultPitch = Float(0.85)
    
    var requestURL = "http://72.29.29.198:1337/"
    var viewURL = "http://72.29.29.198/baymax"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        UIView.setAnimationsEnabled(false)
        // Do any additional setup after loading the view, typically from a nib.
        let url = NSURL (string: viewURL)
        let requestObj = NSURLRequest(URL: url!)
        self.webView.delegate = self
        self.webView.loadRequest(requestObj)
        self.webView.scrollView.bounces = false
        baymaxRequest("Baymax, startup.")
        
        self.userInput.delegate = self
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
        //self.userInput.becomeFirstResponder()
        self.userInput.font = UIFont(name: "Roboto-Light", size: 24)
        
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "changeInputMode:", name: UITextInputCurrentInputModeDidChangeNotification, object: nil)
    }
    
    func textViewDidChange(textView: UITextView) {
        let s = self.userInput.text
        if !s.isEmpty {
            let lastChar = s[advance(s.startIndex, count(s)-1)]
            if lastChar == "\n" {
                baymaxRequest(s.substringToIndex(advance(s.startIndex, count(s) - 1)))
                self.userInput.text = "";
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
            println("Sending to server: \(input)")
            let encodedInput = input.stringByAddingPercentEncodingWithAllowedCharacters(.URLHostAllowedCharacterSet())
            var url = NSURL(string: requestURL + "sms/" + encodedInput!)
            if let data = NSData(contentsOfURL: url!) {
                if let result: NSDictionary = NSJSONSerialization.JSONObjectWithData(data, options: .MutableContainers, error: nil) as? NSDictionary {
                    if let response = result["response"] as? NSDictionary {
                        if let text = response["text"] as? NSString {
                            println("Reply: \(text)")
                            // speak(text as String)
                        }
                    }
                }
            }
        }
    }

    

}

