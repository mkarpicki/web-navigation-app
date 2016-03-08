//https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?app_id=6HRrANORgYjdfDFtrTID&app_code=D4Mlaon1qumiQ9goQ4k9lQ&gen=9&prox=52.518252836075156,13.445196986767968,10&mode=retrieveAddresses

angular.module('navigationApp.services').factory('geoCoderService', ['$http', '$q', '$interpolate', 'config', function ($http, $q, $interpolate, config) {

    'use strict';

    var appId = config.APP_ID,
        appCode = config.APP_CODE;


    var REVERSE_GEO_CODER_URL = "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json",
        DEFAULT_RADIUS = 10;

    var URL = "{{url}}?" +
        "app_id={{appId}}" +
        "&app_code={{appCode}}" +
        "&gen=9" +
        "&prox={{prox}},{{radius}}" +
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

            if (httpResponse && httpResponse.status === 200 && httpResponse.data && httpResponse.data.Response) {

                var response = httpResponse.data.Response;

                if (response.View &&
                    response.View[0] &&
                    response.View[0].Result &&
                    response.View[0].Result[0] &&
                    response.View[0].Result[0].Location &&
                    response.View[0].Result[0].Location.Address &&
                    response.View[0].Result[0].Location.Address.Label) {

                    deferred.resolve(response.View[0].Result[0].Location.Address.Label);
                    return;
                }

            }

            deferred.resolve([]);


        }, deferred.resolve);

        return deferred.promise;
    };

    return {
        reverse: reverse
    };

}]);