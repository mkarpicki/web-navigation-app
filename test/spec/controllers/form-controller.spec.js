describe('FormController', function () {

    "use strict";

    var $rootScope,
        $scope,
        $controller,

        $location,

        config,
        events,
        routingService,
        stateService,
        searchService,
        mapApiService,
        geoCoderService,

        fakeDeSerializedQuery;

    beforeEach(module('navigationApp.controllers'));

    beforeEach(inject(function (_$rootScope_, _$controller_) {

        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = $rootScope.$new();

        $location = {};
        $location.replace = function () {};
        $location.url = function () { return $location.replace; };

        routingService = {
            clearResults: function () {}
        };

        fakeDeSerializedQuery = {
            wayPoints: [],
            areasToAvoid: []
        };

        config = {
            NUMBER_OF_METERS_OF_POSITION_CHANGED_TO_REACT: 10
        };

        events = {
            POSITION_EVENT: 0,
            POSITION_EVENT_TYPES: {
                CHANGE: 0,
                ERROR: 1
            }
        };

        stateService = {
            clear: function () {},
            setWayPoints: function () {},
            setAreasToAvoid: function () {},
            serializeQuery: function () {},
            getSearchCriteria: function () {
                return fakeDeSerializedQuery;
            }
        };

        searchService = {
            getSuggestions: function () {},
            getResults: function () {}
        };

        mapApiService = {
            distance: function () {}
        };

        geoCoderService = {
            distance: function () {}
        };

    }));

    describe('when initialized', function () {

        it('should clear results of routingService', function () {

            routingService.clearResults = jasmine.createSpy('routingService.clearResults');

            $controller("FormController", {
                $scope: $scope,
                $location: $location,
                config: config,
                events: events,
                mapApiService: mapApiService,
                geoCoderService: geoCoderService,
                routingService: routingService,
                stateService: stateService,
                searchService: searchService
            });

            $scope.$apply();

            expect(routingService.clearResults).toHaveBeenCalled();

        });

        describe('and way points kept in stateService', function () {

            describe('and only one wayPoint stored', function () {

                it('should set start point and leave destination point empty', function () {

                    var start = {
                            title: 'start',
                            coordinates: { latitude: 1, longitude: 2}
                        };

                    fakeDeSerializedQuery.wayPoints = [start];

                    $controller("FormController", {
                        $scope: $scope,
                        $location: $location,
                        config: config,
                        events: events,
                        mapApiService: mapApiService,
                        geoCoderService: geoCoderService,
                        routingService: routingService,
                        stateService: stateService,
                        searchService: searchService
                    });

                    $scope.$apply();

                    expect($scope.wayPoints[0]).toEqual(start);
                    expect($scope.wayPoints[1]).toEqual({
                        title: '',
                        coordinates: {
                            latitude: null,
                            longitude: null
                        }
                    });

                });

            });

            describe('and many wayPoints stored in stateService', function () {

                it('should set start point, destination point and way points in scope', function () {

                    var start = {
                            title: 'start',
                            coordinates: { latitude: 1, longitude: 2}
                        },
                        middle1 = {
                            title: 'middle1',
                            coordinates: { latitude: 3, longitude: 4}
                        },
                        middle2 = {
                            title: 'middle2',
                            coordinates: { latitude: 5, longitude: 6}
                        },
                        destination = {
                            title: 'destination',
                            coordinates: { latitude: 7, longitude: 8}
                        };

                    fakeDeSerializedQuery.wayPoints = [start, middle1, middle2, destination];

                    $controller("FormController", {
                        $scope: $scope,
                        $location: $location,
                        config: config,
                        events: events,
                        mapApiService: mapApiService,
                        geoCoderService: geoCoderService,
                        routingService: routingService,
                        stateService: stateService,
                        searchService: searchService
                    });

                    $scope.$apply();

                    expect($scope.wayPoints[0]).toEqual(start);
                    expect($scope.wayPoints[1]).toEqual(middle1);
                    expect($scope.wayPoints[2]).toEqual(middle2);
                    expect($scope.wayPoints[3]).toEqual(destination);

                });

            });

        });

        describe('and areas to avoid kept in stateService', function () {

            it('should set ares to avoid in scope', function () {

                fakeDeSerializedQuery.areasToAvoid = [1,2];

                $controller("FormController", {
                    $scope: $scope,
                    $location: $location,
                    config: config,
                    events: events,
                    mapApiService: mapApiService,
                    geoCoderService: geoCoderService,
                    routingService: routingService,
                    stateService: stateService,
                    searchService: searchService
                });

                $scope.$apply();

                expect($scope.areasToAvoid).toEqual(fakeDeSerializedQuery.areasToAvoid);

            });

        });

    });

    describe('clear', function () {

        it('should clear state service', function () {

            stateService.clear = jasmine.createSpy('stateService.clear');

            //var $locationReplace = jasmine.createSpy('$locationReplace');
            //$location.url = jasmine.createSpy('$location.url').and.returnValue($locationReplace);

            $location.replace = function () {};
            $location.url = function () { return $location; };

            $controller("FormController", {
                $scope: $scope,
                $location: $location,
                config: config,
                events: events,
                mapApiService: mapApiService,
                geoCoderService: geoCoderService,
                routingService: routingService,
                stateService: stateService,
                searchService: searchService
            });

            $scope.$apply();

            $scope.wayPoints = [
                {
                    title: 't1',
                    coordinates: { latitude: 1, longitude: 2}
                },
                {
                    title: 't2',
                    coordinates: { latitude: 1, longitude: 2}
                },
                {
                    title: 't3',
                    coordinates: { latitude: 1, longitude: 2}
                },
                {
                    title: 't4',
                    coordinates: { latitude: 1, longitude: 2}
                }

            ];

            $scope.clear();

            expect($scope.wayPoints).toEqual([
                {
                    title: '',
                    coordinates: { latitude: null, longitude: null }
                },
                {
                    title: '',
                    coordinates: { latitude: null, longitude: null }
                }
            ]);
            expect(stateService.clear).toHaveBeenCalled();

        });

        it('should replace $location state to "/"', function () {

            stateService.clear = jasmine.createSpy('stateService.clear');

            $location.replace = jasmine.createSpy('$locationReplace');
            $location.url = jasmine.createSpy('$location.url').and.returnValue($location);

            $controller("FormController", {
                $scope: $scope,
                $location: $location,
                config: config,
                events: events,
                mapApiService: mapApiService,
                geoCoderService: geoCoderService,
                routingService: routingService,
                stateService: stateService,
                searchService: searchService
            });

            $scope.$apply();

            $scope.clear();

            expect($location.url).toHaveBeenCalledWith('/');
            expect($location.replace).toHaveBeenCalled();

        });

    });

    describe('addWayPoint', function () {

        it('should add empty string into wayPoint array in scope', function () {

            $controller("FormController", {
                $scope: $scope,
                $location: $location,
                config: config,
                events: events,
                mapApiService: mapApiService,
                geoCoderService: geoCoderService,
                routingService: routingService,
                stateService: stateService,
                searchService: searchService
            });

            $scope.$apply();

            expect($scope.wayPoints).toEqual([
                {
                    title: '',
                    coordinates: { latitude: null, longitude: null }
                },
                {
                    title: '',
                    coordinates: { latitude: null, longitude: null }
                }
            ]);

            $scope.addWayPoint();

            expect($scope.wayPoints).toEqual([
                {
                    title: '',
                    coordinates: { latitude: null, longitude: null }
                },
                {
                    title: '',
                    coordinates: { latitude: null, longitude: null }
                },
                {
                    title: '',
                    coordinates: { latitude: null, longitude: null }
                }
            ]);

            $scope.addWayPoint();

            expect($scope.wayPoints).toEqual([
                {
                    title: '',
                    coordinates: { latitude: null, longitude: null }
                },
                {
                    title: '',
                    coordinates: { latitude: null, longitude: null }
                },
                {
                    title: '',
                    coordinates: { latitude: null, longitude: null }
                },
                {
                    title: '',
                    coordinates: { latitude: null, longitude: null }
                }
            ]);

        });

    });

    describe('removeWayPoint', function () {

        it('should remove way point by passed index', function () {

            $controller("FormController", {
                $scope: $scope,
                $location: $location,
                config: config,
                events: events,
                mapApiService: mapApiService,
                geoCoderService: geoCoderService,
                routingService: routingService,
                stateService: stateService,
                searchService: searchService
            });

            $scope.$apply();

            $scope.wayPoints = ['a', 'b', 'c', 'd'];

            $scope.removeWayPoint(2);

            $scope.wayPoints = ['a', 'b', 'd'];

        });

        it('should update $location.url to "/" and searchQuery', function () {

            var searchQuery = 'param=value';

            $location.url = jasmine.createSpy('$location.url');

            stateService.serializeQuery = jasmine.createSpy('stateService.serializeQuery').and.returnValue(searchQuery);

            $controller("FormController", {
                $scope: $scope,
                $location: $location,
                config: config,
                events: events,
                mapApiService: mapApiService,
                geoCoderService: geoCoderService,
                routingService: routingService,
                stateService: stateService,
                searchService: searchService
            });

            $scope.$apply();

            $scope.removeWayPoint(2);

            expect($location.url).toHaveBeenCalledWith('/?' + searchQuery);

        });

    });

    describe('removeWayAreaToAvoid', function () {

        it('should remove area by passed index', function () {

            $controller("FormController", {
                $scope: $scope,
                $location: $location,
                config: config,
                events: events,
                mapApiService: mapApiService,
                geoCoderService: geoCoderService,
                routingService: routingService,
                stateService: stateService,
                searchService: searchService
            });

            $scope.$apply();

            $scope.areasToAvoid = ['a', 'b', 'c', 'd'];

            $scope.removeWayAreaToAvoid(2);

            $scope.areasToAvoid = ['a', 'b', 'd'];

        });

        it('should update $location.url to "/" and searchQuery', function () {

            var searchQuery = 'param=value';

            $location.url = jasmine.createSpy('$location.url');

            stateService.serializeQuery = jasmine.createSpy('stateService.serializeQuery').and.returnValue(searchQuery);

            $controller("FormController", {
                $scope: $scope,
                $location: $location,
                config: config,
                events: events,
                mapApiService: mapApiService,
                geoCoderService: geoCoderService,
                routingService: routingService,
                stateService: stateService,
                searchService: searchService
            });

            $scope.$apply();

            $scope.removeWayAreaToAvoid(2);

            expect($location.url).toHaveBeenCalledWith('/?' + searchQuery);

        });

    });

    describe('getRoute', function () {

        describe('when start point not set', function () {

            it('should do nothing', function () {

                var searchQuery = 'param=value';

                $location.replace = jasmine.createSpy('$location.replace');
                $location.url = jasmine.createSpy('$location.url').and.returnValue($location);

                stateService.serializeQuery = jasmine.createSpy('stateService.serializeQuery').and.returnValue(searchQuery);

                $controller("FormController", {
                    $scope: $scope,
                    $location: $location,
                    config: config,
                    events: events,
                    mapApiService: mapApiService,
                    geoCoderService: geoCoderService,
                    routingService: routingService,
                    stateService: stateService,
                    searchService: searchService
                });

                $scope.$apply();

                $scope.wayPoints = [
                    null,
                    {
                        title: '',
                        coordinates: { latitude: null, longitude: null }
                    }
                ];

                $scope.getRoute();

                expect($location.url).not.toHaveBeenCalled();
                expect($location.replace).not.toHaveBeenCalled();
                expect(stateService.serializeQuery).not.toHaveBeenCalled();

            });

        });

        describe('when destination point not set', function () {

            it('should do nothing', function () {

                var searchQuery = 'param=value';

                $location.replace = jasmine.createSpy('$location.replace');
                $location.url = jasmine.createSpy('$location.url').and.returnValue($location);

                stateService.serializeQuery = jasmine.createSpy('stateService.serializeQuery').and.returnValue(searchQuery);

                $controller("FormController", {
                    $scope: $scope,
                    $location: $location,
                    config: config,
                    events: events,
                    mapApiService: mapApiService,
                    geoCoderService: geoCoderService,
                    routingService: routingService,
                    stateService: stateService,
                    searchService: searchService
                });

                $scope.$apply();

                $scope.wayPoints = [
                    {
                        title: '',
                        coordinates: { latitude: null, longitude: null }
                    },
                    null
                ];

                $scope.getRoute();

                expect($location.url).not.toHaveBeenCalled();
                expect($location.replace).not.toHaveBeenCalled();
                expect(stateService.serializeQuery).not.toHaveBeenCalled();

            });

        });

        describe('when start and destination points set', function () {

            it('should add state with searchQuery to history and update url to search page', function () {

                var searchQuery = 'param=value';

                $location.replace = jasmine.createSpy('$location.replace');
                $location.url = jasmine.createSpy('$location.url').and.returnValue($location);

                stateService.serializeQuery = jasmine.createSpy('stateService.serializeQuery').and.returnValue(searchQuery);

                $controller("FormController", {
                    $scope: $scope,
                    $location: $location,
                    config: config,
                    events: events,
                    mapApiService: mapApiService,
                    geoCoderService: geoCoderService,
                    routingService: routingService,
                    stateService: stateService,
                    searchService: searchService
                });

                $scope.$apply();

                $scope.wayPoints = [
                    {
                        title: '',
                        coordinates: { latitude: 52, longitude: 12 }
                    },
                    {
                        title: '',
                        coordinates: { latitude: 53, longitude: 13 }
                    }
                ];

                $scope.getRoute();

                expect($location.url).toHaveBeenCalledWith('/search?' + searchQuery);
                expect(stateService.serializeQuery).toHaveBeenCalled();

            });

        });

    });

    describe('active field', function () {

        it('should be markable, unmarkable and checkable', function () {

            $controller("FormController", {
                $scope: $scope,
                $location: $location,
                config: config,
                events: events,
                mapApiService: mapApiService,
                geoCoderService: geoCoderService,
                routingService: routingService,
                stateService: stateService,
                searchService: searchService
            });

            $scope.$apply();

            expect($scope.isActiveField(null)).toEqual(true);

            $scope.markActiveField(666);

            expect($scope.isActiveField(666)).toEqual(true);

            $scope.unMarkActiveField();

            expect($scope.isActiveField(null)).toEqual(true);

        });

    });

    describe('search', function () {

        var fakeQuery = 'some-query';

        beforeEach(function () {

            $location.url = jasmine.createSpy('$location.url');

            stateService.serializeQuery = jasmine.createSpy('stateService.serializeQuery()').and.returnValue(fakeQuery);

        });


        it('should call service.getResults and add save results to active wayPoint and update location', function () {

            var index = 1;

            var results = [{
                position: [33,22],
                title: 'some restaurant'
            }];

            var fakePromise = {
                then: function (a) {
                    a(results)
                }
            };

            var fakeSearchObj = {
                promise: fakePromise
            };

            var fakeWayPoint = {
                title: results[0].title,
                coordinates: {
                    latitude: results[0].position[0],
                    longitude: results[0].position[1]
                }
            };

            searchService.getResults = function () {
                return fakeSearchObj;
            };

            $controller("FormController", {
                $scope: $scope,
                $location: $location,
                config: config,
                events: events,
                mapApiService: mapApiService,
                geoCoderService: geoCoderService,
                routingService: routingService,
                stateService: stateService,
                searchService: searchService
            });

            $scope.$apply();

            $scope.wayPoints = [
                {
                    title: '',
                    coordinates: { latitude: 1, longitude: 2 }
                },
                {
                    title: '',
                    coordinates: { latitude: 3, longitude: 4 }
                }
            ];

            $scope.markActiveField(index);

            $scope.search();

            expect($scope.wayPoints[index]).toEqual(fakeWayPoint);

            expect(stateService.serializeQuery).toHaveBeenCalled();
            expect($location.url).toHaveBeenCalledWith('/?' + fakeQuery);

        });

        describe('and no search results delivered', function () {

            it('should not update location and set wayPoint object', function () {

                var index = 1;

                var fakePromise = {
                    then: function (a) {
                        a(null)
                    }
                };

                var fakeSearchObj = {
                    promise: fakePromise
                };

                searchService.getResults = function () {
                    return fakeSearchObj;
                };

                $controller("FormController", {
                    $scope: $scope,
                    $location: $location,
                    config: config,
                    events: events,
                    mapApiService: mapApiService,
                    geoCoderService: geoCoderService,
                    routingService: routingService,
                    stateService: stateService,
                    searchService: searchService
                });

                $scope.$apply();

                $scope.wayPoints = [
                    null,
                    null
                ];

                $scope.markActiveField(index);

                $scope.search();

                expect($scope.wayPoints[index]).toEqual(null);

                expect(stateService.serializeQuery).not.toHaveBeenCalled();
                expect($location.url).not.toHaveBeenCalled();

            });

        });

        describe('and previous search was not finished', function () {

            it('should cancel promise from previous service execution', function () {

                var index = 1;

                var results = [{
                    position: [33,22],
                    title: 'some restaurant'
                }];

                var fakePromise = {
                    then: function (a) {
                        a(results)
                    }
                };

                var fakeSearchObj = {
                    promise: fakePromise,
                    cancel: jasmine.createSpy()
                };

                var fakeWayPoint = {
                    title: results[0].title,
                    coordinates: {
                        latitude: results[0].position[0],
                        longitude: results[0].position[1]
                    }
                };
                searchService.getResults = function () {
                    return fakeSearchObj;
                };

                $controller("FormController", {
                    $scope: $scope,
                    $location: $location,
                    config: config,
                    events: events,
                    mapApiService: mapApiService,
                    geoCoderService: geoCoderService,
                    routingService: routingService,
                    stateService: stateService,
                    searchService: searchService
                });

                $scope.$apply();

                $scope.wayPoints = [
                    {
                        title: '',
                        coordinates: { latitude: 1, longitude: 2 }
                    },
                    {
                        title: '',
                        coordinates: { latitude: 3, longitude: 4 }
                    }
                ];

                $scope.markActiveField(index);

                $scope.search();
                $scope.search();

                expect($scope.wayPoints[index]).toEqual(fakeWayPoint);
                expect(fakeSearchObj.cancel).toHaveBeenCalled();

                expect(stateService.serializeQuery).toHaveBeenCalled();
                expect($location.url).toHaveBeenCalledWith('/?' + fakeQuery);

            });

        });

    });

    describe('getSuggestions', function () {

        it('should call service.getSuggestions and add suggestions to active wayPoint', function () {

            var index = 1;

            var suggestions = ['sugg1', 'sugg2'];

            var fakePromise = {
                then: function (a) {
                    a(suggestions)
                }
            };

            var fakeSearchObj = {
                promise: fakePromise
            };

            searchService.getSuggestions = function () {
                return fakeSearchObj;
            };

            $controller("FormController", {
                $scope: $scope,
                $location: $location,
                config: config,
                events: events,
                mapApiService: mapApiService,
                geoCoderService: geoCoderService,
                routingService: routingService,
                stateService: stateService,
                searchService: searchService
            });

            $scope.$apply();

            $scope.wayPoints = [
                {
                    title: '',
                    coordinates: { latitude: 1, longitude: 2 }
                },
                {
                    title: '',
                    coordinates: { latitude: 3, longitude: 4 }
                }
            ];

            $scope.markActiveField(index);

            $scope.getSuggestions();

            expect($scope.wayPoints[index].suggestions).toEqual(suggestions);

        });

        describe('and previous search suggestions promise not solved yet', function () {

            it('should cancel promise', function () {

                var index = 1;

                var suggestions = ['sugg1', 'sugg2'];

                var fakePromise = {
                    then: function (a) {
                        a(suggestions)
                    }
                };

                var fakeSearchObj = {
                    promise: fakePromise,
                    cancel: jasmine.createSpy()
                };

                searchService.getSuggestions = function () {
                    return fakeSearchObj;
                };


                $controller("FormController", {
                    $scope: $scope,
                    $location: $location,
                    config: config,
                    events: events,
                    mapApiService: mapApiService,
                    geoCoderService: geoCoderService,
                    routingService: routingService,
                    stateService: stateService,
                    searchService: searchService
                });

                $scope.$apply();

                $scope.wayPoints = [
                    {
                        title: '',
                        coordinates: { latitude: 1, longitude: 2 }
                    },
                    {
                        title: '',
                        coordinates: { latitude: 3, longitude: 4 }
                    }
                ];

                $scope.markActiveField(index);

                $scope.getSuggestions();
                $scope.getSuggestions();

                expect(fakeSearchObj.cancel).toHaveBeenCalled();
                expect($scope.wayPoints[index].suggestions).toEqual(suggestions);
            });

        });

        describe('useCurrentPositionAsStartPoint', function () {

            describe('when useCurrentPosition set to FALSE', function (){

                it('should not resolve last position', function () {

                    geoCoderService.reverse = jasmine.createSpy('geoCoderService.reverse');

                    $controller("FormController", {
                        $scope: $scope,
                        $location: $location,
                        config: config,
                        events: events,
                        mapApiService: mapApiService,
                        geoCoderService: geoCoderService,
                        routingService: routingService,
                        stateService: stateService,
                        searchService: searchService
                    });

                    $scope.$apply();

                    $scope.useCurrentPosition = false;

                    $scope.useCurrentPositionAsStartPoint();

                    expect(geoCoderService.reverse).not.toHaveBeenCalled();

                });

            });

            describe('when useCurrentPosition set to TRUE', function (){

                describe('but no location found so far', function () {

                    it('should NOT resolve last position', function () {

                        geoCoderService.reverse = jasmine.createSpy('geoCoderService.reverse');

                        $controller("FormController", {
                            $scope: $scope,
                            $location: $location,
                            config: config,
                            events: events,
                            mapApiService: mapApiService,
                            geoCoderService: geoCoderService,
                            routingService: routingService,
                            stateService: stateService,
                            searchService: searchService
                        });

                        $scope.$apply();

                        $scope.useCurrentPosition = true;

                        $scope.useCurrentPositionAsStartPoint();

                        expect(geoCoderService.reverse).not.toHaveBeenCalled();

                    });

                });

            });

        });

        describe('when POSITION_EVENT fired', function (){

            var fakeEventParams = {};

            beforeEach(function () {

                fakeEventParams.param = {
                    coords: {
                        latitude: 10,
                        longitude: 20
                    }
                };

            });

            describe('and event_type is not defined', function () {

                it('should not change state of currentPositionAvailable and should not reverse position', function (){

                    geoCoderService.reverse = jasmine.createSpy('geoCoderService.reverse');

                    $controller("FormController", {
                        $scope: $scope,
                        $location: $location,
                        config: config,
                        events: events,
                        mapApiService: mapApiService,
                        geoCoderService: geoCoderService,
                        routingService: routingService,
                        stateService: stateService,
                        searchService: searchService
                    });

                    $scope.$apply();

                    $scope.currentPositionAvailable = true;

                    fakeEventParams.eventType = events.POSITION_EVENT_TYPES['not-known'];

                    $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                    expect($scope.currentPositionAvailable).toEqual(true);
                    expect(geoCoderService.reverse).not.toHaveBeenCalled();

                });

            });

            describe('and event_type is ERROR', function () {

                it('should set currentPositionAvailable to FALSE', function () {

                    $controller("FormController", {
                        $scope: $scope,
                        $location: $location,
                        config: config,
                        events: events,
                        mapApiService: mapApiService,
                        geoCoderService: geoCoderService,
                        routingService: routingService,
                        stateService: stateService,
                        searchService: searchService
                    });

                    $scope.$apply();

                    $scope.currentPositionAvailable = true;

                    fakeEventParams.eventType = events.POSITION_EVENT_TYPES.ERROR;

                    $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                    expect($scope.currentPositionAvailable).toEqual(false);

                });

            });

            describe('and event_type is CHANGE', function () {

                beforeEach(function (){

                    fakeEventParams.eventType = events.POSITION_EVENT_TYPES.CHANGE;

                });

                describe('and useCurrentPosition set to FALSE', function () {

                    it('should not resolve last position', function () {

                        geoCoderService.reverse = jasmine.createSpy('geoCoderService.reverse');

                        $controller("FormController", {
                            $scope: $scope,
                            $location: $location,
                            config: config,
                            events: events,
                            mapApiService: mapApiService,
                            geoCoderService: geoCoderService,
                            routingService: routingService,
                            stateService: stateService,
                            searchService: searchService
                        });

                        $scope.$apply();

                        $scope.useCurrentPosition = false;

                        $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                        expect(geoCoderService.reverse).not.toHaveBeenCalled();

                    });

                });

                describe('and useCurrentPosition set to TRUE', function () {

                    describe('and no position found before', function () {

                        it('should resolve last position', function () {

                            var distance = config.NUMBER_OF_METERS_OF_POSITION_CHANGED_TO_REACT + 1;

                            var fakePromise = {
                                then: function (a) {
                                    a('some text');
                                }
                            };

                            geoCoderService.reverse = jasmine.createSpy('geoCoderService.reverse').and.returnValue(fakePromise);
                            mapApiService.distance = jasmine.createSpy('mapApiService.distance').and.returnValue(distance);

                            $controller("FormController", {
                                $scope: $scope,
                                $location: $location,
                                config: config,
                                events: events,
                                mapApiService: mapApiService,
                                geoCoderService: geoCoderService,
                                routingService: routingService,
                                stateService: stateService,
                                searchService: searchService
                            });

                            $scope.$apply();

                            $scope.useCurrentPosition = true;

                            $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                            expect(geoCoderService.reverse).toHaveBeenCalled();
                        });

                    });

                    describe('and position found before', function () {

                        describe('and new position not changed enough from last position', function () {

                            it('should NOT resolve last position', function () {

                                var distance = config.NUMBER_OF_METERS_OF_POSITION_CHANGED_TO_REACT - 1;

                                geoCoderService.reverse = jasmine.createSpy('geoCoderService.reverse');
                                mapApiService.distance = jasmine.createSpy('mapApiService.distance').and.returnValue(distance);

                                $controller("FormController", {
                                    $scope: $scope,
                                    $location: $location,
                                    config: config,
                                    events: events,
                                    mapApiService: mapApiService,
                                    geoCoderService: geoCoderService,
                                    routingService: routingService,
                                    stateService: stateService,
                                    searchService: searchService
                                });

                                $scope.$apply();

                                $scope.useCurrentPosition = false;

                                $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                                $scope.useCurrentPosition = true;

                                $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                                expect(geoCoderService.reverse).not.toHaveBeenCalled();

                            });

                        });

                        describe('and new position changed enough from last position', function () {

                            var distance;

                            beforeEach(function () {

                                distance = config.NUMBER_OF_METERS_OF_POSITION_CHANGED_TO_REACT + 1;

                            });

                            describe('and reverse geocoder did not deliver name of position', function (){

                                it('should not update first waypoint', function () {

                                    var fakePromise = {
                                        then: function (a) {
                                            a(null);
                                        }
                                    };

                                    geoCoderService.reverse = jasmine.createSpy('geoCoderService.reverse').and.returnValue(fakePromise);
                                    mapApiService.distance = jasmine.createSpy('mapApiService.distance').and.returnValue(distance);

                                    $controller("FormController", {
                                        $scope: $scope,
                                        $location: $location,
                                        config: config,
                                        events: events,
                                        mapApiService: mapApiService,
                                        geoCoderService: geoCoderService,
                                        routingService: routingService,
                                        stateService: stateService,
                                        searchService: searchService
                                    });

                                    $scope.$apply();

                                    $scope.useCurrentPosition = false;

                                    $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                                    $scope.useCurrentPosition = true;

                                    $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                                    expect(geoCoderService.reverse).toHaveBeenCalled();

                                });

                            });

                            describe('and reverse geocoder delivered name of position', function (){

                                it('should update first waypoint', function () {

                                    var fakePromise = {
                                        then: function (a) {
                                            a('some text');
                                        }
                                    };

                                    geoCoderService.reverse = jasmine.createSpy('geoCoderService.reverse').and.returnValue(fakePromise);
                                    mapApiService.distance = jasmine.createSpy('mapApiService.distance').and.returnValue(distance);

                                    $controller("FormController", {
                                        $scope: $scope,
                                        $location: $location,
                                        config: config,
                                        events: events,
                                        mapApiService: mapApiService,
                                        geoCoderService: geoCoderService,
                                        routingService: routingService,
                                        stateService: stateService,
                                        searchService: searchService
                                    });

                                    $scope.$apply();

                                    $scope.useCurrentPosition = false;

                                    $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                                    $scope.useCurrentPosition = true;

                                    $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                                    expect(geoCoderService.reverse).toHaveBeenCalled();

                                    expect($scope.wayPoints[0]).toEqual({
                                        title: 'some text',
                                        coordinates: {
                                            latitude: fakeEventParams.param.coords.latitude,
                                            longitude: fakeEventParams.param.coords.longitude
                                        }
                                    })

                                });

                            });

                        });

                    });

                });

            });

        });

    });

});