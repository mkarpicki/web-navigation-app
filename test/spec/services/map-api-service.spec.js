describe('map-api-service', function () {

    'use strict';

    var H,
        $window,
        config,

        fakeDefaultLayers,
        fakeUI;

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

        fakeUI = {
            createDefault: function () {}
        };

        H.ui = {
            UI: fakeUI
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

});