/**
 * @fixme
 * consider updating state when location found start point
 * if so then keep in state if use or not use location
 */
angular.module('navigationApp.controllers').controller('FormController',
    ['$rootScope', '$scope', '$location', 'config', 'events', 'stateService', 'searchService', 'mapApiService', 'geoCoderService',
        function($rootScope, $scope, $location, config, events, stateService, searchService, mapApiService, geoCoderService) {

        'use strict';

        var serviceHandler,
            activeFieldIndex = null,

            lastFoundPosition = null;

        $scope.wayPoints = [];
        $scope.areasToAvoid = [];
        $scope.geoLocation = null;

        $scope.useCurrentPosition = false;
        $scope.currentPositionAvailable = false;

        $scope.getRoute = function () {

            var enteredWayPoints = $scope.wayPoints.filter(function (wayPoint) {
                return (wayPoint && wayPoint.coordinates !== null);
            });

            if (enteredWayPoints.length < 2) {
                return;
            }

            $scope.wayPoints = enteredWayPoints;

            $location.url('/search?' + buildSearchQuery());

        };

        $scope.addWayPoint = function () {
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

        $scope.moveWayPointDown = function (index) {
            //var wayPoint = $scope.wayPoints[index];
            //$scope.wayPoints[index] = $scope.wayPoints[index + 1];
            //$scope.wayPoints[index + 1] = wayPoint;
            moveWayPoint(index, 1);
        };

        $scope.moveWayPointUp = function (index) {
            //var wayPoint = $scope.wayPoints[index];
            //$scope.wayPoints[index] = $scope.wayPoints[index - 1];
            //$scope.wayPoints[index - 1] = wayPoint;
            moveWayPoint(index, -1);
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

            serviceHandler = searchService.getSuggestions(searchValue, lastFoundPosition);

            serviceHandler.promise.then(function (suggestions) {

                $scope.wayPoints[activeFieldIndex].suggestions = suggestions;
            });

        };

        $scope.search = function (searchValue) {

            if (serviceHandler) {
                serviceHandler.cancel();
            }

            serviceHandler = searchService.getResults(searchValue, lastFoundPosition);

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

        $scope.useCurrentPositionAsStartPoint = function () {

            if (!$scope.useCurrentPosition) {
                return;
            }

            setStartPointFromPosition(lastFoundPosition);
        };

        $scope.$on(events.POSITION_EVENT, function (event, params) {

            if (params.eventType === events.POSITION_EVENT_TYPES.CHANGE) {

                $scope.currentPositionAvailable = true;

                var geoPosition = params.param;

                var currentPosition = {
                    latitude : geoPosition.coords.latitude,
                    longitude : geoPosition.coords.longitude
                };

                lastFoundPosition = currentPosition;

                if ($scope.useCurrentPosition && positionChangedEnough(currentPosition, lastFoundPosition)) {
                    setStartPointFromPosition(lastFoundPosition);
                }

            } else if (params.eventType === events.POSITION_EVENT_TYPES.ERROR) {

                $scope.currentPositionAvailable = false;
            }

            $scope.$apply();
        });

        var moveWayPoint = function (index, position) {

            var wayPoint = $scope.wayPoints[index];
            $scope.wayPoints[index] = $scope.wayPoints[index + position];
            $scope.wayPoints[index + position] = wayPoint;

            $location.url('/?' + buildSearchQuery());
        };

        var setStartPointFromPosition = function (position) {

            if (!position) {
                return;
            }

            geoCoderService.reverse(position).then(function (text) {

                if (!text) {
                    return;
                }

                $scope.wayPoints[0] = {
                    title: text,
                    coordinates: {
                        latitude: position.latitude,
                        longitude: position.longitude
                    }
                };
            });

        };

        var positionChangedEnough = function (currentPosition, lastPosition) {
            return (lastPosition && mapApiService.distance(currentPosition, lastPosition) > config.NUMBER_OF_METERS_OF_POSITION_CHANGED_TO_REACT);
        };

        var getClearWayPoints = function () {
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

            var deSerializedQuery = stateService.getSearchCriteria(),
                wayPoints = deSerializedQuery.wayPoints,
                areasToAvoid = deSerializedQuery.areasToAvoid;

            $scope.wayPoints = getClearWayPoints();

            wayPoints = wayPoints.filter(function (wayPoint) {
                return (wayPoint && wayPoint.coordinates);
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

            stateService.clearRoutes();

        };

        getReady();

    }]);