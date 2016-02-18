'use strict';

var express = require('express');
var api = require('./lib/api.js');

var app = express();
var PORT = 8080;

// Add methods to handle API requests
api(app);

app.get('/', function (req, res) {
  res.send('Channel list.');
});

app.listen(PORT, function () {
  console.log('Tracker listening on port ' + PORT);
});
