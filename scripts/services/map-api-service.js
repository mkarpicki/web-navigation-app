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

    var drawRoute = function (route, color) {

        var routeShape,
            strip,
            startPoint,
            endPoint;

        // Pick the route's shape:
        routeShape = route.shape;

        // Create a strip to use as a point source for the route line
        strip = new H.geo.Strip();

        // Push all the points in the shape into the strip:
        routeShape.forEach(function(point) {
            var parts = point.split(',');
            strip.pushLatLngAlt(parts[0], parts[1]);
        });

        // Retrieve the mapped positions of the requested waypoints:
        startPoint = route.waypoint[0].mappedPosition;
        endPoint = route.waypoint[1].mappedPosition;

        // Create a polyline to display the route:
        var routeLine = new H.map.Polyline(strip, {
            style: { strokeColor: color, lineWidth: 5 }
        });

        // Create a marker for the start point:
        var startMarker = new H.map.Marker({
            lat: startPoint.latitude,
            lng: startPoint.longitude
        });

        // Create a marker for the end point:
        var endMarker = new H.map.Marker({
            lat: endPoint.latitude,
            lng: endPoint.longitude
        });

        // Add the route polyline and the two markers to the map:
        map.addObjects([routeLine, startMarker, endMarker]);

        // Set the map's viewport to make the whole route visible:
        map.setViewBounds(routeLine.getBounds());

    };

    return {
        init: init,
        center: center,
        drawRoute: drawRoute
    };

}]);