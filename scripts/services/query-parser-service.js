angular.module('navigationApp.services').factory('queryParserService', ['$interpolate', '$location', function ($interpolate, $location) {

    'use strict';

    var WayPointVariable = 'w',
        AvoidAreaVariable = 'a';

    var serializeQuery = function (wayPoints, areasToAvoid) {
        return serializeWayPoints(wayPoints) + serializeAreasToAvoid(areasToAvoid);
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

    return {
        serializeQuery: serializeQuery,
        deserializeQuery: deserializeQuery
    };

}]);
