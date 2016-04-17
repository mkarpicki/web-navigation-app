angular.module('navigationApp').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    'use strict';

    $routeProvider.
        when('/', {
            templateUrl: 'templates/form.html',
            controller: 'FormController'
        }).
        when('/search', {
            templateUrl: 'templates/search-results.html',
            controller: 'SearchController'
        }).
        when('/route/:index', {
            templateUrl: 'templates/route.html',
            controller: 'RouteController'
        }).
        when('/navigate/:index', {
            templateUrl: 'templates/navigation.html',
            controller: 'NavigationController'
        }).
        otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);

}]);