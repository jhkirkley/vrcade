'use strict';

angular.module('vrshopApp')
  .service('messageService', function($http) {

    var svc = this;
    svc.products = [];

    svc.getProducts = function() {
      var promise= $http.get('/api/products');
      promise.then(function(response) {
        svc.products = response.data;
      });
      return promise;
    };

    svc.sendMessage = function(newMessage, product) {
      return $http.post('/api/messages',
                        { text: newMessage,
                          productId: product._id
                        });
    };

    svc.findById = function(id) {
      return _.find(svc.products, function(product) {
        return product._id === id;
      });
    };
  });
