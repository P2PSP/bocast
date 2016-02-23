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
  channels[counter] = channel;
  counter++;
  return counter;
}

module.exports = {
  getChannels: getChannels,
  getChannel: getChannel,
  addChannel: addChannel
};
