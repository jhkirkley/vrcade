'use strict';

angular.module('vrshopApp', [
  'vrshopApp.auth',
  'vrshopApp.admin',
  'vrshopApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'validation.match',   // add trailing comma
  'ngAnimate',
  'ngFileUpload',
  'ngCart',
  'textAngular'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
