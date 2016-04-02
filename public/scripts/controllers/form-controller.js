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
                //return (wayPoint &&
                //wayPoint.coordinates !== null &&
                //wayPoint.coordinates.latitude !== null &&
                //wayPoint.coordinates.longitude !== null);
                return (wayPoint && wayPoint.coordinates !== null);
            });

            if (enteredWayPoints.length < 2) {
                return;
            }

            $scope.wayPoints = enteredWayPoints;

            $location.url('/search?' + buildSearchQuery());

        };

        $scope.addWayPoint = function () {
            //$scope.wayPoints.splice($scope.wayPoints.length - 1, 0, dataModelService.getWayPoint());
            $scope.wayPoints.splice($scope.wayPoints.length - 1, 0, {
                title: '',
                coordinates: {
                    latitude: null,
                    longitude: null
                }
            });
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

            var searchValue = $scope.wayPoints[activeFieldIndex].title;

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

                    $scope.wayPoints[activeFieldIndex] = {
                        title: searchResults[0].title,
                        coordinates: {
                            latitude: searchResults[0].position[0],
                            longitude: searchResults[0].position[1]
                        }
                    };

                    $location.url('/?' + buildSearchQuery());
                }

            });

        };

        var getClearWayPoints = function () {
            //return [dataModelService.getWayPoint(), dataModelService.getWayPoint()];
            return [
                {
                    title: '',
                    coordinates: {
                        latitude: null,
                        longitude: null
                    }
                },
                {
                    title: '',
                    coordinates: {
                        latitude: null,
                        longitude: null
                    }
                }
            ];
        };

        var buildSearchQuery = function () {

            stateService.clear();
            stateService.setWayPoints($scope.wayPoints);
            stateService.setAreasToAvoid($scope.areasToAvoid);

            return stateService.serializeQuery();

        };

        var getReady = function(){

            var deSerializedQuery = stateService.deserializeQuery(),
                wayPoints = deSerializedQuery.wayPoints,
                areasToAvoid = deSerializedQuery.areasToAvoid;

            $scope.wayPoints = getClearWayPoints();

            wayPoints = wayPoints.filter(function (wayPoint) {
                return (wayPoint && wayPoint.coordinates!== null);
            });

            if (wayPoints.length > 1) {
                $scope.wayPoints = wayPoints;
            } else if (wayPoints.length === 1) {
                $scope.wayPoints[0] = wayPoints[0];
            }

            areasToAvoid = areasToAvoid.filter(function (areaToAvoid) {
                return (areaToAvoid && areaToAvoid.boundingBox !== null);
            });

            if (areasToAvoid.length > 0) {
                $scope.areasToAvoid = areasToAvoid;
            }

            routingService.clearResults();

        };

        getReady();

    }]);