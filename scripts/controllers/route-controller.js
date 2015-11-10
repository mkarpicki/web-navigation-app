angular.module('navigationApp.controllers').controller('RouteController',
    ["$scope", '$sce', '$routeParams', "routingService",
        function($scope, $sce, $routeParams, routingService) {

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

            $scope.trustedText = function (text) {
                return $sce.trustAsHtml(text);
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
                        break;
                    }
                }

                if (!route) {
                    $scope.undefinedRoute = true;
                }

            };

            getRoute($routeParams.index)

        }]);