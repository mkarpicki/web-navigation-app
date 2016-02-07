describe('geo-location-service', function () {

    'use strict';

    var $window,
        $rootScope,
        events,

        fakeGeoLocation;

    beforeEach(module('navigationApp.services'));

    beforeEach(module(function ($provide) {

        fakeGeoLocation = {
            getCurrentPosition: function () {},
            watchPosition: function () {}
        };

        $window = {};
        $window.navigator = {};
        $window.navigator.geolocation = fakeGeoLocation;

        $provide.value('$window', $window);

        $rootScope = {
            $broadcast: function () {}
        };

        $provide.value('$rootScope', $rootScope);

        events = {
            POSITION_EVENT: 1,
            POSITION_EVENT_TYPES: {
                CHANGE: 1,
                ERROR: 0
            }
        };

        $provide.value('events', events);

    }));

    describe('when html5 location Api is not supported', function () {

        it('should broadcast error event', inject(function (geoLocationService) {

            $window.navigator.geolocation = null;

            $rootScope.$broadcast = jasmine.createSpy('$rootScope.$broadcast');

            geoLocationService.watchPosition();

            expect($rootScope.$broadcast).toHaveBeenCalledWith(events.POSITION_EVENT, {
                eventType: events.POSITION_EVENT_TYPES.ERROR,
                param: {}
            });

        }));

    });

    describe('when geo location Api returns error', function () {

        it('should broadcast error event', inject(function (geoLocationService) {

            var someError = {};

            fakeGeoLocation.getCurrentPosition = function (success,error) {
                error(someError);
            };

            $rootScope.$broadcast = jasmine.createSpy('$rootScope.$broadcast');

            geoLocationService.watchPosition();

            expect($rootScope.$broadcast).toHaveBeenCalledWith(events.POSITION_EVENT, {
                eventType: events.POSITION_EVENT_TYPES.ERROR,
                param: someError
            });
        }));

    });

    describe('when geo location Api find position', function () {

        it('should broadcast event with position object', inject(function (geoLocationService) {

            var somePosition = {};

            fakeGeoLocation.getCurrentPosition = function (success,error) {
                success(somePosition);
            };

            $rootScope.$broadcast = jasmine.createSpy('$rootScope.$broadcast');

            geoLocationService.watchPosition();

            expect($rootScope.$broadcast).toHaveBeenCalledWith(events.POSITION_EVENT, {
                eventType: events.POSITION_EVENT_TYPES.CHANGE,
                param: somePosition
            });

        }));

        it('should initialize watcher of html5 geo location api', inject(function (geoLocationService) {

            var somePosition = {};

            fakeGeoLocation.getCurrentPosition = function (success,error) {
                success(somePosition);
            };

            fakeGeoLocation.watchPosition = jasmine.createSpy();

            geoLocationService.watchPosition();

            expect(fakeGeoLocation.watchPosition).toHaveBeenCalled();

        }));

        describe('and html5 geo location API watch position will detect change', function () {

            it('should broadcast event with position object', inject(function (geoLocationService) {

                var somePosition = {};

                fakeGeoLocation.getCurrentPosition = function (success,error) {
                    success(somePosition);
                };

                fakeGeoLocation.watchPosition = function (callback) {
                    callback();
                };

                $rootScope.$broadcast = jasmine.createSpy('$rootScope.$broadcast');

                geoLocationService.watchPosition();

                expect($rootScope.$broadcast).toHaveBeenCalledTimes(2);
                expect($rootScope.$broadcast).toHaveBeenCalledWith(events.POSITION_EVENT, {
                    eventType: events.POSITION_EVENT_TYPES.CHANGE,
                    param: somePosition
                });

            }));

        });

    });

});