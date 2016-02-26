'use strict';

var express = require('express');
var channels = require('./channels.js');

var router = express.Router();

router.route('/channels')
  .get(function(req, res) {
    res.json(channels.getChannels());
  })
  .post(function(req, res) {
    var id = channels.addChannel(req.body);
    res.location(req.baseUrl + '/channels/' + id);
    res.status(201);
    res.end('Channel added.');
  });

router.get('/channels/:id', function(req, res) {
  res.json(channels.getChannel(req.params.id));
});

// TODO: Don't store chunks in memory
var chunks = [];
router.post('/emit', function(req, res) {
  chunks = [];
  req.on('data', function(chunk) {
    chunks.push(chunk);
  });

  req.on('end', function() {
    res.end('ok');
  });
});

router.get('/watch', function(req, res) {
  chunks.forEach(function(buffer) {
    res.write(buffer, 'binary');
  });

  res.end();
});

module.exports = router;
