describe('stateService', function () {

    'use strict';

    var _$location_,
        _$window_,
        _events_,
        _$rootScope_;

    beforeEach(module('navigationApp.services'));

    beforeEach(module(function ($provide) {

        _$location_ = {
            search: function () { return ''; }
        };

        $provide.value('$location', _$location_);

        _$window_ = {};

        _$window_.history = {
            back: function () {}
        };


        $provide.value('$window', _$window_);


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

    describe('back', function () {

        it('should use back from history API', inject(function(stateService) {

            _$window_.history.back = jasmine.createSpy('history.back');

            stateService.back();

            expect(_$window_.history.back).toHaveBeenCalled();

        }));

    });

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

    });

    describe('addAreaToAvoid', function () {

        it('should add area to state', inject(function (stateService) {

            var area0 = {
                text: 'area0',
                boundingBox: '1,2,3,4'
            };
            var area1 = {
                text: 'area1',
                boundingBox: '5,6,7,8'
            };

            var areas = [area0,area1];

            var expectedQuery = "&a0=area0|1,2,3,4&a1=area1|5,6,7,8";

            stateService.addAreaToAvoid(areas[0]);
            stateService.addAreaToAvoid(areas[1]);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

    });

    describe('addDestinationPoint', function (){

        it('should add new point as last in state', inject(function (stateService) {

            var wayPoint0 = {
                text: 'waypoint0',
                coordinates: '1,2'
            };

            var wayPoint1 = {
                text: 'waypoint1',
                coordinates: '3,4'
            };

            var wayPoint2 = {
                text: 'waypoint2',
                coordinates: '5,6'
            };

            var wayPoints = [wayPoint0, wayPoint1, wayPoint2];

            var expectedQuery = "w0=waypoint0|1,2&w1=waypoint1|3,4&w2=waypoint2|5,6";

            stateService.addDestinationPoint(wayPoints[0]);
            stateService.addDestinationPoint(wayPoints[1]);
            stateService.addDestinationPoint(wayPoints[2]);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

    });

    describe('addWayPoint', function () {

        it('should add wayPoint to state', inject(function (stateService) {

            var wayPoint0 = {
                text: 'waypoint0',
                coordinates: '1,2'
            };

            var wayPoint1 = {
                text: 'waypoint1',
                coordinates: '3,4'
            };

            var wayPoints = [wayPoint0, wayPoint1];

            var expectedQuery = "w0=waypoint0|1,2&w1=waypoint1|3,4";

            stateService.addWayPoint(wayPoints[0]);
            stateService.addWayPoint(wayPoints[1]);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

        describe('when already at least two way points added', function () {

            it ('should add new way point before end point', inject(function (stateService) {

                var start = {
                    text: 'start',
                    coordinates: '1,2'
                };

                var wayPoint = {
                    text: 'waypoint',
                    coordinates: '3,4'
                };

                var destination = {
                    text: 'destination',
                    coordinates: '5,6'
                };

                var wayPoints = [start, destination, wayPoint];

                var expectedQuery = "w0=start|1,2&w1=waypoint|3,4&w2=destination|5,6";


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

                var start = {
                    text: 'start',
                    coordinates: '1,2'
                };

                var destinationFirst = {
                    text: 'destination-1',
                    coordinates: '3,4'
                };

                var destinationSecond = {
                    text: 'destination-2',
                    coordinates: '5,6'
                };

                var expectedQuery = "w0=start|1,2&w1=destination-1|3,4&w2=destination-2|5,6";

                stateService.addWayPoint(start);
                stateService.addWayPoint(destinationFirst);
                stateService.overwriteDestinationPoint(destinationSecond);

                expect(stateService.serializeQuery()).toEqual(expectedQuery);

            }));

        });

        it('should set overwrite destination point', inject(function(stateService) {

            var start = {
                text: 'start',
                coordinates: '1,2'
            };

            var middlePoint = {
                text: 'middle-point',
                coordinates: '3,4'
            };

            var destinationFirst = {
                text: 'destination-1',
                coordinates: '5,6'
            };

            var destinationSecond = {
                text: 'destination-2',
                coordinates: '7,8'
            };

            var wayPoints = [start, middlePoint, destinationFirst, destinationSecond];

            var expectedQuery = "w0=start|1,2&w1=destination-1|5,6&w2=destination-2|7,8";

            stateService.addWayPoint(wayPoints[0]);
            stateService.addWayPoint(wayPoints[1]);
            stateService.addWayPoint(wayPoints[2]);
            stateService.overwriteDestinationPoint(wayPoints[3]);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

    });

    describe('overwriteStartPoint', function () {

        it('should add start point  at the beginning', inject(function(stateService) {

            var start = {
                text: 'start-1',
                coordinates: '1,2'
            };

            var startSecond = {
                text: 'start-2',
                coordinates: '3,4'
            };

            var destination = {
                text: 'destination',
                coordinates: '5,6'
            };


            var wayPoints = [start, destination, startSecond];

            var expectedQuery = "w0=start-2|3,4&w1=destination|5,6";

            stateService.addWayPoint(wayPoints[0]);
            stateService.addWayPoint(wayPoints[1]);
            stateService.overwriteStartPoint(wayPoints[2]);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

    });

    describe('setAreasToAvoid', function (){

        it('should set all areas to avoid', inject(function(stateService) {

            var area0 = {
                text: 'area-0',
                boundingBox: '1,2,3,4'
            };

            var area1 = {
                text: 'area-1',
                boundingBox: '5,6,7,8'
            };

            var areas = [area0, area1];

            var expectedQuery = "&a0=area-0|1,2,3,4&a1=area-1|5,6,7,8";

            stateService.setAreasToAvoid(areas);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

    });

    describe('setWayPoints', function () {

        it('should set all way points', inject(function(stateService) {

            var start = {
                text: 'start',
                coordinates: '1,2'
            };

            var middle = {
                text: 'middle',
                coordinates: '3,4'
            };

            var destination = {
                text: 'destination',
                coordinates: '5,6'
            };


            var wayPoints = [start, middle, destination];

            var expectedQuery = "w0=start|1,2&w1=middle|3,4&w2=destination|5,6";

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

            var start = {
                text: 'start',
                coordinates: '1,2'
            };

            var destination = {
                text: 'destination',
                coordinates: '3,4'
            };

            var area0 = {
                text: 'area-0',
                boundingBox: '1,2,3,4'
            };

            var area1 = {
                text: 'area-1',
                boundingBox: '5,6,7,8'
            };

            var wayPoints = [start, destination];
            var areas = [area0, area1];

            var expectedQuery = "w0=start|1,2&w1=destination|3,4" + "&a0=area-0|1,2,3,4&a1=area-1|5,6,7,8";

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
                    'w0': 'waypoint0|1,2',
                    'w1': 'waypoint1|3,4',
                    'a0': 'area0|1,2,3,4',
                    'a1': 'area1|5,6,7,8'
                };

                _$location_.search = jasmine.createSpy('$location.search').and.returnValue(search);

                var deserialized = stateService.deserializeQuery();

                expect(_$location_.search).toHaveBeenCalled();

                expect(deserialized.wayPoints[0].text).toEqual('waypoint0');
                expect(deserialized.wayPoints[0].coordinates).toEqual('1,2');

                expect(deserialized.wayPoints[1].text).toEqual('waypoint1');
                expect(deserialized.wayPoints[1].coordinates).toEqual('3,4');

                expect(deserialized.areasToAvoid[0].text).toEqual('area0');
                expect(deserialized.areasToAvoid[0].boundingBox).toEqual('1,2,3,4');

                expect(deserialized.areasToAvoid[1].text).toEqual('area1');
                expect(deserialized.areasToAvoid[1].boundingBox).toEqual('5,6,7,8');
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