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

  .controller('ProductViewCtrl', function ($sce, $scope, $state, $stateParams, Product) {
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

  .controller('ProductSpaceCtrl', function ($sce, $scope, $state, $stateParams, Product) {
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
