/**
 * @todo
 * implement clicking on maneuvers to move map into on map
 */
angular.module('navigationApp.controllers').controller('RouteController',
    ['$scope', '$sce', '$routeParams', 'config', 'events', 'stateService', 'mapApiService', 'maneuversService',
        function($scope, $sce, $routeParams, config, events, stateService, mapApiService, maneuversService) {

            'use strict';

            $scope.route = null;
            $scope.undefinedRoute = false;
            $scope.index = $routeParams.index;
            $scope.maneuvers = null;

            $scope.trustedText = function (text) {
                return $sce.trustAsHtml(text);
            };

            var getManeuvers = function (route) {

                return maneuversService.getRouteManeuvers(route);

            };

            var getRoute = function (index) {

                var nIndex = parseInt(index, 10),
                    routes,
                    route;

                if (isNaN(nIndex)) {
                    $scope.undefinedRoute = true;
                    return;
                }

                routes = stateService.getRoutes();

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
                    $scope.maneuvers = getManeuvers(route);

                } else {
                    $scope.undefinedRoute = true;
                }

            };

            getRoute($routeParams.index);

        }]);