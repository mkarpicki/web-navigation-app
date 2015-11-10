angular.module('navigationApp.services').factory('routingService', ['$http', '$q', '$interpolate', 'config', function ($http, $q, $interpolate, config) {

    'use strict';

    var appId = config.APP_ID,
        appCode = config.APP_CODE;

    var URL = "http://route.api.here.com/routing/7.2/calculateroute.json?app_id={{appId}}" +
        "&app_code={{appCode}}" +
        "{{waypoints}}" +
        "&legattributes=sm" +
        "&linkattributes=" +
        "&maneuverattributes=all" +
        "&metricSystem=metric" +
        "&mode=fastest;car;traffic:{{traffic}};" +
        "&routeattributes=none,sh,wp,sm,bb,lg,no,li,tx" +
        "&transportModeType=car";

    var results = [];

    var buildWayPointsQuery = function (waypoints) {

        var query = '',
            waypointQuery = "&waypoint{{i}}=geo!{{waypoint}}",
            exp = $interpolate(waypointQuery);

        for (var i = 0, l = waypoints.length; i < l; i++) {
            query += exp({
                i: i,
                waypoint: waypoints[i]
            });
        }

        return query;
    };

    var getCalculatedRoutes = function (httpResponse) {

        var routes;

        if (httpResponse && httpResponse.status === 200 && httpResponse.data && httpResponse.data.response) {
            routes = httpResponse.data.response.route;
        }

        return routes;
    };

    var calculate = function (waypoints, traffic, avoid) {

        var deferred = $q.defer(),
            exp = $interpolate(URL);

        var calculateFailure = function () {
            return deferred.resolve([]);
        };

        var url = exp({
            appId: appId,
            appCode: appCode,
            traffic: traffic,
            waypoints: buildWayPointsQuery(waypoints)
        });

        $http.get(url).then(function (httpResponse) {

            var routes = getCalculatedRoutes(httpResponse);

            if (routes) {
                deferred.resolve(routes);
            } else {
                deferred.resolve([]);
            }

        }, calculateFailure);

        return deferred.promise;
    };

    var calculateWithTrafficEnabled = function (waypoints, avoid) {
        return calculate(waypoints, 'enabled', avoid);
    };

    var calculateWithTrafficDisabled = function (waypoints, avoid) {
        return calculate(waypoints, 'disabled', avoid);
    };

    var getResults = function () {
        return results;
    };

    var clearResults = function () {
        results = [];
    };

    var saveRoute = function (route) {
        results.push(route);
    };

    return {
        calculateWithTrafficEnabled: calculateWithTrafficEnabled,
        calculateWithTrafficDisabled: calculateWithTrafficDisabled,
        clearResults: clearResults,
        getResults: getResults,
        saveRoute: saveRoute
    };

}]);
