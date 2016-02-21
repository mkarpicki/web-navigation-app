angular.module('navigationApp.services').factory('searchService', ['$http', '$q', '$interpolate', 'config', function ($http, $q, $interpolate, config) {

    'use strict';

    var appId = config.APP_ID,
        appCode = config.APP_CODE;


    var SEARCH_SUGGESTIONS_URL = "https://places.demo.api.here.com/places/v1/suggest",
        SEARCH_URL = "https://places.api.here.com/places/v1/discover/search";

    var URL = "{{url}}?" +
        "app_id={{appId}}" +
        "&app_code={{appCode}}" +
        "&at={{at}}" +
        "&q={{q}}";

    //var get = function (apiUrl, q, at) {
    //
    //    if (!at) {
    //        at = '0,0';
    //    }
    //
    //    var exp = $interpolate(URL);
    //
    //    var url = exp({
    //        appId: appId,
    //        appCode: appCode,
    //        url: apiUrl,
    //        at: at,
    //        q: q
    //    });
    //
    //    return $http.get(url);
    //
    //};

    var get = function (apiUrl, q, at) {

        if (!at) {
            at = '0,0';
        }

        var exp = $interpolate(URL),
            canceller = $q.defer();

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

        return {
            promise: $http.get(url, { timeout: canceller.promise}),
            cancel: cancel
        };

    };

    var getSuggestions = function (q, at) {
        return get(SEARCH_SUGGESTIONS_URL, q, at);
    };

    var getResults = function (q, at) {
        return get(SEARCH_URL, q, at);
    };

    return {
        getSuggestions: getSuggestions,
        getResults: getResults
    };

}]);