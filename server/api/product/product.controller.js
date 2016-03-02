/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/products              ->  index
 * POST    /api/products              ->  create
 * GET     /api/products/:id          ->  show
 * PUT     /api/products/:id          ->  update
 * DELETE  /api/products/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Product from './product.model';
var path = require('path');
var Catalog = require('../catalog/catalog.model');

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Products
export function index(req, res) {
  Product.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Product from the DB
export function show(req, res) {
  Product.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Product in the DB
export function create(req, res) {
  Product.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Product in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Product.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Product from the DB
export function destroy(req, res) {
  Product.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

function saveFile(res, file) {
  return function(entity){
    var newPath = '/assets/uploads/' + path.basename(file.path);
    entity.imageUrl = newPath;
    return entity.saveAsync().spread(function(updated) {
      console.log(updated);
      return updated;
    });
  }
}

// Uploads a new Product's image in the DB
exports.upload = function(req, res) {
  var file = req.files.file;
  if(!file){
    return handleError(res)('File not provided');
  };

  Product.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveFile(res, file))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

exports.catalog = function(req, res) {
  Catalog
    .findOne({ slug: req.params.slug })
    .then(function (catalog) {
      var catalog_ids = [catalog._id].concat(catalog.children);
      console.log(catalog_ids, catalog);
      return Product
        .find({'categories': { $in: catalog_ids } })
        .populate('categories')
        .exec();
    })
    .then(function (products) {
      res.json(200, products);
    })
    .then(null, function (err) {
      handleError(res, err);
    });
};

exports.search = function(req, res) {
  Product
    .find({ $text: { $search: req.params.term }})
    .populate('categories')
    .exec(function (err, products) {
      if(err) { return handleError(res, err); }
      return res.json(200, products);
    });
};
