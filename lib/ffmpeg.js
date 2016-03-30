'use strict';

var spawn = require('child_process').spawn;

// Return a FFMPEG process to handle MPEG-TS conversion
function toMPEGTS() {
  var args = ['-i', '-', '-c', 'copy', '-bsf:v', 'h264_mp4toannexb', '-f', 'mpegts', 'pipe:1'];
  return spawn('ffmpeg', args);
}

// Return a  FFMPEG process to concatenate MPEG-TS videos
function concatMPEGTS() {
  var args = ['-i', '-', '-f', 'mpegts', '-y', '-'];
  return spawn('ffmpeg', args);
}

module.exports = {
  toMPEGTS: toMPEGTS,
  concatMPEGTS: concatMPEGTS
};
