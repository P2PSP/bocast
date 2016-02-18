'use strict';

var channels = require('./channels.js');

module.exports = function(app) {

  app.get('/api/list', function(req, res) {
    res.json(channels.getChannels());
  });

  app.get('/api/channel', function(req, res) {
    res.json('');
  });
};
