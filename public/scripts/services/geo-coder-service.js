angular.module('navigationApp.services').factory('geoCoderService', ['$http', '$q', '$interpolate', 'config', function ($http, $q, $interpolate, config) {

    'use strict';

    var appId = config.APP_ID,
        appCode = config.APP_CODE;


    var REVERSE_GEO_CODER_URL = "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json",
        DEFAULT_RADIUS = 200;

    var URL = "{{url}}?" +
        "app_id={{appId}}" +
        "&app_code={{appCode}}" +
        "&gen=9" +
        "&prox={{prox}},{{radius}}" +
        "&maxresults=1" +
        "&mode=retrieveAddresses";

    var reverse = function (coordinate, radius) {

        var deferred = $q.defer();

        if (!radius) {
            radius = DEFAULT_RADIUS;
        }

        var exp = $interpolate(URL);

        var url = exp({
            appId: appId,
            appCode: appCode,
            url: REVERSE_GEO_CODER_URL,
            prox: coordinate,
            radius: radius
        });

        $http.get(url).then(function (httpResponse) {

            var label = '';

            if (httpResponse.data.Response) {

                var response = httpResponse.data.Response;

                if (response.View &&
                    response.View[0] &&
                    response.View[0].Result &&
                    response.View[0].Result[0] &&
                    response.View[0].Result[0].Location &&
                    response.View[0].Result[0].Location.Address &&
                    response.View[0].Result[0].Location.Address.Label) {

                    label = response.View[0].Result[0].Location.Address.Label;

                }
            }

            deferred.resolve(label);

        }, deferred.reject);

        return deferred.promise;
    };

    return {
        reverse: reverse
    };

}]);