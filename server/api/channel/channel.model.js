'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ChannelSchema = new mongoose.Schema({
  name: String,
  description: String,
  active: Boolean
});

export default mongoose.model('Channel', ChannelSchema);
