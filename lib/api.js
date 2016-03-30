'use strict';

var express = require('express');
var spawn = require('child_process').spawn;
var channels = require('./channels.js');

// FFMPEG process to concatenate MPEG-TS videos
var concatProcess = concatMPEGTS();

var router = express.Router();

// Handle MPEGTS conversion
function toMPEGTS() {
  var argsMPEGTS = ['-i', '-', '-c', 'copy', '-bsf:v', 'h264_mp4toannexb', '-f', 'mpegts', 'pipe:1'];
  return spawn('ffmpeg', argsMPEGTS);
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
  var channel = channels.getChannelByIp(req.ip);
  console.log('Video received - Viewers: ', channel ? channel.viewers.length : 'Channel does not exist yet');
  if (!channel) {
    var channelId = channels.addChannel({
      ip: req.ip
    });

    console.log('Channel ' + channelId + ' created correctly');
  }

  // Only convert the video stream when there are viewers
  else if (channel.viewers.length > 0) {
    var mpegtsProcess = toMPEGTS();
    req.pipe(mpegtsProcess.stdin);
    mpegtsProcess.stdout.pipe(concatProcess.stdin, {end: false});
    console.log('piped');
  }

  // TODO: Replace 'ok' with another message
  res.end('ok');
});

router.get('/watch/:id', function(req, res) {
  if (channels.addViewer(req.params.id, res)) {
    console.log('watching...');
    concatProcess.stdout.pipe(res, {end: false});
  }
  else {
    res.end('Channel ' + req.params.id + ' does not exist');
  }
});

module.exports = router;
