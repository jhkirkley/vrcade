'use strict';

angular.module('vrshopApp')
  .factory('Product', function ($resource) {
    return $resource('/api/products/:id', null, {
      'update': { method: 'PUT'},
      'catalog':{ method: 'GET', isArray: true,
        params: {
          controller: 'catalog'
        }
      },
      'search': { method: 'GET', isArray: true,
        params: {
          controller: 'search'
        }
      }
    });
  });
