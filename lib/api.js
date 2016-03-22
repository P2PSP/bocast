'use strict';

var express = require('express');
var channels = require('./channels.js');

// Handle MPEGTS conversion
var spawn = require('child_process').spawn;
var args = ['-i', '-', '-c', 'copy', '-bsf:v', 'h264_mp4toannexb', '-f', 'mpegts', 'pipe:1'];

var router = express.Router();

function toMPEGTS(buffer) {
  var child = spawn('ffmpeg', args);
  child.stdin.end(buffer);
  return child.stdout;
}

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
    toMPEGTS(Buffer.concat(data));
    data = [];
  });
});

router.get('/watch', function(req, res) {
  // TODO: Use ffmpeg to concatenate all the videos
  res.end();
});

module.exports = router;
