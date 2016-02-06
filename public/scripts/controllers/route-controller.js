angular.module('navigationApp.controllers').controller('RouteController',
    ["$scope", '$sce', '$routeParams', "routingService", 'stateService',
        function($scope, $sce, $routeParams, routingService, stateService) {

            'use strict';

            $scope.route = null;
            $scope.undefinedRoute = false;
            $scope.driveModeEnabled = false;

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

            $scope.enableDriveMode = function () {
                $scope.driveModeEnabled = true;
                stateService.enableNavigationMode();
            };

            $scope.disableDriveMode = function () {
                $scope.driveModeEnabled = false;
                stateService.disableNavigationMode();
            };


            var getRoute = function (index) {

                var nIndex = parseInt(index, 10);

                if (isNaN(nIndex)) {
                    $scope.undefinedRoute = true;
                    return;
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

                if (!$scope.route) {
                    $scope.undefinedRoute = true;
                }

            };

            getRoute($routeParams.index);

        }]);