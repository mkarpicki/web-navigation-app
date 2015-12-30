describe('map-api-service', function () {

    'use strict';

    var H,
        $window,
        config,

        fakeDefaultLayers,
        fakePoint,
        fakeMap,
        fakeUI,
        fakeDefaultUI,
        fakeBubble,
        fakeRect,
        fakeGeoRect;

    beforeEach(module('navigationApp.services'));

    beforeEach(module(function ($provide) {

        //fakeMap = {};

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
            addEventListener: function () {},
            screenToGeo: function () {},
            setCenter: function () {},
            setZoom: function () {}
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

        H.geo = {};

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
        config.appId = 'someAppId';
        config.appCode = 'someAppCode';
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

            var map = {};

            H.Map = jasmine.createSpy().and.returnValue(map);
            H.ui.UI.createDefault = jasmine.createSpy();

            mapApiService.init([]);

            expect(H.ui.UI.createDefault).toHaveBeenCalledWith(map, fakeDefaultLayers);

        }));
    });

    describe('initBubble', function () {

        it ('should add events to map', inject(function (mapApiService) {

            var someBubbleElement = {};

            fakeMap.addEventListener = jasmine.createSpy();
            H.Map = jasmine.createSpy().and.returnValue(fakeMap);

            mapApiService.init([]);
            mapApiService.initBubble(someBubbleElement);

            expect(fakeMap.addEventListener).toHaveBeenCalledWith('tap', jasmine.any(Function));

        }));

        describe ('when assigned event called', function () {

            var fakeGeo = 'geo',
                bubbleElement = 'bubbleElement',
                fakeMap = {
                    screenToGeo: jasmine.createSpy().and.returnValue(fakeGeo)
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
            expect(fakeMap.setZoom).toHaveBeenCalledWith(14);

        }));

    });

    describe('calculateRectangle', function () {

        var position = { latitude: 'lat', longitude: 'lng'},
            distance = 'distance';

        //beforeEach(function () {

        //});

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

        it ('should add rectangle to map', inject(function (mapApiService) {

            H.geo.Rect.fromPoints = jasmine.createSpy().and.returnValue(fakeGeoRect);

            H.map.Rect = function (r, options) {

                if (r !== fakeGeoRect) {
                    throw 'NOT proper geo.Rect';
                }

                if (options.style.fillColor !== '#FFFFCC') {
                    throw 'WRONG fillColor STYLE';
                }

                if (options.style.strokeColor !== '#e2e2e2') {
                    throw 'WRONG strokeColor STYLE';
                }

                if (options.style.lineWidth !== 8) {
                    throw 'WRONG lineWidth STYLE';
                }

                return fakeRect;
            };

            fakeMap.addObject = jasmine.createSpy('addObject');

            mapApiService.init([]);
            mapApiService.calculateRectangle(position, distance);

            expect(fakeMap.addObject).toHaveBeenCalledWith(fakeRect);

        }));

        it ('should return rectangle bounding box', inject(function (mapApiService) {

            mapApiService.init([]);
            var r = mapApiService.calculateRectangle(position, distance);

            expect(r.topLeft.latitude).toEqual(fakeGeoRect.getTopLeft().lat);
            expect(r.topLeft.longitude).toEqual(fakeGeoRect.getTopLeft().lng);
            expect(r.bottomRight.latitude).toEqual(fakeGeoRect.getBottomRight().lat);
            expect(r.bottomRight.longitude).toEqual(fakeGeoRect.getBottomRight().lng);

        }));

    });

});