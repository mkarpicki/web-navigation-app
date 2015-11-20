angular.module('navigationApp.controllers').controller('FormController',
    ["$scope", '$location', '$timeout', 'queryParserService',
        function($scope, $location, $timeout, queryParserService) {

        'use strict';

        $scope.from = '52.40626,13.49667';
        $scope.to = '52.51083,13.45264';

        //$scope.wayPoints = ['52.46325,13.3882'];
        $scope.wayPoints = [];

        $scope.getRoute = function () {

            if (!$scope.from || !$scope.to) {
                return;
            }

            var query = buildSearchQuery();

            $location.url('/?' + query).replace();

            /**
             * @readme
             * used timeout here to replace state with filled form
             * and then go to search
             * will consider different approach like keeping waypoints in session storage and
             * use it if no deep link to pre fill form, lets see
             */
            $timeout(function () {
                $location.url('/search?' + query );
            }, 500);

        };

        $scope.addWayPoint = function () {
            $scope.wayPoints.push('');
        };

        $scope.removeWayPoint = function (index) {
            $scope.wayPoints.splice(index, 1);
        };

        var buildSearchQuery = function () {

            var allPoints = [$scope.from].concat($scope.wayPoints).concat($scope.to);

            return queryParserService.serializeWayPoints(allPoints);

        };

        var getReady = function(){

            var waypoints = queryParserService.deserializeWayPoints($location.search());

            if (waypoints.length > 1) {

                $scope.from = waypoints.shift();
                $scope.to = waypoints.pop();
                $scope.wayPoints = waypoints;

            }

        };

        getReady();

    }]);