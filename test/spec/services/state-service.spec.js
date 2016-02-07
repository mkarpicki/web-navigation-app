describe('stateService', function () {

    'use strict';

    var _$location_,
        _events_,
        _$rootScope_;

    beforeEach(module('navigationApp.services'));

    beforeEach(module(function ($provide) {

        _$location_ = {};

        $provide.value('$location', _$location_);

        _events_ = {
            NAVIGATION_STATE_EVENT: 'NAVIGATION_STATE_EVENT',
            NAVIGATION_STATE_EVENT_TYPES: {
                NAVIGATION_OFF: 'NAVIGATION_OFF',
                NAVIGATION_ON: 'NAVIGATION_ON'
            }
        };

        $provide.value('events', _events_);

        _$rootScope_ = {
            $broadcast: function () {}
        };

        $provide.value('$rootScope', _$rootScope_);

    }));

    describe('enableNavigationMode', function (){

        it ('should set navigation mode to true', inject(function(stateService) {

            _$rootScope_.$broadcast= jasmine.createSpy('$rootScope.$broadcast');

            expect(stateService.isNavigationModeEnabled()).toEqual(false);

            stateService.enableNavigationMode();

            expect(stateService.isNavigationModeEnabled()).toEqual(true);
            expect(_$rootScope_.$broadcast).toHaveBeenCalledWith(_events_.NAVIGATION_STATE_EVENT, {
                eventType: _events_.NAVIGATION_STATE_EVENT_TYPES.NAVIGATION_ON
            })

        }));

    });

    describe('disableNavigationMode', function (){

        it ('should set navigation mode to true', inject(function(stateService) {

            _$rootScope_.$broadcast= jasmine.createSpy('$rootScope.$broadcast');

            expect(stateService.isNavigationModeEnabled()).toEqual(false);

            stateService.enableNavigationMode();

            expect(stateService.isNavigationModeEnabled()).toEqual(true);

            stateService.disableNavigationMode();

            expect(stateService.isNavigationModeEnabled()).toEqual(false);
            expect(_$rootScope_.$broadcast).toHaveBeenCalledWith(_events_.NAVIGATION_STATE_EVENT, {
                eventType: _events_.NAVIGATION_STATE_EVENT_TYPES.NAVIGATION_OFF
            })

        }));

    })

    describe('addAreaToAvoid', function () {

        it('should add area to state', inject(function (stateService) {

            var areas = ['area0','area1'];

            var expectedQuery = "&a0=area0&a1=area1";

            stateService.addAreaToAvoid(areas[0]);
            stateService.addAreaToAvoid(areas[1]);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

    });

    describe('addWayPoint', function () {

        it('should add wayPoint to state', inject(function (stateService) {

            var wayPoints = ['waypoint0','waypoint1'];

            var expectedQuery = "w0=waypoint0&w1=waypoint1";

            stateService.addWayPoint(wayPoints[0]);
            stateService.addWayPoint(wayPoints[1]);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

        describe('when already at least two way points added', function () {

            it ('should add new way point before end point', inject(function (stateService) {

                var wayPoints = ['start','destination', 'waypoint'];

                var expectedQuery = "w0=start&w1=waypoint&w2=destination";

                stateService.addWayPoint(wayPoints[0]);
                stateService.addWayPoint(wayPoints[1]);
                stateService.addWayPoint(wayPoints[2]);

                expect(stateService.serializeQuery()).toEqual(expectedQuery);

            }));

        });

    });

    describe('overwriteDestinationPoint', function () {

        describe('when less then 3 points in state', function () {

            it('should add destination point at the end', inject(function(stateService) {

                var wayPoints = ['start','destination_first', 'destination_second'];

                var expectedQuery = "w0=start&w1=destination_first&w2=destination_second";

                stateService.addWayPoint(wayPoints[0]);
                stateService.addWayPoint(wayPoints[1]);
                stateService.overwriteDestinationPoint(wayPoints[2]);

                expect(stateService.serializeQuery()).toEqual(expectedQuery);

            }));

        });

        it('should set overwrite destination point', inject(function(stateService) {

            var wayPoints = ['start', 'middle_point', 'destination_first', 'destination_second'];

            var expectedQuery = "w0=start&w1=destination_first&w2=destination_second";

            stateService.addWayPoint(wayPoints[0]);
            stateService.addWayPoint(wayPoints[1]);
            stateService.addWayPoint(wayPoints[2]);
            stateService.overwriteDestinationPoint(wayPoints[3]);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

    });

    describe('overwriteStartPoint', function () {

        it('should add start point  at the beginning', inject(function(stateService) {

            var wayPoints = ['start','destination', 'start_second'];

            var expectedQuery = "w0=start_second&w1=destination";

            stateService.addWayPoint(wayPoints[0]);
            stateService.addWayPoint(wayPoints[1]);
            stateService.overwriteStartPoint(wayPoints[2]);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

    });

    describe('setAreasToAvoid', function (){

        it('should set all areas to avoid', inject(function(stateService) {

            var areas = ['area0','area1'];

            var expectedQuery = "&a0=area0&a1=area1";

            stateService.setAreasToAvoid(areas);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

    });

    describe('setWayPoints', function () {

        it('should set all way points', inject(function(stateService) {

            var wayPoints = ['start', 'middle','destination'];

            var expectedQuery = "w0=start&w1=middle&w2=destination";

            stateService.setWayPoints(wayPoints);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

    });

    describe('clear', function () {

        it ('should clear way points and areas to avoid from state', inject(function (stateService) {

            var wayPoints = ['start', 'middle','destination'];
            var areas = ['area0','area1'];

            var expectedQuery = "";

            stateService.addWayPoint(wayPoints[0]);
            stateService.addWayPoint(wayPoints[1]);

            stateService.addAreaToAvoid(areas[0]);
            stateService.addAreaToAvoid(areas[1]);

            stateService.clear();

            expect(stateService.serializeQuery()).toEqual(expectedQuery);
        }));

    });

    describe('serializeQuery', function () {

        it ('should build query from all added objects', inject(function (stateService) {

            var wayPoints = ['waypoint0','waypoint1'];
            var areas = ['area0','area1'];

            var expectedQuery = "w0=waypoint0&w1=waypoint1" + "&a0=area0&a1=area1";

            stateService.addWayPoint(wayPoints[0]);
            stateService.addWayPoint(wayPoints[1]);

            stateService.addAreaToAvoid(areas[0]);
            stateService.addAreaToAvoid(areas[1]);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

    });

    describe('deserializeQuery', function () {

        describe('when $location.search not empty', function () {

            it ('should deserialize $location query', inject(function(stateService) {

                var search = {
                    'w0': 'waypoint0',
                    'w1': 'waypoint1',
                    'a0': 'area0',
                    'a1': 'area1'
                };

                _$location_.search = jasmine.createSpy('$location.search').and.returnValue(search);

                var deserialized = stateService.deserializeQuery();

                expect(_$location_.search).toHaveBeenCalled();

                expect(deserialized.wayPoints[0]).toEqual('waypoint0');
                expect(deserialized.wayPoints[1]).toEqual('waypoint1');

                expect(deserialized.areasToAvoid[0]).toEqual('area0');
                expect(deserialized.areasToAvoid[1]).toEqual('area1');
            }));

        });

        describe('when $location.search empty', function () {

            it ('should deserialize $location query', inject(function(stateService) {

                var search = [];

                _$location_.search = jasmine.createSpy('$location.search').and.returnValue(search);

                var deserialized = stateService.deserializeQuery();

                expect(_$location_.search).toHaveBeenCalled();

                expect(deserialized.wayPoints.length).toEqual(0);
                expect(deserialized.areasToAvoid.length).toEqual(0);
            }));

        });


    });

});