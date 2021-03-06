/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/messages              ->  index
 * POST    /api/messages              ->  create
 * GET     /api/messages/:id          ->  show
 * PUT     /api/messages/:id          ->  update
 * DELETE  /api/messages/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Message from './message.model';
import Product from '../product/product.model';
var MessageEvents = require('./message.events');

function respondWithResult(res, statusCode) {
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

// Gets a list of Messages
export function index(req, res) {
  Message.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Message from the DB
export function show(req, res) {
  Message.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Message in the DB
export function create(req, res) {
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  Product.findByIdAsync(req.body.productId)
  .then(function(product) {
    if (!product) {
      return res.status(404).send('Product not found.');
    }
    var newMessage = product.messages.create({
      text: req.body.text,
      user: req.user,
      createdAt: new Date()
    });
    product.messages.push(newMessage);
    MessageEvents.emit('save', { message: newMessage, productId: product._id });
    return product.save();
  })
  .then(respondWithResult(res, 201))
  .catch(handleError(res));
}

// Updates an existing Message in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Message.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Message from the DB
export function destroy(req, res) {
  Message.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
