angular.module('navigationApp.services').factory('searchService', ['$http', '$q', '$interpolate', 'config', function ($http, $q, $interpolate, config) {

    'use strict';

    var appId = config.APP_ID,
        appCode = config.APP_CODE;


    var SEARCH_SUGGESTIONS_URL = "https://places.api.here.com/places/v1/suggest",
        SEARCH_URL = "https://places.api.here.com/places/v1/discover/search";

    var URL = "{{url}}?" +
        "app_id={{appId}}" +
        "&app_code={{appCode}}" +
        "&at={{at}}" +
        "&q={{q}}";

    var get = function (apiUrl, q, at, field) {

        if (!at) {
            at = '0,0';
        } else {
            at = at.latitude + ',' + at.longitude;
        }

        var exp = $interpolate(URL),
            canceller = $q.defer(),
            deferred = $q.defer();

        var url = exp({
            appId: appId,
            appCode: appCode,
            url: apiUrl,
            at: at,
            q: q
        });

        var cancel = function () {
            canceller.resolve();
        };

        var findProperty = function(obj, key) {
            return key.split(".").reduce(function(o, x) {
                //return (typeof o == 'undefined' || o === null) ? o : o[x];
                return o[x];
            }, obj);
        };

        $http.get(url, { timeout: canceller.promise }).then(function (httpResponse) {

            deferred.resolve(findProperty(httpResponse.data, field));

        }, deferred.reject);

        return {
            promise: deferred.promise,
            cancel: cancel
        };

    };

    var getSuggestions = function (q, at) {
        return get(SEARCH_SUGGESTIONS_URL, q, at, 'suggestions');
    };

    var getResults = function (q, at) {
        return get(SEARCH_URL, q, at, 'results.items');
    };

    return {
        getSuggestions: getSuggestions,
        getResults: getResults
    };

}]);