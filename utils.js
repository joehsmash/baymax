function rand(array) {
	return (typeof array === "undefined") ? "" : array[Math.floor(Math.random()*array.length)];
}