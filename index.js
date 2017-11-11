const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();

var config = require('./config');

let connStatus = false,
    connRetry = 0;

let streamStatus = false;

obs.on('AuthenticationSuccess', function(data) {
	console.log("Connection and authenication successful");
	connStatus = true;
	connRetry = -1;
});


obs.on('ConnectionClosed', function(data) {
	console.log("Connection closed");
	connStatus = false;
	connRetry = 10;
});

obs.on('StreamStarted', function(data) {
	streamStatus = true;
});

obs.on('StreamStopped', function(data) {
	streamStatus = false;
});

setInterval(function() {
	if (!connStatus && connRetry > -1) {
		if (connRetry-- == 0) {
			console.log("Connecting to: "+config.host+":"+config.port);
			obs.connect({ address: config.host+':'+config.port, password: config.password })
			.catch(err => {
				// Ignore
			});
		}
		else if (((connRetry+1) % 5) == 0) {
			console.log("Connecting in: "+(connRetry+1)+" seconds.");
		}
	}
	else {
		console.log("Connection: "+connStatus+", Streaming: "+streamStatus);
	}
}, 1000);
