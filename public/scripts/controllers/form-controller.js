angular.module('navigationApp.controllers').controller('FormController',
    ["$rootScope", "$scope", '$location', 'routingService', 'stateService', 'searchService', 'dataModelService' , function($rootScope, $scope, $location, routingService, stateService, searchService, dataModelService) {

        'use strict';

        var serviceHandler,
            activeFieldIndex = null;

        $scope.wayPoints = [];
        $scope.areasToAvoid = [];
        $scope.geoLocation = null;

        $scope.getRoute = function () {

            var enteredWayPoints = $scope.wayPoints.filter(function (wayPoint) {
                return (wayPoint && wayPoint.coordinates !== "" && wayPoint.coordinates !== null);
            });

            if (enteredWayPoints.length < 2) {
                return;
            }

            $scope.wayPoints = enteredWayPoints;

            $location.url('/search?' + buildSearchQuery());

        };

        $scope.addWayPoint = function () {
            $scope.wayPoints.splice($scope.wayPoints.length - 1, 0, dataModelService.getWayPoint());
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

                    $scope.wayPoints[activeFieldIndex] = dataModelService.getWayPoint(searchResults[0].title, [], searchResults[0].position.join(','));

                    $location.url('/?' + buildSearchQuery());
                    //$scope.unMarkActiveField();
                }

            });

        };

        var getClearWayPoints = function () {
            return [dataModelService.getWayPoint(), dataModelService.getWayPoint()];
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

            wayPoints = wayPoints.filter(function (wayPoint) {
                return (wayPoint && wayPoint.coordinate !== "" && wayPoint.coordinate !== null);
            });

            if (wayPoints.length > 0) {
                $scope.wayPoints = wayPoints;
            }

            areasToAvoid = areasToAvoid.filter(function (areaToAvoid) {
                return (areaToAvoid && areaToAvoid.boundingBox !== "" && areaToAvoid.boundingBox !== null);
            });

            if (areasToAvoid.length > 0) {
                $scope.areasToAvoid = areasToAvoid;
            }

            routingService.clearResults();

        };

        getReady();

    }]);