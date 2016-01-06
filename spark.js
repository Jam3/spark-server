// Modules
var Spark = require('spark');
var request = require('request');
var config = require('./config.js');

// START - Config PARAMS
var sonosIp = config.sonos.ip;
var sonosPort = config.sonos.port;
var sparkToken = config.spark.token;
// END - Config PARAMS

// Generated Sonos URL
var sonosURL = 'http://' + sonosIp + ':' + sonosPort+'/api';

// LOGIN INTO SPARK
Spark.login({accessToken: sparkToken}, sparkConnected);

// START - Register Spark events
Spark.onEvent('prev', function(data) {
  console.log("Prev Event: " + data);
  request.post(sonosURL + '/previous', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML for the Google homepage. 
    }
  });
});

Spark.onEvent('next', function(data) {
  console.log("Next Event: " + data);
  request.post(sonosURL + '/next', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML for the Google homepage. 
    }
  });
});

Spark.onEvent('play', function(data) {
  console.log("Change status: " + data);
  request.post(sonosURL + '/changeStatus', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML for the Google homepage. 
    }
  });
});

// END - Register Spark events


var deviceReference = null;

// After Login into Spark this methods are going to run

function sparkConnected(err, body) {
  console.log('API call login completed on callback:', err, body);
  Spark.listDevices(getDevicesComplete);
}

function getDevicesComplete(err, devices) {
  if (!err) {
    var device = devices[0];
    console.log('Device name: ' + device.name);
    console.log('- connected? ' + device.connected);
    console.log('- variables: ' + device.variables);
    console.log('- functions: ' + device.functions);
    console.log('- version: ' + device.version);
    console.log('- requires upgrade? ' + device.requiresUpgrade);

    Spark.getDevice('sparkCore', deviceReadyHandler);
  } else {
    console.log('Failure:: ' + err);
  }

}

function deviceReadyHandler(err, device) {
  console.log('Success:: Device ' + device.name + ' is ready');
  deviceReference = device;
}
