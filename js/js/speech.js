var baymaxRef = new Baymax("aHR0cHM6Ly9zYWZldHliYXltYXguZmlyZWJhc2Vpby5jb20vZ2xvYmFsL3NwZWVjaA==");
var baymax = /baymax/.test(location.href);
var https = /^https/.test(location.href);

/* Baymax states */
var firstLoad = true;
var isSpeaking = false;
var isSleeping = false;
var isMobile = false;

/* Baymax sound effects */
const ACTIVATE = new Audio('sounds/activate.mp3');
const DEACTIVATE = new Audio('sounds/deactivate.mp3');
const SLEEP = new Audio("sounds/sleep.mp3");
const SCAN = new Audio("sounds/scan.mp3");
const SPEAKING = new Audio("sounds/speaking_2.ogg");
const WINDOW = new Audio('sounds/window.ogg');
const BABY = new Audio('sounds/hairybaby.ogg');
const BALALA = new Audio('sounds/balala.ogg');
const GOODBYE = new Audio('sounds/goodbye.mp3');
const FEEL_BETTER = new Audio('sounds/feelbetter.mp3');
var startBeep = new Audio('sounds/startBeep.mp3');
var endBeep = new Audio('sounds/endBeep.ogg');
endBeep.volume = 0.5;
startBeep.volume = 0.5;
var beeps = [startBeep];

/* Baymax speech variables */
var accent = 0;
var pitch = 0.55;
var longPause = 2500;
var previousResponse = {};

var speak = function (phrase, followup, command, params) {
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
    BAYMAX.voice = speechSynthesis.getVoices()[params.accent || 0];
    BAYMAX.text = first;
    BAYMAX.volume = 10;
    BAYMAX.pitch = params.pitch || 0.55;
    BAYMAX.rate = params.rate || 1.0;
    if (first.length == 1 || isMobile) {
        BAYMAX.volume = 0;
    }
    if (first.indexOf("jumped out a window") > -1) {
        BAYMAX.volume = 0;
        beep = false;
        WINDOW.play();
    }
    if (first.indexOf("Hairy baby") > -1) {
        BAYMAX.volume = 0;
        beep = false;
        BABY.play();
    }
    if (first.indexOf("Balala") > -1) {
        BAYMAX.volume = 0;
        BALALA.play();
        return;
    }
    if (/feel.*?better/.test(first)) {
        BAYMAX.volume = 0;
        FEEL_BETTER.play();
        return;
    }
    if (/deactivate/.test(first)) {
        BAYMAX.volume = 0;
        DEACTIVATE.play();
    }
    if (/scan complete/i.test(first)) {
        BAYMAX.volume = 0;
        SCAN.play();
    }
    if (/glad i can help/i.test(first)) {
        BAYMAX.volume = 0;
        GOODBYE.play();
    }
    if (command == "startup") {
        ACTIVATE.play();
    }
    if (/shut.*?down/.test(first)) {
        isSleeping = true;
    }
    BAYMAX.onstart = function () {
        wave.start();
        isSpeaking = true;
        recognition.stop();
        if (BAYMAX.volume > 0) {
            SPEAKING.play();
        }
    }
    if (next || followup) {
        BAYMAX.onend = function () {
            setTimeout(function () {
                speak(next, followup, command, params);
            }, pauseDuration);
            if (beep) {
                rand(beeps).play();
            }
            wave.stop();
        }
    } else {
        BAYMAX.onend = function () {
            if (baymax && beep) {
                rand(beeps).play();
            }
            if (isSleeping) {
                SLEEP.play();
            }
            isSpeaking = false;
            SPEAKING.pause();
            wave.stop();
            if (https) {
                try {
                    recognition.start();
                } catch (e) {}
            }
        }
    }
    speechSynthesis.speak(BAYMAX);
}

baymaxRef.on("value", function (ss) {
    var data = ss.val();
    if (firstLoad && https) {
        try {
            setUpRecognition();
        } catch (e) {}
    }
    previousResponse = data;
    if (!firstLoad && !isMobile) {
        processResponse(data);
    }
    firstLoad = false;
}, function (error) {
    console.log("Firebase error: " + error);
});

var processResponse = function (result) {
    var speechParams = {};
    if (result.command && result.command.voice) {
        speechParams.accent = (result.command.voice == "british") ? 2 : (result.command.voice ==
            "spanish") ? 3 : (result.command.voice == "french") ? 4 : 0;
        speechParams.pitch = result.command.voice.pitch || 0.55;
        speechParams.rate = result.command.voice.rate || 1.0;
    }
    if (result.command == "startup") {
        isSleeping = false;
    }
    if (result.response.speech && https && !isSleeping) {
        speak(result.response.speech, result.response.followup, result.command, speechParams);
    }
    if (result.media & !baymax) {
        if (result.media.type == "video") {
            var url = (https ? 'https' : 'http') +
                "://www.youtube.com/embed/" + result.media.link +
                "?autoplay=1&start=3&controls=0&iv_load_policy=3&modestbranding=1";
            $("#player").attr("src", url);
        }
        if (result.media.type == "map") {
            var url = result.media.link.replace(/^http(s)?/, (https ?
                'https' : 'http'));
            $("#googlemap").attr("src", result.media.link);
        }
    }
    if (result.command && !baymax) {
        try {
            processCommand(result.command);
        } catch (e) {}
    }
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '375',
        videoId: ""
    });
}