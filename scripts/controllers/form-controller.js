angular.module('navigationApp.controllers').controller('FormController',
    ["$scope", '$interpolate', '$location', '$timeout', function($scope, $interpolate, $location, $timeout) {

        'use strict';

        $scope.from = '52.40626,13.49667';
        $scope.to = '52.51083,13.45264';

        $scope.wayPoints = ['52.46325,13.3882'];

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

            var allPoints = [$scope.from].concat($scope.wayPoints).concat($scope.to),
                waypointQuery = "{{separator}}waypoint{{i}}={{waypoint}}",
                exp = $interpolate(waypointQuery),
                separator = '',
                query = '';


            for (var i = 0, l = allPoints.length; i < l; i++) {

                query += exp({
                    separator: separator,
                    i: i,
                    waypoint: allPoints[i]
                });

                separator = '&';
            }

            return query;
        };

        var getReady = function(){

            var waypoints = [],
                waypoint,
                i = 0;

            while(true) {
                waypoint = $location.search()['waypoint' + i];

                if (!waypoint) {
                    break;
                }

                waypoints.push(waypoint);
                i++;
            }

            if (waypoints.length > 1) {

                $scope.from = waypoints.shift();
                $scope.to = waypoints.pop();
                $scope.wayPoints = waypoints;

            }

        };

        getReady();

    }]);