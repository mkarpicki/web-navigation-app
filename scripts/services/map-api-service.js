angular.module('navigationApp.services').factory('mapApiService', ['$window', function ($window) {

    'use strict';

    var appId = "6HRrANORgYjdfDFtrTID",
        appCode = "D4Mlaon1qumiQ9goQ4k9lQ";

    var H = $window.H,
        map;


    //Step 1: initialize communication with the platform
    var platform = new H.service.Platform({
        app_id: appId,
        app_code: appCode,
        useHTTPS: true
    });

    var defaultLayers = platform.createDefaultLayers();

    var init = function (element) {

        //Step 2: initialize a map  - not specificing a location will give a whole world view.
        map = new H.Map(element[0], defaultLayers.normal.map);

        //Step 3: make the map interactive
        // MapEvents enables the event system
        // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
        var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

        // Create the default UI components
        var ui = H.ui.UI.createDefault(map, defaultLayers);

    };

    var center = function (position) {
        map.setCenter({
            lat: position.latitude,
            lng: position.longitude
        });
        map.setZoom(14);
    };

    return {
        init: init,
        center: center
    };

}]);