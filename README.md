# PiObsStatus

A small application that shows the status of an [OBS Studio](https://obsproject.com/) instance. It does so by connecting using a websocket. This should be run on a Raspberry Pi.

### Current features:
* Red LED on when application is running.
* Red LED blinking when application is connected to OBS.
* Green LED blinking when streaming is active.

## Dependencies
* [NodeJS 6](https://nodejs.org/dist/latest-v6.x/)
* [OBS Websocket](https://github.com/Palakis/obs-websocket) >4.0.0

## Installation
Clone the source code and install the necessary dependencies.
```
§ git clone https://github.com/erifre/PiObsStatus.git
§ cd PiObsStatus
§ npm install
```

## Configuration
Update the configuration file to your likings. Make sure the GPIO pins are correct for your Raspberry Pi.

## Running
```
§ npm run start
```
