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
                title: 'area0',
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
            var area1 = {
                title: 'area1',
                boundingBox: {
                    topLeft: {
                        latitude: 5,
                        longitude: 6
                    },
                    bottomRight: {
                        latitude: 7,
                        longitude: 8
                    }
                }
            };

            var areas = [area0,area1];

            var expectedQuery = "&a0=area0|1,2;3,4&a1=area1|5,6;7,8";

            stateService.addAreaToAvoid(areas[0]);
            stateService.addAreaToAvoid(areas[1]);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

    });

    describe('addDestinationPoint', function (){

        it('should add new point as last in state', inject(function (stateService) {

            var wayPoint0 = {
                title: 'waypoint0',
                coordinates: {
                    latitude: 1,
                    longitude: 2
                }
            };

            var wayPoint1 = {
                title: 'waypoint1',
                coordinates: {
                    latitude: 3,
                    longitude: 4
                }
            };

            var wayPoint2 = {
                title: 'waypoint2',
                coordinates: {
                    latitude: 5,
                    longitude: 6
                }
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
                title: 'waypoint0',
                coordinates: {
                    latitude: 1,
                    longitude: 2
                }
            };

            var wayPoint1 = {
                title: 'waypoint1',
                coordinates: {
                    latitude: 3,
                    longitude: 4
                }
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
                    title: 'start',
                    coordinates: {
                        latitude: 1,
                        longitude: 2
                    }
                };

                var wayPoint = {
                    title: 'waypoint',
                    coordinates: {
                        latitude: 3,
                        longitude: 4
                    }
                };

                var destination = {
                    title: 'destination',
                    coordinates: {
                        latitude: 5,
                        longitude: 6
                    }
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
                    title: 'start',
                    coordinates: {
                        latitude: 1,
                        longitude: 2
                    }
                };

                var destinationFirst = {
                    title: 'destination-1',
                    coordinates: {
                        latitude: 3,
                        longitude: 4
                    }
                };

                var destinationSecond = {
                    title: 'destination-2',
                    coordinates: {
                        latitude: 5,
                        longitude: 6
                    }
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
                title: 'start',
                coordinates: {
                    latitude: 1,
                    longitude: 2
                }
            };

            var middlePoint = {
                title: 'middle-point',
                coordinates: {
                    latitude: 3,
                    longitude: 4
                }
            };

            var destinationFirst = {
                title: 'destination-1',
                coordinates: {
                    latitude: 5,
                    longitude: 6
                }
            };

            var destinationSecond = {
                title: 'destination-2',
                coordinates: {
                    latitude: 7,
                    longitude: 8
                }
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
                title: 'start-1',
                coordinates: {
                    latitude: 1,
                    longitude: 2
                }
            };

            var startSecond = {
                title: 'start-2',
                coordinates: {
                    latitude: 3,
                    longitude: 4
                }
            };

            var destination = {
                title: 'destination',
                coordinates: {
                    latitude: 5,
                    longitude: 6
                }
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
                title: 'area-0',
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

            var area1 = {
                title: 'area-1',
                boundingBox: {
                    topLeft: {
                        latitude: 5,
                        longitude: 6
                    },
                    bottomRight: {
                        latitude: 7,
                        longitude: 8
                    }
                }
            };

            var areas = [area0, area1];

            var expectedQuery = "&a0=area-0|1,2;3,4&a1=area-1|5,6;7,8";

            stateService.setAreasToAvoid(areas);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

    });

    describe('setWayPoints', function () {

        it('should set all way points', inject(function(stateService) {

            var start = {
                title: 'start',
                coordinates: {
                    latitude: 1,
                    longitude: 2
                }
            };

            var middle = {
                title: 'middle',
                coordinates: {
                    latitude: 3,
                    longitude: 4
                }
            };

            var destination = {
                title: 'destination',
                coordinates: {
                    latitude: 5,
                    longitude: 6
                }
            };


            var wayPoints = [start, middle, destination];

            var expectedQuery = "w0=start|1,2&w1=middle|3,4&w2=destination|5,6";

            stateService.setWayPoints(wayPoints);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

    });

    describe('clear', function () {

        it ('should clear way points and areas to avoid from state', inject(function (stateService) {

            var start = {
                title: 'start',
                coordinates: {
                    latitude: 1,
                    longitude: 2
                }
            };

            var destination = {
                title: 'destination',
                coordinates: {
                    latitude: 3,
                    longitude: 4
                }
            };

            var area0 = {
                title: 'area-0',
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

            var area1 = {
                title: 'area-1',
                boundingBox: {
                    topLeft: {
                        latitude: 5,
                        longitude: 6
                    },
                    bottomRight: {
                        latitude: 7,
                        longitude: 8
                    }
                }
            };
            var expectedQuery = "";

            stateService.addWayPoint(start);
            stateService.addWayPoint(destination);

            stateService.addAreaToAvoid(area0);
            stateService.addAreaToAvoid(area1);

            stateService.clear();

            expect(stateService.serializeQuery()).toEqual(expectedQuery);
        }));

    });

    describe('getSearchCriteria', function () {

        it('should return object with added wayPoints and areas to avoid', inject(function(stateService) {

            var start = {
                title: 'start',
                coordinates: {
                    latitude: 1,
                    longitude: 2
                }
            };

            var destination = {
                title: 'destination',
                coordinates: {
                    latitude: 3,
                    longitude: 4
                }
            };

            var area = {
                title: 'area-0',
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

            stateService.addWayPoint(start);
            stateService.addWayPoint(destination);

            stateService.addAreaToAvoid(area);

            var criteria = stateService.getSearchCriteria();

            expect(criteria.wayPoints).toEqual([start, destination]);
            expect(criteria.areasToAvoid).toEqual([area]);

        }));

    });

    describe('serializeQuery', function () {

        it ('should build query from all added objects', inject(function (stateService) {

            var start = {
                title: 'start',
                coordinates: {
                    latitude: 1,
                    longitude: 2
                }
            };

            var destination = {
                title: 'destination',
                coordinates: {
                    latitude: 3,
                    longitude: 4
                }
            };

            var area0 = {
                title: 'area-0',
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

            var area1 = {
                title: 'area-1',
                boundingBox: {
                    topLeft: {
                        latitude: 5,
                        longitude: 6
                    },
                    bottomRight: {
                        latitude: 7,
                        longitude: 8
                    }
                }
            };

            var wayPoints = [start, destination];
            var areas = [area0, area1];

            var expectedQuery = "w0=start|1,2&w1=destination|3,4" + "&a0=area-0|1,2;3,4&a1=area-1|5,6;7,8";

            stateService.addWayPoint(wayPoints[0]);
            stateService.addWayPoint(wayPoints[1]);

            stateService.addAreaToAvoid(areas[0]);
            stateService.addAreaToAvoid(areas[1]);

            expect(stateService.serializeQuery()).toEqual(expectedQuery);

        }));

    });

    describe('serializeQuery', function () {

        describe('when added wayPoints or areas to avoid have missing coordinates', function () {

            it ('should use empty strings instead', inject(function (stateService) {

                var w0 = {
                    title: 'start',
                    coordinates: {
                        latitude: null,
                        longitude: null
                    }
                };

                var area0 = {
                    title: 'avoid-me',
                    boundingBox: {
                        topLeft: {},
                        bottomRight: {
                            latitude: null,
                            longitude: null
                        }
                    }
                };

                stateService.addWayPoint(w0);

                stateService.addAreaToAvoid(area0);

                var serializedQuery = stateService.serializeQuery();

                expect(serializedQuery).toEqual('w0=start|,&a0=avoid-me|,;,');

            }));

        });

    });

    describe('deserializeQuery', function () {

        describe('and query does not contain none :areas & wayPoints', function () {

        });

        describe('and query contains wayPoints and areas to avoid', function () {

            it('should parse query and prepare object with wayPoints and areas To avoid', inject(function (stateService) {

                _$location_.search = jasmine.createSpy('$location.search()').and.returnValue({
                    w0: "10249 Berlin, Deutschland|52.52281559009635,13.442309142765453",
                    a0: "Landsberger Allee, 10407 Berlin, Deutschland|52.52,13.21735955507;52.525421716745996,13.449030286597603"
                });

                var objectFromQuery = stateService.deserializeQuery();

                expect(objectFromQuery.wayPoints).toEqual([{
                    title: '10249 Berlin, Deutschland',
                    coordinates: {
                        latitude: '52.52281559009635',
                        longitude: '13.442309142765453'
                    }
                }]);

                expect(objectFromQuery.areasToAvoid).toEqual([{
                    title: 'Landsberger Allee, 10407 Berlin, Deutschland',
                    boundingBox: {
                        topLeft: {
                            latitude: '52.52',
                            longitude: '13.21735955507'
                        },
                        bottomRight: {
                            latitude: '52.525421716745996',
                            longitude: '13.449030286597603'
                        }
                    }
                }]);

            }));
        });

    });

});