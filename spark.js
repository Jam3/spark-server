var Spark = require('spark');
var request = require('request');
var sys = require('sys');
var exec = require('child_process').exec;
var child;
var sonosIp = '192.168.0.58';
var sonosPort = '8080';
var sonosURL = 'http://'+sonosIp+':'+sonosPort;

Spark.login({accessToken: '295f8bbb22d0e32cc4e6bdc53fd47724e5acc919'}, sparkConnected);

Spark.onEvent('prev', function(data) {
  console.log("Prev Event: " + data);
  request.post(sonosURL+'/previous', {});
});

Spark.onEvent('next', function(data) {
  console.log("Next Event: " + data);
  request.post(sonosURL+'/next', {});
});

Spark.onEvent('play', function(data) {
  console.log("Play: " + data);
  request.post(sonosURL+'/changeStatus', {});
});

Spark.onEvent('stop', function(data) {
  console.log("Stop: " + data);
  request.post(sonosURL+'/changeStatus', {});
});

var deviceReference = null;

function sparkConnected(err, body) {
  console.log('API call login completed on callback:', err, body);

  Spark.listDevices(getDevicesComplete);

}

function getDevicesComplete(err, devices) {
  if(!err) {
    var device = devices[0];
    console.log('Device name: ' + device.name);
    console.log('- connected?: ' + device.connected);
    console.log('- variables: ' + device.variables);
    console.log('- functions: ' + device.functions);
    console.log('- version: ' + device.version);
    console.log('- requires upgrade?: ' + device.requiresUpgrade);

    Spark.getDevice('sparkCore', deviceReadyHandler);
  } else {
    console.log('FAILURE:: '+err);
  }

}

function deviceReadyHandler(err, device) {
  console.log('Device name ready: ' + device.name);
  deviceReference = device;

}
