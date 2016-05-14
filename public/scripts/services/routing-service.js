angular.module('navigationApp.services').factory('routingService', ['$http', '$q', '$interpolate', 'config', function ($http, $q, $interpolate, config) {

    'use strict';

    var appId = config.APP_ID,
        appCode = config.APP_CODE;

    var URL = "https://route.api.here.com/routing/7.2/calculateroute.json?" +
        "app_id={{appId}}" +
        "&app_code={{appCode}}" +
        "{{wayPoints}}" +
        "{{avoidAreas}}" +
        "&alternatives={{alternatives}}" +
        "&legattributes=sm" +
        "&linkattributes=" +
        "&maneuverattributes=all" +
        "&metricSystem=metric" +
        "&mode=fastest;car;traffic:{{traffic}};" +
        "&routeattributes=none,sh,wp,sm,bb,lg,no,li,tx" +
        "&transportModeType=car";

    var buildQuery = function (textQuery, items) {

        var query = '',
            exp = $interpolate(textQuery);

        for (var i = 0, l = items.length; i < l; i++) {
            query += exp({
                i: i,
                item: items[i]
            });
        }

        return query;

    };

    var buildAvoidAreasQuery = function (areasToAvoid) {

        areasToAvoid = [areasToAvoid.join('!')];

        return buildQuery("&avoidareas={{item}}" , areasToAvoid);
    };

    var buildWayPointsQuery = function (wayPoints) {

        return buildQuery("&waypoint{{i}}=geo!{{item}}", wayPoints);

    };

    var getCalculatedRoutes = function (httpResponse) {

        var routes;

        if (httpResponse && httpResponse.data && httpResponse.data.response) {
            routes = httpResponse.data.response.route;
        }

        return routes;
    };

    var calculate = function (wayPoints, areasToAvoid, traffic) {

        var deferred = $q.defer(),
            exp = $interpolate(URL);

        wayPoints = wayPoints.map(function (wayPoint) {
            return (wayPoint.coordinates.latitude + ',' + wayPoint.coordinates.longitude);
        });

        areasToAvoid = areasToAvoid.map(function (areaToAvoid) {
            var boundingBox = areaToAvoid.boundingBox;
            return (
                boundingBox.topLeft.latitude + ',' + boundingBox.topLeft.longitude + ';' +
                boundingBox.bottomRight.latitude + ',' + boundingBox.bottomRight.longitude
            );
        });

        var url = exp({
            appId: appId,
            appCode: appCode,
            traffic: traffic,
            wayPoints: buildWayPointsQuery(wayPoints),
            avoidAreas : buildAvoidAreasQuery(areasToAvoid),
            areasToAvoid: areasToAvoid,
            alternatives: (wayPoints.length > 2) ? 0 : 1
        });

        $http.get(url).then(function (httpResponse) {

            var routes = getCalculatedRoutes(httpResponse);

            if (routes) {
                //console.log(JSON.stringify(routes[0].shape));
                //console.log(routes[0]);
                deferred.resolve(routes);
            } else {
                deferred.resolve([]);
            }

        }, deferred.reject);

        return deferred.promise;
    };

    var calculateWithTrafficEnabled = function (wayPoints, areasToAvoid) {
        return calculate(wayPoints, areasToAvoid, 'enabled');
    };

    var calculateWithTrafficDisabled = function (wayPoints, areasToAvoid) {
        return calculate(wayPoints, areasToAvoid, 'disabled');
    };

    return {
        calculateWithTrafficEnabled: calculateWithTrafficEnabled,
        calculateWithTrafficDisabled: calculateWithTrafficDisabled
    };

}]);
