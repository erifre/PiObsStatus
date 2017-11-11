var config = require('./config');

const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();

let connStatus = false,
    connRetry = 0,
    streamStatus = false,
    ledMode = -1;

var Gpio = require('onoff').Gpio,
    led = new Gpio(config.led.pin, 'out'),
    iv = -1;

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

	controlLed();
}, 1000);

function controlLed() {
	let newLedMode = ledMode;

	let iv2;

	// Connected and streaming
	if (connStatus && streamStatus) {
		newLedMode = 2;
	}

	// Connected, not streaming
	else if (connStatus && !streamStatus) {
		newLedMode = 1;
	}

	// Running, not connected
	else {
		newLedMode = 0;
	}


	if (ledMode != newLedMode) {
		clearInterval(iv);

		ledMode = newLedMode;

		if (ledMode == 0) {
			led.writeSync(1);
			iv2 = -1;
		}
		else if (ledMode == 1) {
			iv2 = setInterval(function() {
				led.writeSync(led.readSync() === 0 ? 1 : 0)
			}, 1500);
		}
		else if (ledMode == 2) {
			iv2 = setInterval(function() {
				led.writeSync(led.readSync() === 0 ? 1 : 0)
			}, 300);
		}

		iv = iv2;
	}
}
