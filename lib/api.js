'use strict';

var express = require('express');
var channels = require('./channels.js');

var router = express.Router();

var buffers = [];

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

router.post('/emit', function(req, res) {
  var data = [];
  req.on('data', function(chunk) {
    data.push(chunk);
  });

  req.on('end', function() {
    res.end('ok');
    buffers.push(Buffer.concat(data));
    data = [];
  });
});

router.get('/watch', function(req, res) {
  // TODO: Use ffmpeg to concatenate all the videos
  res.write(buffers[0], 'binary');
  res.end();
});

module.exports = router;
