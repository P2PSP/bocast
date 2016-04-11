// Channel scheme:
// {
//   title:       'title',
//   desctription:'description',
//   ip:          'ip',
//   port:        'port',
//   viewers:     [streams]
// } 

'use strict';

var channels = {};
var counter = 0;

function getChannels() {
  var outputChannels = [];
  // Iterate over all channels
  Object.keys(channels).forEach(function(key) {
    var aChannel = {};
    
    // Iterate over attributes to copy only necessary to client
    ['title', 'description', 'ip', 'port'].forEach(function(attr){
      aChannel[attr] = channels[key][attr];
    });
    
    // Add id to client
    aChannel['id'] = key;
    
    console.log(aChannel);
  
    outputChannels.push(aChannel);    
  });
  
  return outputChannels;
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
