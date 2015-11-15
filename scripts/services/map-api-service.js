angular.module('navigationApp.services').factory('mapApiService', ['$window', 'config', function ($window, config) {

    'use strict';

    var appId = config.APP_ID,
        appCode = config.APP_CODE;

    var H = $window.H,
        map,
        ui,
        bubble,
        tappedCoordinates;


    //Step 1: initialize communication with the platform
    var platform = new H.service.Platform({
        app_id: appId,
        app_code: appCode,
        useHTTPS: true
    });

    var defaultLayers = platform.createDefaultLayers();

    var getTapPosition = function () {
        return tappedCoordinates;
    };

    var init = function (element, bubbleElement) {

        //Step 2: initialize a map  - not specificing a location will give a whole world view.
        map = new H.Map(element[0], defaultLayers.normal.map);

        //Step 3: make the map interactive
        // MapEvents enables the event system
        // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
        new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

        // Create the default UI components
        ui = H.ui.UI.createDefault(map, defaultLayers);

        map.addEventListener('tap', function (evt) {

            removeBubble();

            tappedCoordinates = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);

            bubble =  new H.ui.InfoBubble(tappedCoordinates, {
                content: bubbleElement
            });

            // show info bubble
            ui.addBubble(bubble);
        });

    };

    var center = function (position) {

        map.setCenter({
            lat: position.latitude,
            lng: position.longitude
        });
        map.setZoom(14);
    };

    var removeBubble = function () {
        if (bubble) {
            ui.removeBubble(bubble);
        }
    };

    var clear = function () {
        map.removeObjects(map.getObjects());
        removeBubble();
    };

    var drawRoute = function (route, waypoints, color) {

        var routeShape,
            strip,
            markers = [],
            waypoint;

        // Pick the route's shape:
        routeShape = route.shape;

        // Create a strip to use as a point source for the route line
        strip = new H.geo.Strip();

        // Push all the points in the shape into the strip:
        routeShape.forEach(function(point) {
            var parts = point.split(',');
            strip.pushLatLngAlt(parts[0], parts[1]);
        });

        // Create a polyline to display the route:
        var routeLine = new H.map.Polyline(strip, {
            style: { strokeColor: color, lineWidth: 5 }
        });

        for (var i = 0, l = waypoints.length; i < l; i++) {

            waypoint = waypoints[i];

            markers.push(new H.map.Marker({
                lat: waypoint.latitude,
                lng: waypoint.longitude
            }));
        }

        // Add the route polyline and the two markers to the map:
        //map.addObjects([routeLine, startMarker, endMarker]);
        map.addObjects([routeLine]);
        map.addObjects(markers);


        // Set the map's viewport to make the whole route visible:
        map.setViewBounds(routeLine.getBounds());

    };

    return {
        init: init,
        center: center,
        drawRoute: drawRoute,
        clear: clear,
        getTapPosition: getTapPosition
    };

}]);