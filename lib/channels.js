'use strict';

var channels = {};
var counter = 0;

function getChannels() {
  return Object.keys(channels).map(function(key) {
    return channels[key];
  });
}

function getChannel(id) {
  return channels[id];
}

function addChannel(channel) {
  var channelId = counter;

  channel.viewers = [];
  channels[channelId] = channel;
  counter++;
  return channelId;
}

function addViewer(idChannel, response) {
  var channel = getChannel(idChannel);

  if (channel) {
    channels[idChannel].viewers.push(response);
    return true;
  }

  return false;
}

module.exports = {
  getChannels: getChannels,
  getChannel: getChannel,
  addChannel: addChannel,
  addViewer: addViewer
};
