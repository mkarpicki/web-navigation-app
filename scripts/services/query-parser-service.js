angular.module('navigationApp.services').factory('queryParserService', ['$interpolate', function ($interpolate) {

    'use strict';


    var serializeWayPoints = function (allPoints) {

        var waypointQuery = "{{separator}}waypoint{{i}}={{waypoint}}",
            exp = $interpolate(waypointQuery),
            separator = '',
            query = '';


        for (var i = 0, l = allPoints.length; i < l; i++) {

            query += exp({
                separator: separator,
                i: i,
                waypoint: allPoints[i]
            });

            separator = '&';
        }

        return query;
    };

    var deserializeWayPoints = function (search) {

        var wayPoint,
            wayPoints = [],
            i = 0;

        while(true) {
            wayPoint = search['waypoint' + i];

            if (!wayPoint) {
                break;
            }
            i++;

            wayPoints.push(wayPoint);
        }

        return wayPoints;
    };

    return {
        serializeWayPoints: serializeWayPoints,
        deserializeWayPoints: deserializeWayPoints
    };

}]);
