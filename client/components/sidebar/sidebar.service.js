angular.module('vrshopApp')
  .factory('Catalog', function ($resource) {
    return $resource('/api/catalogs/:id');
  });
