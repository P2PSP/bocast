'use strict';

var express = require('express');
var channels = require('./channels.js');

var router = express.Router();

router.route('/channels')
  .get(function(req, res) {
    res.json(channels.getChannels());
  })
  .put(function(req, res) {
    channels.addChannel(req.body);
    res.end();
  });

router.get('/channels/:id', function(req, res) {
  res.json(channels.getChannel(req.params.id));
});

module.exports = router;
