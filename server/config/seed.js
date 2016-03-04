/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
var Product = require('../api/product/product.model');
var Catalog = require('../api/catalog/catalog.model');
var mainCatalog, art, games, science, fashion;

User.find({}).removeAsync()
  .then(() => {
    User.createAsync({
      provider: 'local',
      role: 'admin',
      name: 'jkirkley',
      email: 'john@johnkirkley.com',
      password: 'passages'
    })
     .then(() => {
      console.log('finished populating users');
    })
  })
Catalog
  .find({})
  .remove()
  .then(function () {
    return Catalog.create({ name: 'All'});
  })
  .then(function (catalog) {
    return Catalog.create({ name: 'Art'});
  })
  .then(function (category) {
    return Catalog.create({ name: 'Games'});
  })
  .then(function (category) {
    return Catalog.create({ name: 'Fashion'});
  })
  .then(function (category) {
    return Product.find({}).remove({});
  })
   .then(function () {
    console.log('Finished populating Products with categories');
  })
  .then(null, function (err) {
    console.error('Error populating Products & categories: ', err);
  });
