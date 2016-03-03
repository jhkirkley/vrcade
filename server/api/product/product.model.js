'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var Message = require('../message/message.model');

var ProductSchema = new Schema({
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: {type: String, trim: true },
  article: {type: String, trim: true },
  space: { type: String},
  imageBin: { data: Buffer, contentType: String },
  imageUrl: String,
  active: {type: Boolean, default: true },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
  messages: [Message.schema],
  categories: [{ type: Schema.Types.ObjectId, ref: 'Catalog', index: true }]
}).index({
  'title': 'text',
  'description': 'text'
});

export default mongoose.model('Product', ProductSchema);
