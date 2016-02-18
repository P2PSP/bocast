'use strict';

var express = require('express');
var app = express();

var PORT = 8080;

app.get('/', function (req, res) {
  res.send('Channel list.');
});

app.listen(PORT, function () {
  console.log('Tracker listening on port ' + PORT);
});
