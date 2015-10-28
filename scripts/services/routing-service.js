angular.module('navigationApp.services').factory('routingService', ['$http', '$q', '$interpolate', 'config', function ($http, $q, $interpolate, config) {

    'use strict';

    var appId = config.APP_ID,
        appCode = config.APP_CODE;

    var URL = "http://route.api.here.com/routing/7.2/calculateroute.json?app_id={{appId}}" +
        "&app_code={{appCode}}" +
        "&waypoint0=geo!{{from}}" +
        "&waypoint1=geo!{{to}}" +
        "&legattributes=sm" +
        "&linkattributes=" +
        "&maneuverattributes=all" +
        "&metricSystem=metric" +
        "&mode=fastest;car;traffic:{{traffic}};" +
        "&routeattributes=none,sh,wp,sm,bb,lg,no,li,tx" +
        "&transportModeType=car";

    var getCalculatedRoutes = function (httpResponse) {

        var routes;

        if (httpResponse && httpResponse.status === 200 && httpResponse.data && httpResponse.data.response) {
            routes = httpResponse.data.response.route;
        }

        return routes;
    };

    var calculate = function (from, to, traffic, waypoints, avoid) {

        var deferred = $q.defer(),
            exp = $interpolate(URL);

        var url = exp({
            appId: appId,
            appCode: appCode,
            from: from,
            to: to,
            traffic: traffic
        });

        $http.get(url).then(function (httpResponse) {

            var routes = getCalculatedRoutes(httpResponse);

            if (routes) {
                deferred.resolve(routes);
            } else {
                deferred.resolve([]);
            }

        }, deferred.reject);

        return deferred.promise;
    };

    var calculateWithTrafficEnabled = function (from, to, waypoints, avoid) {
        return calculate(from, to, 'enabled', waypoints, avoid);
    };

    var calculateWithTrafficDisabled = function (from, to, waypoints, avoid) {
        return calculate(from, to, 'disabled', waypoints, avoid);
    };

    return {
        calculateWithTrafficEnabled: calculateWithTrafficEnabled,
        calculateWithTrafficDisabled: calculateWithTrafficDisabled
    };

}]);
