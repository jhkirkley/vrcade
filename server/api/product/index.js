'use strict';

var express = require('express');
var controller = require('./product.controller');
import * as auth from '../../auth/auth.service';
var multiparty = require('connect-multiparty');
var uploadOptions = { autoFile: true,
                      uploadDir: 'client/assets/uploads/'}
var router = express.Router();
router.post('/:id/upload', multiparty(uploadOptions), controller.upload);
router.get('/',       auth.isAuthenticated(), controller.index);
router.get('/:id',    auth.isAuthenticated(), controller.show);
router.post('/',      auth.isAuthenticated(), controller.create);
router.put('/:id',    auth.isAuthenticated(), controller.update);
router.patch('/:id',  auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.get('/:slug/catalog', controller.catalog);
router.get('/:term/search', controller.search);


module.exports = router;
