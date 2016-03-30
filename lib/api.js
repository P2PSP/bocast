'use strict';

var express = require('express');
var spawn = require('child_process').spawn;
var channels = require('./channels');
var ffmpeg = require('./ffmpeg');

// FFMPEG process to concatenate MPEG-TS videos
var concatProcess = ffmpeg.concatMPEGTS();

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
    var mpegtsProcess = ffmpeg.toMPEGTS();
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
