const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();

let host = 'localhost';
let port = 4444;
let pass = '';

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
			console.log("Connecting to: "+host+":"+port);
			obs.connect({ address: host+':'+port, password: pass })
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
