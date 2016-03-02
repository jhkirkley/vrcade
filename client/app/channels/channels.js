'use strict';

angular.module('vrshopApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('channels', {
        url: '/channels',
        templateUrl: 'app/channels/templates/channel-list.html',
        controller: 'ChannelsCtrl',     // add trailing comma
        controllerAs: 'vm'

      });
  });
