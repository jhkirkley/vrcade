'use strict';

angular.module('vrshopApp')
  .factory('Product', function ($resource) {
    return $resource('/api/products/:id', null, {
      'update': { method: 'PUT'}
    });
  });
