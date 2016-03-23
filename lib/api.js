'use strict';

var express = require('express');
var channels = require('./channels.js');

// Handle MPEGTS conversion
var spawn = require('child_process').spawn;
var argsMPEGTS = ['-i', '-', '-c', 'copy', '-bsf:v', 'h264_mp4toannexb', '-f', 'mpegts', 'pipe:1'];

// FFMPEG process to concatenate MPEG-TS videos
var concatProcess = concatMPEGTS();

var router = express.Router();

function toMPEGTS(buffer) {
  var child = spawn('ffmpeg', argsMPEGTS);
  child.stdin.end(buffer);
  return child.stdout;
}

function concatMPEGTS() {
  var args = ['-i', '-', '-f', 'mpegts', '-y', '-'];
  return spawn('ffmpeg', args);
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
    toMPEGTS(Buffer.concat(data)).pipe(concatProcess.stdin, {end: false});
    console.log('piped')
  });
});

router.get('/watch', function(req, res) {
  console.log('watching...');
  concatProcess.stdout.pipe(res, {end: false});
});

module.exports = router;
