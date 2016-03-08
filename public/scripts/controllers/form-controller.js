angular.module('navigationApp.controllers').controller('FormController',
    ["$rootScope", "$scope", '$location', '$timeout', 'routingService', 'stateService', 'searchService', 'dataModel' , function($rootScope, $scope, $location, $timeout, routingService, stateService, searchService, dataModel) {

        'use strict';

        //$scope.from = '52.40626,13.49667';
        //$scope.to = '52.51083,13.45264';
        //$scope.wayPoints = ['52.46325,13.3882'];

        var serviceHandler,
            activeFieldIndex = null;

        $scope.wayPoints = [];
        $scope.areasToAvoid = [];
        $scope.geoLocation = null;

        $scope.getRoute = function () {

            var enteredWayPoints = $scope.wayPoints.filter(function (wayPoint) {
                return (wayPoint.coordinates !== "");
            });

            if (enteredWayPoints.length < 2) {
                return;
            }

            $scope.wayPoints = enteredWayPoints;

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
                $location.url('/search?' + query);
            }, 500);

        };

        $scope.addWayPoint = function () {
            $scope.wayPoints.splice($scope.wayPoints.length - 1, 0, dataModel.getWayPoint());
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

            $scope.wayPoints = getClearWayPoints();

            stateService.clear();
            $location.url('/').replace();
        };

        //$scope.onInputDefined = function () {
        //
        //    $location.url('/?' + buildSearchQuery());
        //};

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

            serviceHandler.promise.then(function (suggestions) {

                $scope.wayPoints[activeFieldIndex].suggestions = suggestions;
            });

        };

        $scope.search = function (searchValue) {

            if (serviceHandler) {
                serviceHandler.cancel();
            }

            serviceHandler = searchService.getResults(searchValue, $rootScope.currentPosition);

            serviceHandler.promise.then(function (searchResults) {

                if (searchResults) {

                    $scope.wayPoints[activeFieldIndex] = dataModel.getWayPoint(searchResults[0].title, [], searchResults[0].position.join(','));

                    $location.url('/?' + buildSearchQuery());
                    //$scope.unMarkActiveField();
                }

            });

        };

        var getClearWayPoints = function () {
            return [dataModel.getWayPoint(), dataModel.getWayPoint()];
        };

        var buildSearchQuery = function () {

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

            $scope.wayPoints = getClearWayPoints();

            if (wayPoints.length > 0) {

                for (var i = 0, len = wayPoints.length; i < len; i++) {
                    $scope.wayPoints[i] = dataModel.getWayPoint(wayPoints[i].text, [], wayPoints[i].coordinates);
                }

            }

            if (areasToAvoid.length > 0) {
                $scope.areasToAvoid = areasToAvoid;
            }

            routingService.clearResults();

        };

        getReady();

    }]);