sendRequest = function(input) {
	$.ajax('request', {
		data: {input: input, previous: previousResponse},
		type: "POST",
		success: function(data) {
			console.log(data);
		}
	});
}