angular.module('navigationApp.services').factory('geoLocationService', ['$window', '$rootScope',  'events', function ($window, $rootScope, events) {

    'use strict';

    var watchPosition = function () {

        initGeoLocation($window.navigator.geolocation);

    };

    var onGeoLocationSuccess = function (position) {

        $rootScope.$broadcast(events.POSITION_EVENT, {
            eventType: events.POSITION_EVENT_TYPES.CHANGE,
            param: position
        });

    };

    var onGeoLocationError = function (error) {

        $rootScope.$broadcast(events.POSITION_EVENT, {
            eventType: events.POSITION_EVENT_TYPES.ERROR,
            param: error
        });

    };

    var initGeoLocation = function (geoLocationObject) {

        if (geoLocationObject) {
            geoLocationObject.getCurrentPosition(function (position) {

                onGeoLocationSuccess(position);

                geoLocationObject.watchPosition(onGeoLocationSuccess);

            }, onGeoLocationError);
        } else {
            onGeoLocationError({});
        }
    };

    return {
        watchPosition: watchPosition
    };
}]);