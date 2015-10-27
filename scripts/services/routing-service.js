angular.module('navigationApp.services').factory('routingService', ['$http', '$q', '$interpolate', function ($http, $q, $interpolate) {

    'use strict';

    var appId = '6HRrANORgYjdfDFtrTID',
        appCode = 'D4Mlaon1qumiQ9goQ4k9lQ';

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

        if (httpResponse && httpResponse.status === 200 && httpResponse.data && httpResponse.data.response) {
            return httpResponse.data.response.route;
        }

        return null;
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
