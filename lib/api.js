'use strict';

var express = require('express');
var channels = require('./channels.js');

var router = express.Router();

router.get('/channels', function(req, res) {
  res.json(channels.getChannels());
});

router.get('/channels/:id', function(req, res) {
  res.json(channels.getChannel(req.params.id));
});

router.put('/channels', function(req, res) {
  channels.addChannel(req.body);
  res.end();
});

module.exports = router;
