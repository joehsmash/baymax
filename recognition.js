var transcript = "";
var recognition = new webkitSpeechRecognition();
var startup = /b(a|e)y( )?max( |$)/
setUpRecognition = function() {
	//recognition.continuous = false;
	//recognition.interimResults = false;
	recognition.onstart = function(event) {
		console.log("recognition started");
	}
	recognition.onresult = function(event) {
		transcript = event.results[event.results.length-1][0].transcript
		isSleeping = isSleeping ? !startup.test(transcript) : false 
		if (transcript && !isSleeping) {
			startBeep.play();
			console.log("Sending to server: " + transcript);
			if ( /(localhost|runpengliu)/.test(location.href) ) {
				processSpeech(transcript.trim());
			} else {
				sendRequest(transcript.trim())
			}
		}
	}
	recognition.onsoundend = function(event) { 
		console.log("sound has ended");
	}
	recognition.onend = function(event) {
		setTimeout(function() {
			if (https && !isSpeaking) {
				try {event.target.start()} catch(e) {}
			}
		}, 1000);
	}
	recognition.onerror = function(event) {
		if (https) {
			try {event.target.start()} catch(e) {}
		}
	}
	recognition.start();
}


processSpeech = function(input) {
	transcript = "";
	request = {input: input, previous: previousResponse}
	$.ajax('/demand', {
		type: "POST",
		dataType : "json",
		data: request,
		success: function(response) {
			console.log("Response from server: " + JSON.stringify(response, null, '\t'));
		},
		error: function(info) {
			console.log("Error in processing request: " + JSON.stringify(input, null, '\t'))
		}
	});
}
