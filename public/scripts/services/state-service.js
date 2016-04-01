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
        return point.text + '|' + point.coordinates;
    };

    var serializeAreaToAvoid = function (areaToAvoid) {
        return areaToAvoid.text + '|' + areaToAvoid.boundingBox;
    };

    var serializeQuery = function () {

        var w = serializeWayPoints(wayPointsStorage),
            a = serializeAreasToAvoid(areasToAvoidStorage);

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
            areaParsed;

        for (var i = 0, l = areas.length; i < l; i++) {

            areaParsed = areas[i].split('|');

            areas[i] = dataModelService.getBoundingBox(areaParsed[0], areaParsed[1]);
        }

        return areas;
    };

    var deserializeWayPoints = function (search) {

        var wayPoints = parseSearch(search, WayPointVariable),
            wayPointParsed;

        for (var i = 0, l = wayPoints.length; i < l; i++) {

            wayPointParsed = wayPoints[i].split('|');

            wayPoints[i] = dataModelService.getWayPoint(wayPointParsed[0], [], wayPointParsed[1]);
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

    var setAreasToAvoid = function (areasToAvoid) {

        for (var i = 0, l = areasToAvoid.length; i < l; i++) {
            areasToAvoid[i] = serializeAreaToAvoid(areasToAvoid[i]);
        }

        areasToAvoidStorage = areasToAvoid;
    };

    var setWayPoints = function (wayPoints) {

        for (var i = 0, l = wayPoints.length; i < l; i++) {
            wayPoints[i] = serializeWayPoint(wayPoints[i]);
        }

        wayPointsStorage = wayPoints;
    };

    var clear = function () {
        wayPointsStorage = [];
        areasToAvoidStorage = [];
    };

    var overwriteStartPoint = function (point) {
        wayPointsStorage[0] = serializeWayPoint(point);
    };

    var addDestinationPoint = function (point) {

        wayPointsStorage.push(serializeWayPoint(point));
    };

    var overwriteDestinationPoint = function (point) {

        point = serializeWayPoint(point);

        if (wayPointsStorage.length < 3) {

            wayPointsStorage.push(point);

        } else {

            wayPointsStorage[wayPointsStorage.length - 1] = point;

        }

    };

    var addWayPoint = function (point) {

        point = serializeWayPoint(point);

        if (wayPointsStorage.length < 2) {

            wayPointsStorage[wayPointsStorage.length] = point;

        } else {

            var endPoint = wayPointsStorage[wayPointsStorage.length - 1];

            wayPointsStorage[wayPointsStorage.length - 1] = point;

            wayPointsStorage.push(endPoint);
        }

    };

    var addAreaToAvoid = function (area) {

        area = serializeAreaToAvoid(area);

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

    /**
     * @todo dataModel should have that logic and be used here
     * @param wayPoint
     * @returns {{text: *, coordinates: {latitude: *, longitude: *}}}
     */
    var wayPointAsObject = function (wayPoint) {
        var props = wayPoint.split('|'),
            text = props[0],
            coordinates = props[1].split(',');

        return {
            text: text,
            coordinates: {
                latitude: coordinates[0],
                longitude: coordinates[1]
            }
        };
    };

    /**
     * @todo dataModel should have that logic and be used here
     * @param areaToAvoid
     * @returns {{text: *, coordinates: {latitude: *, longitude: *}}}
     */
    var areaToAvoidAsObject = function (areaToAvoid) {
        var props = areaToAvoid.split('|'),
            text = props[0],
            coordinates = props[1].split(';');

        var topLeft = coordinates[0].split(','),
            bottomRight = coordinates[1].split(',');

        return {
            text: text,
            boundingBox: {
                topLeft: { latitude: topLeft[0], longitude: topLeft[1] },
                bottomRight: { latitude: bottomRight[0], longitude: bottomRight[1] }
            }
        };
    };

    var getSearchCriteriaAsObjects = function () {

        var wayPoints = wayPointsStorage.map(function(wayPoint) {
            return wayPointAsObject(wayPoint);
        });

        var areasToAvoid = areasToAvoidStorage.map(function (areaToAvoid) {
            return areaToAvoidAsObject(areaToAvoid);
        });

        return {
            wayPoints: wayPoints,
            areasToAvoid: areasToAvoid
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

        getSearchCriteriaAsObjects: getSearchCriteriaAsObjects,

        back: back
    };

}]);
