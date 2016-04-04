describe('map-api-service', function () {

    'use strict';

    var H,
        $window,
        config,

        fakeDefaultLayers,
        fakePoint,
        fakeMap,
        fakeUI,
        fakeCircle,
        fakeDefaultUI,
        fakeBubble,
        fakeRect,
        fakeGeoRect,
        fakeStrip,
        fakeRouteLine;

    beforeEach(module('navigationApp.services'));

    beforeEach(module(function ($provide) {

        var topLeft = {
            lat: 'tlLat',
            lng: 'tlLng'
        };

        var bottomRight = {
            lat: 'brLat',
            lng: 'brLng'
        };

        fakeGeoRect = {
            getTopLeft: function () { return topLeft; },
            getBottomRight: function () { return bottomRight; }
        };

        fakeDefaultLayers = {
            normal: {
                map: {}
            }
        };

        fakeRect = {
            'rect': true
        };

        fakeMap = {
            addObject: function () {},
            addObjects: function () {},
            getObjects: function () { return []; },
            removeObjects: function () {},
            addEventListener: function () {},
            screenToGeo: function () {},
            setCenter: function () {},
            setZoom: function () {},
            setViewBounds: function () {}
        };

        fakeRouteLine = {
            getBounds: function () {}
        };

        var fakePlatform = {
            createDefaultLayers: function () { return fakeDefaultLayers; }
        };

        fakePoint = {
            walk: function () {}
        };

        H = {};
        H.service = {
            Platform: function () { return fakePlatform; }
        };

        H.Map = jasmine.createSpy().and.returnValue(fakeMap);

        H.mapevents = {
            MapEvents: function () {},
            Behavior: function () {}
        };

        fakeStrip = {
            pushLatLngAlt: function () {}
        };

        fakeCircle = {
            setCenter: function () {},
            setVisibility: function () {}
        };

        H.geo = {};

        H.geo.Strip = function () {};

        H.geo.Point = function () {
            return fakePoint;
        };
        H.geo.Rect = {
            fromPoints: function () {
                return fakeGeoRect;
            }
        };

        H.map = {};
        H.map.Rect =  function () {
            return fakeRect;
        };
        H.map.Polyline = function () {
            return fakeRouteLine;
        };

        H.map.Marker = function () {};

        H.map.Circle = function () {
            return fakeCircle;
        };

        fakeDefaultUI = {
            addBubble: function () {},
            removeBubble: function () {}
        };

        fakeUI = {
            createDefault: function () {
                return fakeDefaultUI;
            }
        };

        fakeBubble = {'bubble' : 'yes'};

        H.ui = {
            UI: fakeUI,
            InfoBubble: function () {
                return fakeBubble;
            }
        };


        $window = {};
        $window.H = H;

        $provide.value('$window', $window);

        config = {};
        config.APP_ID = 'someAppId';
        config.APP_CODE = 'someAppCode';
        config.AVOID_AREA_IN_METERS ='AVOID_IN_SOME_METERS';

        $provide.value('config', config);

    }));


    describe("init", function () {

        it('should initialize a map', inject(function (mapApiService) {

            var e = {},
                someElement = [e];

            mapApiService.init(someElement);

            expect($window.H.Map).toHaveBeenCalledWith(e, fakeDefaultLayers.normal.map);

        }));

        it('should create map events', inject(function (mapApiService) {

            var fakeMapEvents = {};

            H.mapevents.Behavior = jasmine.createSpy();
            H.mapevents.MapEvents = jasmine.createSpy().and.returnValue(fakeMapEvents);

            mapApiService.init([]);

            expect(H.mapevents.Behavior).toHaveBeenCalledWith(fakeMapEvents);

        }));

        it('should create default UI component', inject(function (mapApiService) {

            H.Map = jasmine.createSpy().and.returnValue(fakeMap);
            H.ui.UI.createDefault = jasmine.createSpy();

            mapApiService.init([]);

            expect(H.ui.UI.createDefault).toHaveBeenCalledWith(fakeMap, fakeDefaultLayers);

        }));

        it('should create currentPositionMarker', inject(function (mapApiService) {

            H.Map = jasmine.createSpy().and.returnValue(fakeMap);
            H.map.Circle = jasmine.createSpy();

            mapApiService.init([]);

            expect(H.map.Circle).toHaveBeenCalled();

        }));
    });

    describe('updateCurrentPosition', function () {

        it ('should update position of currentPositionMarker', inject(function (mapApiService) {

            var somePosition = {
                latitude: 1,
                longitude: 2
            };

            fakeCircle.setCenter = jasmine.createSpy();

            mapApiService.init([]);

            mapApiService.updateCurrentPosition(somePosition);

            expect(fakeCircle.setCenter).toHaveBeenCalledWith({
                lat: somePosition.latitude,
                lng: somePosition.longitude
            });

        }));

        it ('should make currentPositionMarker visible', inject(function(mapApiService) {

            var somePosition = {};

            fakeCircle.setVisibility = jasmine.createSpy();

            mapApiService.init([]);

            mapApiService.updateCurrentPosition(somePosition);

            expect(fakeCircle.setVisibility).toHaveBeenCalledWith(true);

        }));

    });

    describe('initBubble', function () {

        it ('should add events to map', inject(function (mapApiService) {

            var someBubbleElement = {};

            fakeMap.addEventListener = jasmine.createSpy();
            H.Map = jasmine.createSpy().and.returnValue(fakeMap);

            mapApiService.init([]);
            mapApiService.initBubble(someBubbleElement);

            expect(fakeMap.addEventListener).toHaveBeenCalledWith('longpress', jasmine.any(Function));

        }));

        describe ('when assigned event called', function () {

            var fakeGeo = 'geo',
                bubbleElement = 'bubbleElement',
                fakeMap = {
                    screenToGeo: jasmine.createSpy().and.returnValue(fakeGeo),
                    addObject: function () {}
                },
                fakeEvent = {
                    currentPointer: {
                        viewportX: 'x',
                        viewportY: 'y'
                    }
                };

            beforeEach(function () {

                fakeMap.addEventListener = function (eventName, callback) {
                    callback(fakeEvent);
                };

            });

            describe('when bubble added previously', function () {

                it ('should remove previous bubble', inject(function(mapApiService) {

                    fakeDefaultUI.addBubble = jasmine.createSpy();
                    fakeDefaultUI.removeBubble = jasmine.createSpy();

                    H.Map = function () {
                        return fakeMap;
                    };

                    H.ui.InfoBubble = jasmine.createSpy().and.returnValue(fakeBubble);

                    mapApiService.init([]);
                    mapApiService.initBubble(bubbleElement);
                    mapApiService.initBubble(bubbleElement);

                    expect(fakeMap.screenToGeo).toHaveBeenCalledWith(fakeEvent.currentPointer.viewportX, fakeEvent.currentPointer.viewportY);
                    expect(H.ui.InfoBubble).toHaveBeenCalledWith(fakeGeo, { content: bubbleElement });
                    expect(fakeDefaultUI.removeBubble).toHaveBeenCalledWith(fakeBubble);
                    expect(fakeDefaultUI.addBubble).toHaveBeenCalledWith(fakeBubble);

                }));

            });

            it ('should add new one to UI', inject(function (mapApiService) {

                fakeDefaultUI.addBubble = jasmine.createSpy();
                fakeDefaultUI.removeBubble = jasmine.createSpy();

                H.Map = function () {
                    return fakeMap;
                };

                H.ui.InfoBubble = jasmine.createSpy().and.returnValue(fakeBubble);

                mapApiService.init([]);
                mapApiService.initBubble(bubbleElement);

                expect(fakeMap.screenToGeo).toHaveBeenCalledWith(fakeEvent.currentPointer.viewportX, fakeEvent.currentPointer.viewportY);
                expect(H.ui.InfoBubble).toHaveBeenCalledWith(fakeGeo, { content: bubbleElement });
                expect(fakeDefaultUI.addBubble).toHaveBeenCalledWith(fakeBubble);


            }));


        });

    });

    describe('center', function () {

        it ('should call map.center', inject(function (mapApiService) {

            var position = { latitude: 'lat', longitude: 'lng'};

            fakeMap.setCenter = jasmine.createSpy();
            fakeMap.setZoom = jasmine.createSpy();

            H.Map = function () {
                return fakeMap;
            };

            mapApiService.init([]);

            mapApiService.center(position);

            expect(fakeMap.setCenter).toHaveBeenCalledWith({
                lat: position.latitude,
                lng: position.longitude
            });

        }));

    });

    describe('setZoomLevel', function () {

        it('should call setZoom of map js library', inject(function(mapApiService) {

            var level = 666;

            fakeMap.setZoom = jasmine.createSpy('H.Map.setZoom');

            mapApiService.init([]);
            mapApiService.setZoomLevel(level);

            expect(fakeMap.setZoom).toHaveBeenCalledWith(level);

        }));

    });

    describe('calculateRectangle', function () {

        var position = { latitude: 'lat', longitude: 'lng'},
            distance = 'distance';

        it ('should create point', inject(function (mapApiService) {

            H.geo.Point = jasmine.createSpy('H.geo.Point').and.returnValue(fakePoint);

            mapApiService.init([]);
            mapApiService.calculateRectangle(position, distance);

            expect(H.geo.Point).toHaveBeenCalledWith(position.latitude, position.longitude);

        }));

        describe ('and distance not passed', function () {

            it ('should create rectangle around point using default distance', inject(function (mapApiService) {

                H.geo.Point = jasmine.createSpy('H.geo.Point').and.returnValue(fakePoint);
                H.geo.Rect.fromPoints = jasmine.createSpy().and.returnValue(fakeGeoRect);

                mapApiService.init([]);
                mapApiService.calculateRectangle(position, null);

                expect(H.geo.Rect.fromPoints).toHaveBeenCalledWith(
                    fakePoint.walk(315, config.AVOID_AREA_IN_METERS),
                    fakePoint.walk(135, config.AVOID_AREA_IN_METERS)
                );

            }));

        });

        describe ('and distance passed', function () {

            it ('should create rectangle around point using passed distance', inject(function (mapApiService) {

                var distance = 666;

                H.geo.Point = jasmine.createSpy('H.geo.Point').and.returnValue(fakePoint);
                H.geo.Rect.fromPoints = jasmine.createSpy().and.returnValue(fakeGeoRect);

                mapApiService.init([]);
                mapApiService.calculateRectangle(position, distance);

                expect(H.geo.Rect.fromPoints).toHaveBeenCalledWith(
                    fakePoint.walk(315, distance),
                    fakePoint.walk(135, distance)
                );

            }));

        });

        //it ('should add rectangle to map', inject(function (mapApiService) {
        //
        //    H.geo.Rect.fromPoints = jasmine.createSpy().and.returnValue(fakeGeoRect);
        //
        //    H.map.Rect = function (r, options) {
        //
        //        if (r !== fakeGeoRect) {
        //            throw 'NOT proper geo.Rect';
        //        }
        //
        //        if (options.style.fillColor !== '#FFFFCC') {
        //            throw 'WRONG fillColor STYLE';
        //        }
        //
        //        if (options.style.strokeColor !== '#e2e2e2') {
        //            throw 'WRONG strokeColor STYLE';
        //        }
        //
        //        if (options.style.lineWidth !== 8) {
        //            throw 'WRONG lineWidth STYLE';
        //        }
        //
        //        return fakeRect;
        //    };
        //
        //    fakeMap.addObject = jasmine.createSpy('addObject');
        //
        //    mapApiService.init([]);
        //    mapApiService.calculateRectangle(position, distance);
        //
        //    expect(fakeMap.addObject).toHaveBeenCalledWith(fakeRect);
        //
        //}));

        it ('should return rectangle bounding box', inject(function (mapApiService) {

            mapApiService.init([]);
            var r = mapApiService.calculateRectangle(position, distance);

            expect(r.topLeft.latitude).toEqual(fakeGeoRect.getTopLeft().lat);
            expect(r.topLeft.longitude).toEqual(fakeGeoRect.getTopLeft().lng);
            expect(r.bottomRight.latitude).toEqual(fakeGeoRect.getBottomRight().lat);
            expect(r.bottomRight.longitude).toEqual(fakeGeoRect.getBottomRight().lng);

        }));

    });

    describe('drawAreasToAvoid', function () {

        describe('when areas not delivered', function () {

            it('should not add any rectangle to map', inject(function(mapApiService) {

            }));

        });

        describe('when areas delivered', function () {

            it('should add any rectangle to map', inject(function(mapApiService) {

                var fakeArea = {
                    boundingBox: {
                        topLeft: {
                            latitude: 1,
                            longitude: 2
                        },
                        bottomRight: {
                            latitude: 3,
                            longitude: 4
                        }
                    }
                };

                var fakeRect = {};
                var fakePoint = {};
                var fakeRectangleObj = {};

                H.geo.Point = jasmine.createSpy('H.geo.Point').and.returnValue(fakePoint);

                H.geo.Rect.fromPoints = jasmine.createSpy('H.geo.Rect.fromPoints').and.returnValue(fakeRect);

                H.map.Rect = jasmine.createSpy('H.map.Rect').and.returnValue(fakeRectangleObj);

                fakeMap.addObject = jasmine.createSpy('fakeMap.addObject');

                mapApiService.init([]);
                mapApiService.drawAreasToAvoid([fakeArea]);

                expect(H.geo.Point).toHaveBeenCalledWith(fakeArea.boundingBox.topLeft.latitude, fakeArea.boundingBox.topLeft.longitude);
                expect(H.geo.Point).toHaveBeenCalledWith(fakeArea.boundingBox.bottomRight.latitude, fakeArea.boundingBox.bottomRight.longitude);

                expect(H.geo.Rect.fromPoints).toHaveBeenCalledWith(fakePoint, fakePoint);

                expect(H.map.Rect).toHaveBeenCalledWith(fakeRect,{
                    style: {
                        strokeColor: '#e2e2e2',
                        lineWidth: 8
                    }
                });

                expect(fakeMap.addObject).toHaveBeenCalledWith(fakeRectangleObj);
            }));

        });

    });

    describe('drawWayPoints', function () {

        describe('when wayPoints not delivered', function () {

            it('should NOT draw markers on map', inject(function(mapApiService) {

                H.map.Marker = jasmine.createSpy('H.map.Marker');

                fakeMap.addObjects = jasmine.createSpy('fakeMap.addObjects');

                mapApiService.init([]);
                mapApiService.drawWayPoints([]);

                expect(H.map.Marker).not.toHaveBeenCalled();

                expect(fakeMap.addObjects).not.toHaveBeenCalledWith();

                mapApiService.drawWayPoints(null);

                expect(H.map.Marker).not.toHaveBeenCalled();

                expect(fakeMap.addObjects).not.toHaveBeenCalledWith();

            }));

        });

        describe('when wayPoints delivered', function () {

            it('should draw markers on map', inject(function(mapApiService) {

                var wayPoint = {
                    coordinates: {
                        latitude: 1,
                        longitude: 2
                    }
                };

                var fakeMarker = {};

                H.map.Marker = jasmine.createSpy('H.map.Marker').and.returnValue(fakeMarker);

                fakeMap.addObjects = jasmine.createSpy('fakeMap.addObjects');

                mapApiService.init([]);
                mapApiService.drawWayPoints([wayPoint]);

                expect(H.map.Marker).toHaveBeenCalledWith({
                    lat: wayPoint.coordinates.latitude,
                    lng: wayPoint.coordinates.longitude
                });

                expect(fakeMap.addObjects).toHaveBeenCalledWith([fakeMarker]);

            }));

        });

    });

    describe('drawRoutes', function () {

        var route,
            waypoints,
            color;

        beforeEach(function () {

            color = 'blue';

            route = {
                shape: ['1,2', '3,4'],
                color: color
            };
            waypoints = [{
                latitude: 1,
                longitude: 2
            }, {
                latitude: 3,
                longitude: 4
            }];

        });

        it ('should create strip and push each lat and long', inject(function (mapApiService) {

            fakeStrip.pushLatLngAlt = jasmine.createSpy('pushLatLngAlt');

            H.geo.Strip = jasmine.createSpy('H.geo.Strip').and.returnValue(fakeStrip);

            mapApiService.init([]);
            mapApiService.drawRoutes([route]);

            expect(H.geo.Strip).toHaveBeenCalled();

        }));

        it ('should add routes line to map', inject(function(mapApiService) {

            fakeRouteLine.getBounds = jasmine.createSpy('getBounds');

            fakeMap.addObjects = jasmine.createSpy('fakeMap.addObjects');

            H.map.Polyline = jasmine.createSpy('new H.map.Polyline').and.returnValue(fakeRouteLine);

            H.geo.Strip = function () {
                return fakeStrip;
            };

            mapApiService.init([]);
            mapApiService.drawRoutes([route]);

            expect(H.map.Polyline).toHaveBeenCalledWith(fakeStrip, {
                style: { strokeColor: color, lineWidth: 5 }
            });

            expect(fakeMap.addObjects).toHaveBeenCalledWith([fakeRouteLine]);

        }));

        describe('when routes not passed', function () {

            it ('should NOT add routes line to map', inject(function(mapApiService) {

                fakeRouteLine.getBounds = jasmine.createSpy('getBounds');

                fakeMap.addObjects = jasmine.createSpy('fakeMap.addObjects');

                H.map.Polyline = jasmine.createSpy('new H.map.Polyline').and.returnValue(fakeRouteLine);

                H.geo.Strip = function () {
                    return fakeStrip;
                };

                mapApiService.init([]);
                mapApiService.drawRoutes([]);

                expect(H.map.Polyline).not.toHaveBeenCalled();

                expect(fakeMap.addObjects).not.toHaveBeenCalledWith();

                mapApiService.drawRoutes(null);

                expect(H.map.Polyline).not.toHaveBeenCalled();

                expect(fakeMap.addObjects).not.toHaveBeenCalledWith();

            }));

        });

        describe('when route does not have color specified', function (){

            it ('should add routes line to map with predefined blue color', inject(function(mapApiService) {

                fakeRouteLine.getBounds = jasmine.createSpy('getBounds');

                H.map.Polyline = jasmine.createSpy('new H.map.Polyline').and.returnValue(fakeRouteLine);

                H.geo.Strip = function () {
                    return fakeStrip;
                };

                route.color = null;

                mapApiService.init([]);
                mapApiService.drawRoutes([route]);

                expect(H.map.Polyline).toHaveBeenCalledWith(fakeStrip, {
                    style: { strokeColor: 'blue', lineWidth: 5 }
                });

            }));
        });

    });


    describe('centerToRoute', function () {

        it('should create routeLine and call API setViewBounds with getBounds of route line', inject(function (mapApiService) {

            var bounds = {};


            var fakePolyline = {
                getBounds: jasmine.createSpy('getBounds').and.returnValue(bounds)
            };

            H.map.Polyline = function () {
                return fakePolyline;
            };

            fakeMap.setViewBounds = jasmine.createSpy('fakeMap.setViewBounds');

            var fakeRoute = {
                shape: []
            };

            mapApiService.init([]);
            mapApiService.centerToRoute(fakeRoute);

            expect(fakePolyline.getBounds).toHaveBeenCalled();
            expect(fakeMap.setViewBounds).toHaveBeenCalledWith(bounds);

        }));

    });

    describe('clear', function () {

        it ('should remove objects from map', inject(function (mapApiService) {

            var someObject = [];

            fakeMap.getObjects = jasmine.createSpy('fakeMap.getObjects').and.returnValue(someObject);
            fakeMap.removeObjects = jasmine.createSpy('fakeMap.removeObjects');

            mapApiService.init([]);
            mapApiService.clear();

            expect(fakeMap.getObjects).toHaveBeenCalled();
            expect(fakeMap.removeObjects).toHaveBeenCalledWith(fakeMap.getObjects());

            describe('and currentPosition marker exists', function () {

                it ('should remove objects from map Except currentPosition marker', inject(function (mapApiService) {

                    var currentPositionMarker = {};

                    var someObject = [1,2, currentPositionMarker];

                    H.map.Circle = function () {
                       return currentPositionMarker;
                    };

                    fakeMap.getObjects = jasmine.createSpy('fakeMap.getObjects').and.returnValue(someObject);
                    fakeMap.removeObjects = jasmine.createSpy('fakeMap.removeObjects');

                    mapApiService.init([]);
                    mapApiService.clear();

                    expect(fakeMap.getObjects).toHaveBeenCalled();
                    expect(fakeMap.removeObjects).toHaveBeenCalledWith([1,2]);

                }));

            });

        }));

        describe('when bubble was on map', function () {

            it ('should remove bubble', inject(function (mapApiService) {

                //init bubble register listener that must be called to add bubble
                fakeMap.addEventListener = function (event, callback) {
                    callback({ currentPointer: {}});
                };

                //init bubble will create bubble
                H.ui.InfoBubble = function () {

                    return fakeBubble;
                };

                fakeDefaultUI.removeBubble = jasmine.createSpy('fakeUI.removeBubble');

                mapApiService.init([]);
                mapApiService.initBubble([]);
                mapApiService.clear();

                expect(fakeDefaultUI.removeBubble).toHaveBeenCalledWith(fakeBubble);

            }));

        });

    });

    describe('removeBubble', function () {

        it ('should remove bubble', inject(function (mapApiService) {

            //init bubble register listener that must be called to add bubble
            fakeMap.addEventListener = function (event, callback) {
                callback({ currentPointer: {}});
            };

            //init bubble will create bubble
            H.ui.InfoBubble = function () {

                return fakeBubble;
            };

            fakeDefaultUI.removeBubble = jasmine.createSpy('fakeUI.removeBubble');

            mapApiService.init([]);
            mapApiService.initBubble([]);
            mapApiService.removeBubble();

            expect(fakeDefaultUI.removeBubble).toHaveBeenCalledWith(fakeBubble);

        }));

    });

    describe('distance', function () {

        it('should use create H.geo.Point objects from coordinates and use API to calculate distance', inject(function(mapApiService) {

            var from = { latitude: 'fromLat', longitude: 'fromLng'},
                to = { latitude: 'toLat', longitude: 'toLng'};

            var fakePoint = {
                distance: jasmine.createSpy('distance').and.returnValue(666)
            };

            H.geo.Point = jasmine.createSpy('H.geo.Point').and.returnValue(fakePoint);

            expect(mapApiService.distance(from, to)).toEqual(666);

            expect(H.geo.Point).toHaveBeenCalledWith(from.latitude, from.longitude);
            expect(H.geo.Point).toHaveBeenCalledWith(to.latitude, to.longitude);

        }));

    });

    describe('getTapPosition', function () {

        it('should return position of last tapped coordinate', inject(function (mapApiService) {

            var pos,
                lat = 'lat',
                lng = 'lng',

                evt = {
                    currentPointer: {
                        viewportX: 'viewportX',
                        viewportY: 'viewportY'
                    }
                };

            fakeMap.screenToGeo = function () {
                return {
                    lat: lat,
                    lng: lng
                };
            };

            fakeMap.addEventListener = function (eventName, callback) {
                callback(evt);
            };

            mapApiService.init([]);
            mapApiService.initBubble({});

            pos = mapApiService.getTapPosition();

            expect(pos.latitude).toEqual(lat);
            expect(pos.longitude).toEqual(lng)

        }));

    });

});