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

    // TODO: Validate data from req.body (e.g. no undefined or empty strings)
    var id = channels.addChannel({
      title: req.body.title,
      description: req.body.description,
    });
    res.location(req.baseUrl + '/channels/' + id);
    res.status(201);
    res.json({id: id});
    console.log('Channel ' + id + ' created.');
  });

router.get('/channels/:id', function(req, res) {
  res.json(channels.getChannel(req.params.id));
});

router.post('/emit/:id', function(req, res) {
  var channel = channels.getChannel(req.params.id);
  console.log('Video received - Viewers: ', channel ? channel.viewers.length : 'Channel does not exist yet');
  if (!channel) {
    res.end('Channel ' + req.params.id + ' does not exist.');
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
    res.status(200);
    res.removeHeader('Transfer-Encoding');
    res.removeHeader('X-Powered-By');
    res.removeHeader('Date');
    res.set('Content-Type', 'video/mp2t');
    res.set('Connection', 'close');
    concatProcess.stdout.pipe(res, {end: false});
  }
  else {
    res.end('Channel ' + req.params.id + ' does not exist');
  }
});

module.exports = router;
