/**
 * @readme (road closed sign)
 * use svg as marker:
 * https://developer.here.com/api-explorer/maps-js/markers/map-with-svg-graphic-markers
 * https://developer.mozilla.org/en/docs/Web/SVG/Tutorial/Paths
 *
 * map circle object
 * https://developer.here.com/javascript-apis/documentation/v3/maps/topics_api_nlp/h-map-circle.html
 */
angular.module('navigationApp.services').factory('mapApiService', ['$window', 'config', function ($window, config) {

    'use strict';

    var appId = config.APP_ID,
        appCode = config.APP_CODE,
        avoidAreaInMeters = config.AVOID_AREA_IN_METERS;

    var H = $window.H,
        map,
        ui,
        bubble,
        tappedCoordinates,
        currentPositionMarker;

    var areaToAvoidStyle = {
        //fillColor: '#FFFFCC',
        strokeColor: '#e2e2e2',
        lineWidth: 8
    };


    //Step 1: initialize communication with the platform
    var platform = new H.service.Platform({
        app_id: appId,
        app_code: appCode,
        useHTTPS: true
    });

    var defaultLayers = platform.createDefaultLayers();

    var getTapPosition = function () {

        return {
            latitude: tappedCoordinates.lat,
            longitude: tappedCoordinates.lng
        };
    };

    var calculateRectangle = function (position, distance) {

        var point = new H.geo.Point(position.latitude, position.longitude);

        distance = distance || avoidAreaInMeters;

        var rect = H.geo.Rect.fromPoints(
            point.walk(315, distance),
            point.walk(135, distance)
        );

        var topLeft = rect.getTopLeft(),
            bottomRight = rect.getBottomRight();

        topLeft = {
            latitude: topLeft.lat,
            longitude: topLeft.lng
        };

        bottomRight = {
            latitude: bottomRight.lat,
            longitude: bottomRight.lng
        };

        return {
            topLeft: topLeft,
            bottomRight: bottomRight
        };
    };

    var init = function (element) {

        //Step 2: initialize a map  - not specifying a location will give a whole world view.
        map = new H.Map(element[0], defaultLayers.normal.map);

        //Step 3: make the map interactive
        // MapEvents enables the event system
        // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
        new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

        // Create the default UI components
        ui = H.ui.UI.createDefault(map, defaultLayers);

        // Create maker for displaying current position
        //var icon = new H.map.Icon('images/current-position.png');
        //
        //currentPositionMarker = new H.map.Marker({ lat: 52.4928606, lng: 13.4600705 }, { icon: icon });

        currentPositionMarker = new H.map.Circle({lat: 52.51, lng: 13.4}, 20);

        map.addObject(currentPositionMarker);

    };

    var initBubble = function (bubbleElement) {

        //map.addEventListener('tap', function (evt) {
        map.addEventListener('longpress', function (evt) {

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

    };

    var removeBubble = function () {
        if (bubble) {
            ui.removeBubble(bubble);
        }
    };

    var clear = function () {

        var objects = map.getObjects();

        objects = objects.filter(function (o) {
           return o !== currentPositionMarker;
        });

        map.removeObjects(objects);
        removeBubble();
    };

    var updateCurrentPosition = function (position) {

        currentPositionMarker.setVisibility(true);
        currentPositionMarker.setCenter({
            lat: position.latitude,
            lng: position.longitude
        });

    };

    var centerToRoute = function (route) {
        var routeLine = getRouteLine(route, null);
        // Set the map's view port to make the whole route visible:
        map.setViewBounds(routeLine.getBounds());
    };

    var getRouteLine = function (route) {

        var routeShape,
            strip,
            color =  route.color || 'blue';


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

        return routeLine;

    };

    var drawAreasToAvoid = function (areasToAvoid) {

        var topLeft,
            bottomRight,
            point1,
            point2,
            rectangle;

        if (areasToAvoid) {

            for (var i = 0, len = areasToAvoid.length; i < len; i++) {

                topLeft = areasToAvoid[i].boundingBox.topLeft;
                bottomRight = areasToAvoid[i].boundingBox.bottomRight;

                point1 = new H.geo.Point(topLeft.latitude, topLeft.longitude);
                point2 = new H.geo.Point(bottomRight.latitude, bottomRight.longitude);

                rectangle = H.geo.Rect.fromPoints(point1, point2);

                map.addObject(
                    new H.map.Rect(rectangle, {
                        style: areaToAvoidStyle
                    })
                );
            }
        }
    };

    var drawWayPoints = function (wayPoints) {

        var markers = [],
            wayPoint;

        if (wayPoints) {

            for (var i = 0, l = wayPoints.length; i < l; i++) {

                wayPoint = wayPoints[i].coordinates;

                markers.push(new H.map.Marker({
                    lat: wayPoint.latitude,
                    lng: wayPoint.longitude
                }));
            }

            map.addObjects(markers);

        }

    };

    var drawRoutes = function (routes) {

        if (routes) {

            for (var i = 0, l = routes.length; i < l; i++) {
                drawRoute(routes[i]);
            }
        }
    };

    var drawRoute = function (route) {

        // Create a polyline to display the route:
        var routeLine = getRouteLine(route);

        // Add the route polyline and the two markers to the map:
        map.addObjects([routeLine]);

    };

    var setZoomLevel = function (level) {
        map.setZoom(level);
    };

    var distance = function (positionFrom, positionTo) {

        var pointFrom = new H.geo.Point(positionFrom.latitude, positionFrom.longitude);
        var pointTo = new H.geo.Point(positionTo.latitude, positionTo.longitude);

        return pointFrom.distance(pointTo);
    };

    return {
        init: init,
        initBubble: initBubble,
        center: center,
        calculateRectangle: calculateRectangle,
        drawRoutes: drawRoutes,
        drawWayPoints: drawWayPoints,
        drawAreasToAvoid: drawAreasToAvoid,
        clear: clear,
        getTapPosition: getTapPosition,
        removeBubble: removeBubble,
        updateCurrentPosition: updateCurrentPosition,
        setZoomLevel: setZoomLevel,
        distance: distance,
        centerToRoute: centerToRoute
    };

}]);