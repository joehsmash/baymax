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

class BaymaxViewController: UIViewController, UITextViewDelegate {

    @IBOutlet weak var textView: UITextView!
    @IBOutlet weak var webView: UIWebView!
    
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
        self.webView.loadRequest(requestObj)
        self.webView.scrollView.bounces = false
        
        self.textView.font = UIFont(name: "Roboto-Light", size: 24)
        self.textView.delegate = self
        self.textView.editable = true
        self.textView.becomeFirstResponder()
        
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "changeInputMode:", name: UITextInputCurrentInputModeDidChangeNotification, object: nil)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func prefersStatusBarHidden() -> Bool {
        return true
    }
    
    func textViewDidChange(textView: UITextView) {
        let s = textView.text
        if !s.isEmpty {
            let lastChar = s[advance(s.startIndex, count(s)-1)]
            if lastChar == "\n" {
                baymaxRequest(s.substringToIndex(advance(s.startIndex, count(s) - 1)))
                textView.text = "";
            }
        }
    }
    
    func changeInputMode(sender: NSNotification) {
        var primaryLanguage = textView.textInputMode?.primaryLanguage
        if primaryLanguage != nil {
            var activeLocale:NSLocale = NSLocale(localeIdentifier: primaryLanguage!)
            if primaryLanguage == "dictation" {
                println("Dictation started.")
            } else {
                baymaxRequest(textView.text)
                textView.text = ""
                self.view.endEditing(true)
                textView.becomeFirstResponder()
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

