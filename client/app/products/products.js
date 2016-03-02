'use strict';

angular.module('vrshopApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('products', {
        url: '/products',
        templateUrl: 'app/products/templates/product-list.html',
        controller: 'ProductsCtrl'
      })

      .state('newProduct', {
        url: '/products/new',
        templateUrl: 'app/products/templates/product-new.html',
        controller: 'ProductNewCtrl'
      })

      .state('viewProduct', {
        url: '/products/:id',
        templateUrl: 'app/products/templates/product-view.html',
        controller: 'ProductViewCtrl'
      })

      .state('viewSpace', {
        url: '/products/:id/space',
        templateUrl: 'app/products/templates/product-space.html',
        controller: 'ProductSpaceCtrl'
      })

      .state('editProduct', {
        url: '/products/:id/edit',
        templateUrl: 'app/products/templates/product-edit.html',
        controller: 'ProductEditCtrl'
      })
      .state('checkout', {
        url: '/checkout',
        templateUrl: 'app/products/templates/products-checkout.html',
        controller: 'ProductCheckoutCtrl'
      })
      .state('productCatalog', {
        url: '/products/:slug',
        templateUrl: 'app/products/products.html',
        controller: 'ProductCatalogCtrl'
       })
  });
