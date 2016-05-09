/**
 * @todo
 * implement clicking on maneuvers to move map into on map
 */
angular.module('navigationApp.controllers').controller('RouteController',
    ['$scope', '$sce', '$routeParams', 'config', 'events', 'stateService', 'mapApiService',
        function($scope, $sce, $routeParams, config, events, stateService, mapApiService) {

            'use strict';

            $scope.route = null;
            $scope.undefinedRoute = false;
            $scope.index = $routeParams.index;
            $scope.maneuvers = null;


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

            var getManeuvers = function (route) {

                var maneuvers = [];

                if (route && route.leg) {

                    var lastLeg = route.leg[route.leg.length - 1],
                        maneuversFromLastLeg = lastLeg.maneuver;

                    if (maneuversFromLastLeg) {

                        var lastManeuver = maneuversFromLastLeg[maneuversFromLastLeg.length - 1];

                        for (var i = 0, len = route.leg.length; i < len; i++) {
                            var m = route.leg[i].maneuver;
                            m.pop();
                            maneuvers = maneuvers.concat(m);
                        }

                        maneuvers.push(lastManeuver);

                    }
                }

                return maneuvers;

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