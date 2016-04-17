/**
 * @todo
 * implement clicking on maneuvers to move map into on map
 */
angular.module('navigationApp.controllers').controller('RouteController',
    ['$scope', '$sce', '$routeParams', 'config', 'events', 'routingService', 'stateService', 'mapApiService',
        function($scope, $sce, $routeParams, config, events, routingService, stateService, mapApiService) {

            'use strict';

            $scope.route = null;
            $scope.undefinedRoute = false;
            $scope.index = $routeParams.index;

            $scope.getManeuver = function () {
                var maneuver = [];

                if ($scope.route && $scope.route.leg && $scope.route.leg[0]) {
                    maneuver =  $scope.route.leg[0].maneuver;
                }

                return maneuver;
            };

            $scope.trustedText = function (text) {
                return $sce.trustAsHtml(text);
            };

            var getRoute = function (index) {

                var nIndex = parseInt(index, 10),
                    routes,
                    route;

                if (isNaN(nIndex)) {
                    $scope.undefinedRoute = true;
                    return;
                }

                routes = routingService.getResults();

                for (var i = 0, len = routes.length; i < len; i++) {

                    if (i === nIndex) {
                        routes[i].hidden = false;
                        route = routes[i];
                    } else {
                        routes[i].hidden = true;
                    }
                }

                if (route) {

                    mapApiService.centerToRoute(route);
                    $scope.route = route;

                } else {
                    $scope.undefinedRoute = true;
                }

            };

            getRoute($routeParams.index);

        }]);