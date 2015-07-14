sendRequest = function(input) {
	$.ajax('request.php', {
		data: {input: input, previous: previousResponse},
		type: "POST",
		success: function(data) {
			console.log(data);
		},
		error: function(info) {
			console.log("ERROR: " + info);
		}
	});
}