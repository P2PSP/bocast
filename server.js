'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var api = require('./lib/api.js');
var channels = require('./lib/channels.js');

var app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add methods to handle API requests
app.use('/api', api);

app.get('/', function (req, res) {
  res.send('Channel list.');
});

app.get('/add', function (req, res) {
  res.sendFile(path.join(__dirname + '/www/index.html'));
});

app.listen(port, function () {
  console.log('Server listening on port ' + port);
});
