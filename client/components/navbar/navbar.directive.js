'use strict';

angular.module('vrshopApp')
  .directive('navbar', () => ({
    templateUrl: 'components/navbar/navbar.html',
    restrict: 'E',
    controller: 'NavbarCtrl'
  }));
