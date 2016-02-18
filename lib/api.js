'use strict';

var channels = require('./channels.js');

module.exports = function(app) {

  app.get('/api/channels', function(req, res) {
    res.json(channels.getChannels());
  });

  app.get('/api/channels/:id', function(req, res) {
    res.json('');
  });
};
