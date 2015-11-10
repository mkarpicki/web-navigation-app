angular.module('navigationApp.controllers').controller('RouteController',
    ["$scope", '$routeParams', "routingService",
        function($scope, $routeParams, routingService) {

            'use strict';

            $scope.route = null;
            $scope.undefinedRoute = false;

            $scope.getManeuver = function () {
                var maneuver = [];

                if ($scope.route && $scope.route.leg && $scope.route.leg[0]) {
                    maneuver =  $scope.route.leg[0].maneuver;
                }

                return maneuver;
            };

            var getRoute = function (index) {

                var nIndex = Number(index);

                if (isNaN(nIndex)) {
                    $scope.undefinedRoute = true;
                }

                var routes = routingService.getResults(),
                    route;

                routingService.clearResults();

                for (var i = 0, l = routes.length; i < l; i++) {

                    route = routes[i];

                    if (i === nIndex) {

                        $scope.route = route;
                        routingService.saveRoute(route);

                        console.log('d', route);
                        break;
                    }
                }

                if (!route) {
                    $scope.undefinedRoute = true;
                }

            };

            getRoute($routeParams.index)

        }]);