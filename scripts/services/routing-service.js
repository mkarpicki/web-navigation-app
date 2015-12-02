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

    var results = [];

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

        /**
         * @fixme - this format will always take last added are to avoid
         * I need to check how to pass an array to routing service to take
         * few areas into account
         */

        return buildQuery("&avoidareas={{item}}" , areasToAvoid);
    };

    var buildWayPointsQuery = function (wayPoints) {

        return buildQuery("&waypoint{{i}}=geo!{{item}}", wayPoints);

    };

    var getCalculatedRoutes = function (httpResponse) {

        var routes;

        if (httpResponse && httpResponse.status === 200 && httpResponse.data && httpResponse.data.response) {
            routes = httpResponse.data.response.route;
        }

        return routes;
    };

    var calculate = function (waypoints, areasToAvoid, traffic) {

        var deferred = $q.defer(),
            exp = $interpolate(URL);

        var calculateFailure = function () {
            return deferred.resolve([]);
        };

        var url = exp({
            appId: appId,
            appCode: appCode,
            traffic: traffic,
            wayPoints: buildWayPointsQuery(waypoints),
            avoidAreas : buildAvoidAreasQuery(areasToAvoid),
            areasToAvoid: areasToAvoid,
            alternatives: (waypoints.length > 2) ? 0 : 1
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

    var calculateWithTrafficEnabled = function (wayPoints, areasToAvoid) {
        return calculate(wayPoints, areasToAvoid, 'enabled');
    };

    var calculateWithTrafficDisabled = function (wayPoints, areasToAvoid) {
        return calculate(wayPoints, areasToAvoid, 'disabled');
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
