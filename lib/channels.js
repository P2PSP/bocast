'use strict';

var channels = [];

function getChannels() {
  return channels;
}

function getChannel(id) {
  return channels[id];
}

function addChannel(channel) {
  channels.push(channel);
}

module.exports = {
  getChannels: getChannels,
  getChannel: getChannel,
  addChannel: addChannel
};
