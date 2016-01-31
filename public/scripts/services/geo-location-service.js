angular.module('navigationApp.services').factory('geoLocationService', ['$window', '$rootScope',  'events', function ($window, $rootScope, events) {

    'use strict';

    var watchPosition = function () {

        initGeoLocation($window.navigator.geolocation);

    };

    var onGeoLocationSuccess = function (position) {

        //console.log('onGeoLocationSuccess', position);
        $rootScope.$broadcast(events.POSITION_EVENT, {
            eventType: events.POSITION_EVENT_TYPES.CHANGE,
            param: position
        });
        //$scope.$apply();
    };

    var onGeoLocationError = function (error) {

        //console.log('onGeoLocationError', error);
        $rootScope.$broadcast(events.POSITION_EVENT, {
            eventType: events.POSITION_EVENT_TYPES.ERROR,
            param: error
        });
        //$scope.$apply();
    };

    var initGeoLocation = function (geoLocationObject) {

        if (geoLocationObject) {
            geoLocationObject.getCurrentPosition(function (position) {

                onGeoLocationSuccess(position);

                geoLocationObject.watchPosition(onGeoLocationSuccess);

            }, onGeoLocationError);
        }
    };

    return {
        watchPosition: watchPosition
    };
}]);