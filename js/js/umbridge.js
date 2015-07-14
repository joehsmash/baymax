/*
Disables cheating when not in development mode (localhost or local file).
*/

var cheatingOff = !/localhost|file/.test(location.href);
var ctrlKeyDown = false,
	shiftKeyDown = false,
	appleKeyDown = false, 
	optionKeyDown = false;

// Disable right-click context menu (for viewing page source) 
if (cheatingOff) {
	$(document).ready(function() {
	if (document.addEventListener) {
	    document.addEventListener('contextmenu', function(e) {
	        e.preventDefault();
	    }, false);
	} else {
	    document.attachEvent('oncontextmenu', function() {
	        window.event.returnValue = false;
	    });
	  }
	});
}

// Disable console shortcuts:
// Chrome/Firefox: Ctrl + Shift + (C, I, J, K); F12
// Safari: Apple + Option/Shift + (C, I, J, U)

if (cheatingOff) {
	document.onkeydown = function(e) {
		youAreACheater = false;
		shiftKeyDown = (e.which == 16) || shiftKeyDown;
		ctrlKeyDown = (e.which == 17) || ctrlKeyDown;
		optionKeyDown = (e.which == 18) || optionKeyDown;
		appleKeyDown = (e.which == 91 || e.which == 93) || appleKeyDown;

		// C, I, J, K, U
		var bad = [67, 73, 74, 75, 85, 99, 105, 106, 107, 117];
		if (bad.indexOf(e.which) > -1 && (ctrlKeyDown || appleKeyDown) && (shiftKeyDown || optionKeyDown)) {
			youAreACheater = true;
		}
		// F12
		if (e.which == 123) {
			youAreACheater = true
		}
		if (youAreACheater) {
			shiftKeyDown = false; appleKeyDown = false; optionKeyDown = false; ctrlKeyDown = false;
			window.open("http://72.29.29.198/hairybaby")
			return false;
		}
	}

	document.onkeyup = function(e) {
		if (e.which == 91 || e.which == 93) {
			appleKeyDown = false;
		}
		if (e.which == 16) {
			shiftKeyDown = false;
		}
		if (e.which == 17) {
			ctrlKeyDown = false;
		}
		if (e.which == 18) {
			optionKeyDown = false;
		}
	}
}