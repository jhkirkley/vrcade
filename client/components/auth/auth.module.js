'use strict';

angular.module('vrshopApp.auth', [
  'vrshopApp.constants',
  'vrshopApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
