/**
 * @readme
 * 1st. consider to remove dependency on $location.search as it is used partially now (only one way and second way I guess in controllers)
 * or make all dependencies inside service to cut them of from controllers level - then it gives possibilities to change where state is being kept
 * (url, session storage etc).
 */
angular.module('navigationApp.services').factory('stateService', ['$rootScope', '$interpolate', '$location', 'events', function ($rootScope, $interpolate, $location, events) {

    'use strict';

    var WayPointVariable = 'w',
        AvoidAreaVariable = 'a';

    var wayPointsStorage = [],
        areasToAvoidStorage = [],

        navigationMode = false;

    var serializeQuery = function () {

        var w = serializeWayPoints(wayPointsStorage),
            a = serializeAreasToAvoid(areasToAvoidStorage);

        return ( w + ((a !== '')? '&' + a : '') );
    };

    var deserializeQuery = function () {

        var wayPoints = deserializeWayPoints($location.search());
        var areasToAvoid = deserializeAreasToAvoid($location.search());
        //
        //var wayPoints = deserializeWayPoints($location.search()) || [];
        //var areasToAvoid = deserializeAreasToAvoid($location.search()) || [];

        return {
            wayPoints: wayPoints,
            areasToAvoid: areasToAvoid
        };
    };

    var serializeAreasToAvoid = function (allAreasToAvoid) {

        return buildQuery(AvoidAreaVariable, allAreasToAvoid);
    };

    var deserializeAreasToAvoid = function (search) {
        return parseSearch(search, AvoidAreaVariable);
    };

    var deserializeWayPoints = function (search) {

        var wayPoints = parseSearch(search, WayPointVariable),
            wayPointParsed;

        for (var i = 0, l = wayPoints.length; i < l; i++) {

            wayPointParsed = wayPoints[i].split('|');

            wayPoints[i] = {
                text: wayPointParsed[0],
                coordinates: wayPointParsed[1]
            };
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
        areasToAvoidStorage = areasToAvoid;
    };

    var setWayPoints = function (wayPoints) {

        for (var i = 0, l = wayPoints.length; i < l; i++) {
            wayPoints[i] = wayPoints[i].text + '|' + wayPoints[i].coordinates;
        }

        wayPointsStorage = wayPoints;
    };

    var clear = function () {
        wayPointsStorage = [];
        areasToAvoidStorage = [];
    };

    var overwriteStartPoint = function (point) {
        wayPointsStorage[0] = point;
    };

    var overwriteDestinationPoint = function (point) {

        if (wayPointsStorage.length < 3) {

            wayPointsStorage.push(point);

        } else {

            wayPointsStorage[wayPointsStorage.length - 1] = point;

        }

    };

    var addWayPoint = function (point) {

        if (wayPointsStorage.length < 2) {

            wayPointsStorage[wayPointsStorage.length] = point;

        } else {

            var endPoint = wayPointsStorage[wayPointsStorage.length - 1];

            wayPointsStorage[wayPointsStorage.length - 1] = point;

            wayPointsStorage.push(endPoint);
        }

    };

    var addAreaToAvoid = function (area) {

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

    return {
        serializeQuery: serializeQuery,
        deserializeQuery: deserializeQuery,

        clear: clear,
        setWayPoints: setWayPoints,
        setAreasToAvoid: setAreasToAvoid,

        overwriteStartPoint: overwriteStartPoint,
        overwriteDestinationPoint: overwriteDestinationPoint,
        addWayPoint: addWayPoint,
        addAreaToAvoid: addAreaToAvoid,

        isNavigationModeEnabled: isNavigationModeEnabled,
        enableNavigationMode: enableNavigationMode,
        disableNavigationMode: disableNavigationMode
    };

}]);
