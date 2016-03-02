'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var ProductSchema = new Schema({
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: String,
  imageBin: { data: Buffer, contentType: String },
  imageUrl: String,
  categories: [{ type: Schema.Types.ObjectId, ref: 'Catalog', index: true }]
}).index({
  'title': 'text',
  'description': 'text'
});

export default mongoose.model('Product', ProductSchema);
