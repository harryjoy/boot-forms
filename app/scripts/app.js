/**
 * @author harsh.r
 */
(function() {
  'use strict';

  // shared module, in which all common code/services/html will reside.
  angular.module('wooterApp.shared', []);

  /**
   * @ngdoc overview
   * @name wooterApp
   * @description
   * # wooterApp
   * Main module of the application.
   */
  angular.module('wooterApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'ui.select',
    'uiGmapgoogle-maps',

    'wooterApp.shared'
  ]).config(function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'scripts/home/home.html',
      controller: 'HomeCtrl',
      controllerAs: 'home'
    }).otherwise({
      redirectTo: '/'
    });
  });

})();