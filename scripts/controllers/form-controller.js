angular.module('navigationApp.controllers').controller('FormController',
    ["$scope", '$location', '$timeout', 'routingService', 'queryParserService',
        function($scope, $location, $timeout, routingService, queryParserService) {

        'use strict';

        //$scope.from = '52.40626,13.49667';
        //$scope.to = '52.51083,13.45264';
        //$scope.wayPoints = ['52.46325,13.3882'];

        $scope.wayPoints = [];
        $scope.areasToAvoid = [];

        $scope.getRoute = function () {

            if (!$scope.from || !$scope.to) {
                return;
            }

            var query = buildSearchQuery();

            /**
             * @todo
             * remove me if url will be updated by changing of inputs
             */
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
            $location.url('/?' + buildSearchQuery());
        };

        $scope.removeWayAreaToAvoid = function (index) {
            $scope.areasToAvoid.splice(index, 1);
            $location.url('/?' + buildSearchQuery());
        };

        $scope.clear = function () {

            $location.url('/').replace();
        };

        $scope.onInputDefined = function () {

            $location.url('/?' + buildSearchQuery());
        };

        var buildSearchQuery = function () {

            var allPoints = [$scope.from].concat($scope.wayPoints).concat($scope.to);
            var areasToAvoid = $scope.areasToAvoid;

            queryParserService.clear();
            queryParserService.setWayPoints(allPoints);
            queryParserService.setAreasToAvoid(areasToAvoid);

            return queryParserService.serializeQuery();

        };

        var getReady = function(){

            var wayPoints = queryParserService.deserializeQuery().wayPoints;
            var areasToAvoid = queryParserService.deserializeQuery().areasToAvoid;

            if (wayPoints.length > 0) {

                $scope.from = wayPoints.shift();
                $scope.to = wayPoints.pop();
                $scope.wayPoints = wayPoints;

            }

            if (areasToAvoid.length > 0) {
                $scope.areasToAvoid = areasToAvoid;
            }

            routingService.clearResults();

        };

        getReady();

    }]);