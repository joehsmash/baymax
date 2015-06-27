var transcript = "";
var recognition = new webkitSpeechRecognition();
var startup = /ma(cs|x)/i
setUpRecognition = function() {
	recognition.onstart = function(event) {
		console.log("recognition started");
	}
	recognition.onresult = function(event) {
		transcript = event.results[event.results.length-1][0].transcript
		isSleeping = isSleeping ? !startup.test(transcript) : false 
		console.log(transcript);
		if (transcript && !isSleeping) {
			startBeep.play();
			sendRequest(transcript.trim())
		}
	}
	recognition.onsoundend = function(event) { 
		console.log("sound has ended");
	}
	recognition.onend = function(event) {
		setTimeout(function() {
			if (https && !isSpeaking) {
				try {event.target.start()} catch(e) {console.log(e)}
			}
		}, 750);
	}
	recognition.start();
}