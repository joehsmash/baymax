var nigelRef = new Firebase("https://rliu42.firebaseio.com/nigel");
var firstLoad = true;
var isSpeaking = false;
var isSleeping = false;
var baymax = /baymax/.test(location.href);
var https = /^https/.test(location.href);
var startBeep = new Audio('sounds/startBeep.mp3');
var endBeep = new Audio('sounds/endBeep.mp3');
var baymaxWindow = new Audio('sounds/window.mp3');
var hairyBaby = new Audio('sounds/hairybaby.mp3');
endBeep.volume = 0.6;
startBeep.volume = 0.6;
var beeps = [startBeep, endBeep];
var longPause = 2000;
var previousResponse = {};

var speak = function(phrase, followup, command) {
    var BAYMAX = new SpeechSynthesisUtterance();
    var first;
    var next;
    var pauseDuration = 0;
    var beep = false;
    if (typeof phrase == "object") {
        first = phrase[0] || "";
        next = phrase[1] || "";
    } else {
        first = phrase;
        next = followup;
        followup = "";
        beep = true;
        pauseDuration = longPause;
    }
    if (!first || first.length > 250) {
        return;
    }
    BAYMAX.voice = speechSynthesis.getVoices()[0];
    BAYMAX.text = first;
    BAYMAX.volume = 10;
    BAYMAX.pitch = 0.58;
    BAYMAX.rate = 0.98;
    if ( first.indexOf("window") > -1 ) {
        BAYMAX.volume = 0;
        baymaxWindow.play();
    }
    if ( first.indexOf("Hairy baby") > -1 ) {
        BAYMAX.volume = 0;
        hairyBaby.play();
    } 
    if ( /start[a-z]*( )?up/.test(first) ) {
        console.log("Play startup sound effect.");
    } 
    if ( /shut[a-z]*( )?down/.test(first) ) {
        isSleeping = true;
    } 
    BAYMAX.onstart = function() {
        isSpeaking = true;
        recognition.stop();
    }
    if (next || followup) {
        BAYMAX.onend = function() {
            setTimeout(function() {
                speak(next, followup, command)
            }, pauseDuration);
            if (beep) {
                rand(beeps).play();
            }
        }
    } else {
        BAYMAX.onend = function() {
            if (baymax) {
             rand(beeps).play();
            }
            if (isSleeping) {
                console.log("Play shutdown sound effect.");
            }
            isSpeaking = false;
            if (location.href.match(/^https/)) {try {recognition.start()} catch(e) {}}
        }
    }
    speechSynthesis.speak(BAYMAX);
}

nigelRef.on("value", function(ss) {
    var data = ss.val();
    if (firstLoad && https) { try{ setUpRecognition() } catch(e) {} }
    if (data.sms && !firstLoad) {
        previousResponse = data;
        processResponse(data);
    }
    firstLoad = false;
}, function(error) {
    console.log("Firebase error: " + error);
});

var processResponse = function(result) {
    if (result.res && https && !isSleeping) {
        speak(result.res, result.followup);
    }
    if (result.media) {
        if (result.media.type == "video") {
            var url = ( https ? 'https': 'http' ) + "://www.youtube.com/embed/" + result.media.link + "?autoplay=1&start=3&controls=0&iv_load_policy=3&modestbranding=1";
            $("#player").attr("src", url);
        }
        if (result.media.type == "map") {
            var url = result.media.link.replace(/^http(s)?/, ( https ? 'https': 'http' ));
            $("#googlemap").attr("src", result.media.link);
        }
    }
    if (result.cmd) {
        try{ processCommand(result.cmd) } catch(e) {}
    }
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '375',
        videoId: ""
    });
}