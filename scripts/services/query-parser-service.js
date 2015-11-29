angular.module('navigationApp.services').factory('queryParserService', ['$interpolate', '$location', function ($interpolate, $location) {

    'use strict';

    var WayPointVariable = 'w',
        AvoidAreaVariable = 'a';

    var wayPointsStorage = [],
        areasToAvoidStorage = [];

    var serializeQuery = function () {

        var w = serializeWayPoints(wayPointsStorage),
            a = serializeAreasToAvoid(areasToAvoidStorage);

        return ( w + ((a !== '')? '&' + a : '') );
    };

    var deserializeQuery = function () {

        var wayPoints = deserializeWayPoints($location.search()) || [];
        var areasToAvoid = deserializeAreasToAvoid($location.search()) || [];

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
        return parseSearch(search, WayPointVariable);
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

    return {
        serializeQuery: serializeQuery,
        deserializeQuery: deserializeQuery,

        clear: clear,
        setWayPoints: setWayPoints,
        setAreasToAvoid: setAreasToAvoid,

        overwriteStartPoint: overwriteStartPoint,
        overwriteDestinationPoint: overwriteDestinationPoint,
        addWayPoint: addWayPoint,
        addAreaToAvoid: addAreaToAvoid
    };

}]);
