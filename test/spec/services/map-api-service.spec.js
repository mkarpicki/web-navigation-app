describe('map-api-service', function () {

    'use strict';

    var H,
        $window,
        config,

        fakeDefaultLayers,
        fakeUI,
        fakeDefaultUI,
        fakeBubble;

    beforeEach(module('navigationApp.services'));

    beforeEach(module(function ($provide) {

        fakeDefaultLayers = {
            normal: {
                map: {}
            }
        };

        var fakePlatform = {
            createDefaultLayers: function () { return fakeDefaultLayers; }
        };

        H = {};
        H.service = {
            Platform: function () { return fakePlatform; }
        };

        H.Map = jasmine.createSpy();

        H.mapevents = {
            MapEvents: function () {},
            Behavior: function () {}
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

            var fakeMap = {};
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

            var position = { latitude: 'lat', longitude: 'lng'},
                fakeMap = {
                setCenter: jasmine.createSpy(),
                setZoom: jasmine.createSpy()
            };

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

});