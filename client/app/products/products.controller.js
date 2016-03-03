'use strict';
var errorHandler;
var uploadHander;
angular.module('vrshopApp')
  .controller('ProductsCtrl', function ($scope, Product) {
    $scope.products = Product.query();

    $scope.$on('search:term', function (event, data) {
    if(data.length) {
      $scope.products = Product.search({id: data});
    } else {
      $scope.products = Product.query();
      $scope.query = '';
    }
  });
})
.controller('ProductCatalogCtrl', function ($scope, $stateParams, Product) {
  $scope.product = Product.catalog({id: $stateParams.slug});
  $scope.query = $stateParams.slug;
})

  .controller('ProductViewCtrl', function ($sce, $scope, $state, $stateParams, Product, messageService) {
    $scope.product =
     Product.get({id: $stateParams.id},
        function(product) {
          console.log('product:', product);
          $scope.sanitizedHtml = $sce.trustAsHtml(product.description);
        }, function(err) {
          console.log('err:', err);
        });
    $scope.deleteProduct = function(){
      Product.delete({id: $scope.product._id}, function success() {
        $state.go('products');
      }, errorHandler($scope));
    };
})

  .controller('ProductSpaceCtrl', function ($sce, $scope, $state, $stateParams, Product, messageService, socketFactory) {
    $scope.newMessage = 'type new message here';
    // $cacheFactory.get('$http').removeAll();
    $scope.product =
      Product.get({id: $stateParams.id},
        function(product) {
          console.log('product:', product);
          $scope.sanitizedHtml = $sce.trustAsHtml(product.space);
        }, function(err) {
          console.log('err:', err);
        });
    console.log('$scope.product:', $scope.product);
          // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({ ioSocket });

    // socket.syncUpdates('message', vm.selectedChannel.messages);
      // TODO: I need to handle messages that arrive on other channels.
      socket.on('message:save', function(eventData) {
        var message = eventData.message;
        var oldMessage = _.find($scope.product.messages, {_id: message._id});
        var index = $scope.product.messages.indexOf(oldMessage);

        // replace oldMessage if it exists
        // otherwise just add message to the collection
        if (oldMessage) {
          $scope.product.messages.splice(index, 1, message);
        } else {
          $scope.product.messages.push(message);
        }
      });
        $scope.sendMessage = function() {
      messageService.sendMessage($scope.newMessage, $scope.product)
      .then(function(response) {
        $scope.newMessage = 'type new message here';
      });
    };
  })
    .controller('ProductMessagesCtrl', function($scope, messageService) {
    $scope.newMessage = 'type new message here';

    $scope.sendMessage = function() {
      messageService.sendMessage($scope.newMessage, $scope.product)
      .then(function(response) {
        $scope.newMessage = 'type new message here';
      });
    };
  })

  .controller('ProductNewCtrl', function ($scope, $state, Product, Upload, $timeout) {
    $scope.product = {}; // create a new instance
    $scope.addProduct = function(){
      Product.save($scope.product, function success(value){
        $state.go('viewProduct', {id: value._id});
      }, errorHandler($scope));
    };
  })

  .controller('ProductEditCtrl', function ($scope, $state, $stateParams, Product, Upload, $timeout) {
    $scope.product = Product.get({id: $stateParams.id});
    $scope.editProduct = function(){
      Product.update({id: $scope.product._id}, $scope.product, function success(value){
        $state.go('viewProduct', {id: value._id});
      }, errorHandler($scope));
    };

    $scope.upload = uploadHander($scope, Upload, $timeout);
  })
  .controller('ProductCheckoutCtrl',
  function($scope, $http, $state, ngCart){
  $scope.errors = '';

  $scope.paymentOptions = {
    onPaymentMethodReceived: function(payload) {
      angular.merge(payload, ngCart.toObject());
      payload.total = payload.totalCost;
      console.error(payload);
      $http.post('/api/orders', payload)
      .then(function success () {
        ngCart.empty(true);
        $state.go('products');
      }, function error (res) {
        $scope.errors = res;
      });
    }
  };
});



errorHandler = function ($scope){
  return function error(httpResponse){
    $scope.errors = httpResponse;
  };
};

uploadHander = function ($scope, Upload, $timeout) {
  return function(file) {
    if (file && !file.$error) {
      $scope.file = file;
      file.upload = Upload.upload({
        url: '/api/products/'+$scope.product._id+'/upload',
        file: file
      });

      file.upload.then(function (response) {
        $timeout(function () {
          file.result = response.data;
        });
      }, function (response) {
        if (response.status > 0){
          console.log(response.status + ': ' + response.data);
          errorHandler($scope)(response.status + ': ' + response.data);
        }
      });

      file.upload.progress(function (evt) {
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }
  };
};
