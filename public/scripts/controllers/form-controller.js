angular.module('navigationApp.controllers').controller('FormController',
    ["$rootScope", "$scope", '$location', '$timeout', 'routingService', 'stateService', 'searchService' , function($rootScope, $scope, $location, $timeout, routingService, stateService, searchService) {

        'use strict';

        //$scope.from = '52.40626,13.49667';
        //$scope.to = '52.51083,13.45264';
        //$scope.wayPoints = ['52.46325,13.3882'];

        var serviceHandler,
            activeFieldIndex = null,

            WayPoint = function (t, s, c) {

                this.text = t || '';
                this.suggestions = s || [];
                this.coordinates = c || '';
            };

        $scope.wayPoints = [];
        $scope.areasToAvoid = [];
        $scope.geoLocation = null;

        $scope.getRoute = function () {

            //if (!$scope.from || !$scope.to) {
            //    return;
            //}

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
             * will consider different approach like keeping wayPoints in session storage and
             * use it if no deep link to pre fill form, lets see
             */
            $timeout(function () {
                $location.url('/search?' + query );
            }, 500);

        };

        $scope.addWayPoint = function () {
            $scope.wayPoints.push(new WayPoint());
        };

        $scope.removeWayPoint = function (index) {
            $scope.wayPoints.splice(index, 1);
            /**
             * @fixem
             * and bring me back
             */
            //$location.url('/?' + buildSearchQuery());
        };

        $scope.removeWayAreaToAvoid = function (index) {
            $scope.areasToAvoid.splice(index, 1);
            $location.url('/?' + buildSearchQuery());
        };

        $scope.clear = function () {

            $scope.wayPoints = getClearWaypoints();

            stateService.clear();
            $location.url('/').replace();
        };

        $scope.onInputDefined = function () {

            $location.url('/?' + buildSearchQuery());
        };

        $scope.markActiveField = function(index) {
            activeFieldIndex = index;
        };

        $scope.unMarkActiveField = function () {
            activeFieldIndex = null;
        };

        $scope.isActiveField = function (index) {
            return (index === activeFieldIndex);
        };

        $scope.getSuggestions = function (){

            var searchValue = $scope.wayPoints[activeFieldIndex].text;

            if (serviceHandler) {
                serviceHandler.cancel();
            }

            serviceHandler = searchService.getSuggestions(searchValue, $rootScope.currentPosition);

            serviceHandler.promise.then(function (httpResponse) {

                if (httpResponse && httpResponse.status === 200 && httpResponse.data) {
                    $scope.wayPoints[activeFieldIndex].suggestions = httpResponse.data.suggestions;
                }
            });

        };

        $scope.search = function (searchValue) {

            if (serviceHandler) {
                serviceHandler.cancel();
            }

            serviceHandler = searchService.getResults(searchValue, $rootScope.currentPosition);

            serviceHandler.promise.then(function (httpResponse) {

                if (httpResponse && httpResponse.status === 200 && httpResponse.data) {

                    var data = httpResponse.data.results.items;

                    if (data) {
                        $scope.wayPoints[activeFieldIndex] = new WayPoint(data[0].title, [], data[0].position.join(','));
                        //$scope.wayPoints[activeFieldIndex] = {
                        //    text: data[0].title,
                        //    suggestions: [],
                        //    coordinates: data[0].position.join(',')
                        //};
                        $scope.unMarkActiveField();
                    }

                }
            });
        };

        var getClearWaypoints = function () {
            return [new WayPoint(), new WayPoint()];
        };

        var buildSearchQuery = function () {

            //var allPoints = [$scope.from].concat($scope.wayPoints).concat($scope.to);
            var allPoints = $scope.wayPoints;
            var areasToAvoid = $scope.areasToAvoid;

            stateService.clear();
            stateService.setWayPoints(allPoints);
            stateService.setAreasToAvoid(areasToAvoid);

            return stateService.serializeQuery();

        };

        var getReady = function(){

            var deSerializedQuery = stateService.deserializeQuery(),
                wayPoints = deSerializedQuery.wayPoints,
                areasToAvoid = deSerializedQuery.areasToAvoid;

            if (wayPoints.length > 1) {

                $scope.wayPoints = wayPoints.map(function (wayPoint) {
                    return new WayPoint(wayPoint.text, [], wayPoint.coordinates);
                });

            } else {
                $scope.wayPoints = getClearWaypoints();
            }

            if (areasToAvoid.length > 0) {
                $scope.areasToAvoid = areasToAvoid;
            }

            routingService.clearResults();

        };

        getReady();

    }]);