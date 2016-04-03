/**
 * @readme
 * 1st. consider to remove dependency on $location.search as it is used partially now (only one way and second way I guess in controllers)
 * or make all dependencies inside service to cut them of from controllers level - then it gives possibilities to change where state is being kept
 * (url, session storage etc).
 * @todo keep objects in state and make as string only when asking for query
 */
angular.module('navigationApp.services').factory('stateService', ['$rootScope', '$interpolate', '$location', '$window', 'events', 'dataModelService', function ($rootScope, $interpolate, $location, $window, events, dataModelService) {

    'use strict';

    var WayPointVariable = 'w',
        AvoidAreaVariable = 'a';

    var wayPointsStorage = [],
        areasToAvoidStorage = [],

        navigationMode = false;

    var serializeWayPoint = function (point) {

        var latitude = (point.coordinates.latitude) ? point.coordinates.latitude : '',
            longitude = (point.coordinates.longitude) ? point.coordinates.longitude : '';

        return point.title + '|' + latitude + ',' + longitude;
    };

    var serializeAreaToAvoid = function (areaToAvoid) {

        var boundingBox = areaToAvoid.boundingBox,
            topLeft = {
                latitude: (boundingBox.topLeft.latitude) ? boundingBox.topLeft.latitude : '',
                longitude: (boundingBox.topLeft.longitude) ? boundingBox.topLeft.longitude : ''
            },
            bottomRight = {
                latitude: (boundingBox.bottomRight.latitude) ? boundingBox.bottomRight.latitude : '',
                longitude: (boundingBox.bottomRight.longitude) ? boundingBox.bottomRight.longitude : ''
            };

        return areaToAvoid.title + '|' +
            topLeft.latitude + "," + topLeft.longitude + ";" +
            bottomRight.latitude + "," + bottomRight.longitude;
    };

    var serializeQuery = function () {

        var wayPoints = wayPointsStorage.map(function (wayPoint) {
            return serializeWayPoint(wayPoint);
        });

        var areasToAvoid = areasToAvoidStorage.map(function (areaToAvoid) {
            return serializeAreaToAvoid(areaToAvoid);
        });

        var w = serializeWayPoints(wayPoints),
            a = serializeAreasToAvoid(areasToAvoid);

        return ( w + ((a !== '')? '&' + a : '') );
    };

    var deserializeQuery = function () {

        var wayPoints = deserializeWayPoints($location.search());
        var areasToAvoid = deserializeAreasToAvoid($location.search());

        return {
            wayPoints: wayPoints,
            areasToAvoid: areasToAvoid
        };
    };

    var serializeAreasToAvoid = function (allAreasToAvoid) {

        return buildQuery(AvoidAreaVariable, allAreasToAvoid);
    };

    var deserializeAreasToAvoid = function (search) {

        var areas = parseSearch(search, AvoidAreaVariable),
            props,
            title,
            coordinates,
            topLeft,
            bottomRight;

        for (var i = 0, l = areas.length; i < l; i++) {

            props = areas[i].split('|');
            title = props[0];
            coordinates = props[1].split(';');

            topLeft = coordinates[0].split(',');
            bottomRight = coordinates[1].split(',');

            areas[i] = {
                title: title,
                boundingBox: {
                    topLeft: { latitude: topLeft[0], longitude: topLeft[1] },
                    bottomRight: { latitude: bottomRight[0], longitude: bottomRight[1] }
                }
            };

        }

        return areas;
    };

    var deserializeWayPoints = function (search) {

        var wayPointsFromSearch = parseSearch(search, WayPointVariable),
            wayPoints = [],
            wayPointParsed,
            coordinates;

        for (var i = 0, l = wayPointsFromSearch.length; i < l; i++) {

            try {
                wayPointParsed = wayPointsFromSearch[i].split('|');
                coordinates = wayPointParsed[1].split(',');

                //wayPoints[i] = dataModelService.getWayPoint(wayPointParsed[0], [], wayPointParsed[1]);
                wayPoints.push({
                    title: wayPointParsed[0],
                    coordinates: {
                        latitude: coordinates[0],
                        longitude: coordinates[1]
                    }
                });
            } catch (e) {
                //ignore for now
            }
        }

        return wayPoints;
    };

    var buildQuery = function (variable, values) {

        var textQuery = "{{separator}}" + variable + "{{i}}={{value}}";

        var exp = $interpolate(textQuery),
            separator = '',
            query = '';

        for (var i = 0, l = values.length; i < l; i++) {

            query += exp({
                separator: separator,
                i: i,
                value: values[i]
            });

            separator = '&';
        }

        return query;

    };

    var serializeWayPoints = function (allPoints) {

        return buildQuery(WayPointVariable, allPoints);
    };

    var parseSearch = function (search, varName) {

        var item,
            items = [],
            i = 0;

        while(true) {
            item = search[varName + i];

            if (!item) {
                break;
            }
            i++;

            items.push(item);
        }

        return items;
    };

    //var isAreaToAvoidValid = function (areaToAvoid) {
    //    return true;
    //};

    //var isWayPointValid = function (wayPoint) {
    //    return (wayPoint &&
    //    wayPoint.coordinates &&
    //    wayPoint.coordinates.latitude &&
    //    wayPoint.coordinates.longitude);
    //};

    var setAreasToAvoid = function (areasToAvoid) {
        //
        //areasToAvoid = areasToAvoid.filter(function (areaToAvoid) {
        //    return isAreaToAvoidValid(areaToAvoid);
        //});

        areasToAvoidStorage = areasToAvoid;
    };

    var setWayPoints = function (wayPoints) {

        //wayPoints = wayPoints.filter(function (wayPoint) {
        //   return isWayPointValid(wayPoint);
        //});

        wayPointsStorage = wayPoints;
    };

    var clear = function () {
        wayPointsStorage = [];
        areasToAvoidStorage = [];
    };

    var overwriteStartPoint = function (point) {

        //if (!isWayPointValid(point)) {
        //    return;
        //}

        wayPointsStorage[0] = point;
    };

    var addDestinationPoint = function (point) {

        //if (!isWayPointValid(point)) {
        //    return;
        //}

        wayPointsStorage.push(point);
    };

    var overwriteDestinationPoint = function (point) {

        //if (!isWayPointValid(point)) {
        //    return;
        //}

        if (wayPointsStorage.length < 3) {

            wayPointsStorage.push(point);

        } else {

            wayPointsStorage[wayPointsStorage.length - 1] = point;

        }

    };

    var addWayPoint = function (point) {
        //
        //if (!isWayPointValid(point)) {
        //    return;
        //}

        if (wayPointsStorage.length < 2) {

            wayPointsStorage[wayPointsStorage.length] = point;

        } else {

            var endPoint = wayPointsStorage[wayPointsStorage.length - 1];

            wayPointsStorage[wayPointsStorage.length - 1] = point;

            wayPointsStorage.push(endPoint);
        }

    };

    var addAreaToAvoid = function (area) {

        //if (!isAreaToAvoidValid(area)) {
        //    return;
        //}

        areasToAvoidStorage.push(area);
    };

    var isNavigationModeEnabled = function () {
        return navigationMode;
    };

    var disableNavigationMode = function () {
        navigationMode = false;
        $rootScope.$broadcast(events.NAVIGATION_STATE_EVENT, {
            eventType: events.NAVIGATION_STATE_EVENT_TYPES.NAVIGATION_OFF
        });
    };

    var enableNavigationMode = function () {
        navigationMode = true;
        $rootScope.$broadcast(events.NAVIGATION_STATE_EVENT, {
            eventType: events.NAVIGATION_STATE_EVENT_TYPES.NAVIGATION_ON
        });

    };

    var back = function () {
        $window.history.back();
    };

    var getSearchCriteria = function () {

        return {
            wayPoints: wayPointsStorage,
            areasToAvoid: areasToAvoidStorage
        }
    };

    var init = function () {
        var objectsFromQuery = deserializeQuery();

        setWayPoints(objectsFromQuery.wayPoints);
        setAreasToAvoid(objectsFromQuery.areasToAvoid);
    };

    init();

    return {
        serializeQuery: serializeQuery,
        deserializeQuery: deserializeQuery,

        clear: clear,
        setWayPoints: setWayPoints,
        setAreasToAvoid: setAreasToAvoid,

        overwriteStartPoint: overwriteStartPoint,
        overwriteDestinationPoint: overwriteDestinationPoint,
        addWayPoint: addWayPoint,
        addDestinationPoint: addDestinationPoint,
        addAreaToAvoid: addAreaToAvoid,

        isNavigationModeEnabled: isNavigationModeEnabled,
        enableNavigationMode: enableNavigationMode,
        disableNavigationMode: disableNavigationMode,

        getSearchCriteria: getSearchCriteria,

        back: back
    };

}]);
