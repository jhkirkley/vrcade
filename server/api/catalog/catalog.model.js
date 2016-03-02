'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;
var slugs = require('mongoose-url-slugs');

var CatalogSchema = new Schema({
  name: { type: String, required: true}
});

CatalogSchema.plugin(slugs('name'));

module.exports = mongoose.model('Catalog', CatalogSchema);
