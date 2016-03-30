'use strict';

var spawn = require('child_process').spawn;

var splitterPath;
var peerPath;

function init(paths) {
  splitterPath = paths.splitter;
  peerPath = paths.peer;
}

function launchSplitter(args) {
  return spawn(splitterPath, args);
}

function launchPeer(args) {
  return spawn(peerPath, args);
}

module.exports = {
  init: init,
  launchSplitter: launchSplitter,
  launchPeer: launchPeer
};
