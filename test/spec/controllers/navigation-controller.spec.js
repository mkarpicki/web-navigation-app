describe('NavigationController', function () {

    "use strict";

    var $rootScope,
        $scope,
        $controller,

        $sce,
        $routeParams,

        routingService,
        stateService,
        mapApiService,
        events,
        config;

    beforeEach(module('navigationApp.controllers'));

    beforeEach(inject(function (_$rootScope_, _$sce_, _$controller_) {

        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = $rootScope.$new();

        $sce = _$sce_;
        $routeParams = {};

        routingService = {
            getResults: function () {},
            saveRoute: function () {},
            calculateWithTrafficEnabled: function () {}
        };

        stateService = {
            getSearchCriteria: function () {
                return {
                    wayPoints: [],
                    areasToAvoid: []
                };
            },
            setWayPoints: function () {},
            setAreasToAvoid: function () {},
            enableNavigationMode: function () {},
            disableNavigationMode: function (){},
            back: function () {}
        };

        config = {
            NUMBER_OF_METERS_FROM_WAY_POINT_TO_MARK_AS_VISITED: 10,
            NUMBER_OF_METERS_FROM_ROUTE_TO_RECALCULATE: 10,
            NUMBER_OF_METERS_OF_POSITION_CHANGED_TO_REACT: 5
        };

        events = {
            POSITION_EVENT: 0,
            POSITION_EVENT_TYPES: {
                CHANGE: 0,
                ANY_OTHER_THEN_CHANGE: -1
            }
        };

        mapApiService = {
            distance: function () {},
            centerToRoute: function () {}
        }

    }));

    describe('when index of existing routes provided', function () {

        describe('when route with such a index exists', function () {

            it ('should save route to own scope and call state service to enable navigation mode', function () {

                var routes = [
                    {},
                    {}
                ];

                $routeParams.index = 1;

                routingService.getResults = jasmine.createSpy('routingService.getResults').and.returnValue(routes);
                stateService.enableNavigationMode = jasmine.createSpy('stateService.enableNavigationMode');

                $controller("NavigationController", {
                    $scope: $scope,
                    $sce: $sce,
                    $routeParams: $routeParams,
                    routingService: routingService,
                    stateService: stateService,
                    mapApiService: mapApiService,
                    config: config,
                    events: events
                });

                $scope.$on = jasmine.createSpy('$scope.$on');

                $scope.$apply();

                expect(routingService.getResults).toHaveBeenCalled();
                expect($scope.undefinedRoute).toEqual(false);
                expect($scope.route).toEqual(routes[$routeParams.index]);
                expect(stateService.enableNavigationMode).toHaveBeenCalled();

            });

        });

        describe('when route with such a index does not exist', function () {

            it ('should not save route to own scope', function () {

                var routes = [
                    {},
                    {}
                ];

                $routeParams.index = 666;

                routingService.getResults = jasmine.createSpy('routingService.getResults').and.returnValue(routes);

                $controller("NavigationController", {
                    $scope: $scope,
                    $sce: $sce,
                    $routeParams: $routeParams,
                    routingService: routingService,
                    stateService: stateService,
                    mapApiService: mapApiService,
                    config: config,
                    events: events
                });

                $scope.$apply();

                expect(routingService.getResults).toHaveBeenCalled();
                expect($scope.undefinedRoute).toEqual(true);
                expect($scope.route).toEqual(null);

            });

        });

    });

    describe('when index of existing routes NOT provided', function () {

        it ('should not save route to own scope', function () {

            $routeParams.index = null;

            routingService.getResults = jasmine.createSpy('routingService.getResults');

            $controller("NavigationController", {
                $scope: $scope,
                $sce: $sce,
                $routeParams: $routeParams,
                routingService: routingService,
                stateService: stateService,
                mapApiService: mapApiService,
                config: config,
                events: events
            });

            $scope.$apply();

            expect(routingService.getResults).not.toHaveBeenCalled();
            expect($scope.undefinedRoute).toEqual(true);
            expect($scope.route).toEqual(null);

        });

    });


    describe('trustedText', function (){

        it ('should return text with HTML', function () {

            var html = '<h1>hello world</h1>';

            $controller("NavigationController", {
                $scope: $scope,
                $sce: $sce,
                $routeParams: $routeParams,
                routingService: routingService,
                stateService: stateService,
                mapApiService: mapApiService,
                config: config,
                events: events
            });

            $scope.$apply();

            var textWithHTML = $scope.trustedText(html);

            expect(textWithHTML.toString()).toEqual($sce.trustAsHtml(html).toString());

        });

    });


    describe('getManeuver', function () {

        describe('and no route set in scope', function () {

            it('should return empty array', function () {

                $controller("NavigationController", {
                    $scope: $scope,
                    $sce: $sce,
                    $routeParams: $routeParams,
                    routingService: routingService,
                    stateService: stateService,
                    mapApiService: mapApiService,
                    config: config,
                    events: events
                });

                $scope.$apply();

                $scope.route = null;

                expect($scope.getManeuver()).toEqual([]);

            });

        });

        describe('and route set in scope has no leg', function () {

            it('should return empty array', function () {

                $controller("NavigationController", {
                    $scope: $scope,
                    $sce: $sce,
                    $routeParams: $routeParams,
                    routingService: routingService,
                    stateService: stateService,
                    mapApiService: mapApiService,
                    config: config,
                    events: events
                });

                $scope.$apply();

                $scope.route = {};
                $scope.route.leg = null;

                expect($scope.getManeuver()).toEqual([]);

                $scope.route = {};
                $scope.route.leg = [];

                expect($scope.getManeuver()).toEqual([]);

            });

        });

        describe('and route set in scope has leg(s)', function () {

            it('should return maneuver from first leg', function () {

                var fakeManeuver = {};

                $controller("NavigationController", {
                    $scope: $scope,
                    $sce: $sce,
                    $routeParams: $routeParams,
                    routingService: routingService,
                    stateService: stateService,
                    mapApiService: mapApiService,
                    config: config,
                    events: events
                });

                $scope.$apply();

                $scope.route = {};
                $scope.route.leg = [{
                    maneuver: fakeManeuver
                }];

                expect($scope.getManeuver()).toEqual(fakeManeuver);

            });

        });

    });

    describe('when $locationChangeStart even fired', function () {

        it('should stop navigation Mode', function (){

            var routes = [
                {},
                {}
            ];

            var fakeEvent = {};

            $routeParams.index = 1;

            routingService.getResults = jasmine.createSpy('routingService.getResults').and.returnValue(routes);
            stateService.disableNavigationMode = jasmine.createSpy('stateService.enableNavigationMode');

            $controller("NavigationController", {
                $scope: $scope,
                $sce: $sce,
                $routeParams: $routeParams,
                routingService: routingService,
                stateService: stateService,
                mapApiService: mapApiService,
                config: config,
                events: events
            });

            $scope.$apply();

            $scope.$emit('$locationChangeStart', fakeEvent);

            expect(stateService.disableNavigationMode).toHaveBeenCalled();

        });

    });

    describe('when POSITION_EVENT event fired', function () {

        var fakeEventParams = {},
            fakePromise,
            newRoute,
            defaultRoute,

            wayPointsUsedForSearch,
            areasToAvoidUsedForSearch;

        beforeEach(function () {

            wayPointsUsedForSearch = [
                {
                    coordinates: {}
                },
                {
                    coordinates: {}
                }
            ];
            areasToAvoidUsedForSearch = [];

            stateService.getSearchCriteria = function () {
                return {
                    wayPoints: wayPointsUsedForSearch,
                    areasToAvoid: areasToAvoidUsedForSearch
                };
            };

            defaultRoute = {
                shape: [
                    '52,13',
                    '52.1,13,1'
                ],
                color: 'blue'
            };

            fakeEventParams.eventType = events.POSITION_EVENT_TYPES.CHANGE;
            fakeEventParams.param = {
                coords: {
                    latitude: 10,
                    longitude: 20
                }
            };

            routingService.getResults = function () {
                return [defaultRoute];
            };

            $routeParams.index = 0;

        });

        describe('and any different event type then POSITION_EVENT_TYPES.CHANGE', function () {

            it('should not react on position change', function () {

                fakeEventParams.eventType = events.POSITION_EVENT_TYPES.ANY_OTHER_THEN_CHANGE;

                $controller("NavigationController", {
                    $scope: $scope,
                    $sce: $sce,
                    $routeParams: $routeParams,
                    routingService: routingService,
                    stateService: stateService,
                    mapApiService: mapApiService,
                    config: config,
                    events: events
                });

                $scope.$apply();

                mapApiService.distance = jasmine.createSpy('mapApiService.distance');
                routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled');

                expect(mapApiService.distance).not.toHaveBeenCalled();

                $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                expect(routingService.calculateWithTrafficEnabled).not.toHaveBeenCalled();
                expect($scope.route).toEqual(defaultRoute);
            });
        });

        describe('and event type is POSITION_EVENT_TYPES.CHANGE', function () {

            describe('and location (position) not changed enough', function () {

                it('should not update routingService and it should keep old route in scope', function () {

                    mapApiService.distance = jasmine.createSpy('mapApiService.distance').and.returnValue(0);

                    fakePromise = {
                        then: function (success, failure) {
                            success(null);
                        }
                    };

                    newRoute = {};

                    $controller("NavigationController", {
                        $scope: $scope,
                        $sce: $sce,
                        $routeParams: $routeParams,
                        routingService: routingService,
                        stateService: stateService,
                        mapApiService: mapApiService,
                        config: config,
                        events: events
                    });

                    $scope.$apply();

                    $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                    wayPointsUsedForSearch[0] = {
                        title: '',
                        coordinates: {
                            latitude: fakeEventParams.param.coords.latitude,
                            longitude: fakeEventParams.param.coords.longitude
                        }
                    };

                    routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);


                    $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                    expect(routingService.calculateWithTrafficEnabled).not.toHaveBeenCalledWith(wayPointsUsedForSearch, areasToAvoidUsedForSearch);

                });

            });

            describe('and location (position) changed enough to react', function () {

                beforeEach(function () {

                    mapApiService.distance = function () {
                        return 100;
                    };

                });

                describe('and location is not on route anymore', function () {

                    describe('and routingService calculation succeed', function () {

                        beforeEach(function () {

                            fakePromise = {
                                then: function (success, failure) {
                                    success([newRoute]);
                                }
                            };

                        });

                        describe('and routingService did not return anything', function () {

                            it('should not update routingService and it should keep old route in scope', function () {

                                fakePromise = {
                                    then: function (success, failure) {
                                        success(null);
                                    }
                                };

                                newRoute = {};

                                $controller("NavigationController", {
                                    $scope: $scope,
                                    $sce: $sce,
                                    $routeParams: $routeParams,
                                    routingService: routingService,
                                    stateService: stateService,
                                    mapApiService: mapApiService,
                                    config: config,
                                    events: events
                                });

                                $scope.$apply();

                                routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                                wayPointsUsedForSearch[0] = {
                                    title: '',
                                    coordinates: {
                                        latitude: fakeEventParams.param.coords.latitude,
                                        longitude: fakeEventParams.param.coords.longitude
                                    }
                                };

                                $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                                expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalledWith(wayPointsUsedForSearch, areasToAvoidUsedForSearch);
                                //expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalled();

                                expect($scope.route).toEqual(defaultRoute);
                                expect($scope.recalculating).toEqual(false);

                            });

                        });

                        describe('and routingService did not found any routes', function () {

                            it('should not update routingService and it should keep old route in scope', function () {

                                fakePromise = {
                                    then: function (success, failure) {
                                        success([]);
                                    }
                                };

                                newRoute = {};

                                $controller("NavigationController", {
                                    $scope: $scope,
                                    $sce: $sce,
                                    $routeParams: $routeParams,
                                    routingService: routingService,
                                    stateService: stateService,
                                    mapApiService: mapApiService,
                                    config: config,
                                    events: events
                                });

                                $scope.$apply();

                                routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                                wayPointsUsedForSearch[0] = {
                                    title: '',
                                    coordinates: {
                                        latitude: fakeEventParams.param.coords.latitude,
                                        longitude: fakeEventParams.param.coords.longitude
                                    }
                                };

                                $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                                expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalledWith(wayPointsUsedForSearch, areasToAvoidUsedForSearch);
                                expect($scope.route).toEqual(defaultRoute);
                                expect($scope.recalculating).toEqual(false);

                            });

                        });

                        describe('and routingService found at least one route', function () {

                            describe('and not visited any wayPoints on route', function () {

                                it('should clear routes in routingService, save new route in it and update route in scope', function () {

                                    newRoute = {};

                                    $controller("NavigationController", {
                                        $scope: $scope,
                                        $sce: $sce,
                                        $routeParams: $routeParams,
                                        routingService: routingService,
                                        stateService: stateService,
                                        mapApiService: mapApiService,
                                        config: config,
                                        events: events
                                    });

                                    $scope.$apply();

                                    routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                                    wayPointsUsedForSearch[0] = {
                                        title: '',
                                        coordinates: {
                                            latitude: fakeEventParams.param.coords.latitude,
                                            longitude: fakeEventParams.param.coords.longitude
                                        }
                                    };

                                    $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                                    expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalledWith(wayPointsUsedForSearch, areasToAvoidUsedForSearch);
                                    expect($scope.route).toEqual(newRoute);
                                    expect($scope.recalculating).toEqual(false);

                                });
                            });

                            describe('and visited wayPoint on the route', function () {

                                it('should ignore wayPoint when recalculating route', function () {

                                    wayPointsUsedForSearch = [
                                        {
                                            title: 1,
                                            coordinates: 'wayPointCoordinate1'
                                        },
                                        {
                                            title: 2,
                                            coordinates: 'wayPointCoordinate2'
                                        },
                                        {
                                            title: 3,
                                            coordinates: 'wayPointCoordinate3'
                                        },
                                        {
                                            title: 4,
                                            coordinates: 'wayPointCoordinate4'
                                        }

                                    ];
                                    areasToAvoidUsedForSearch = [];

                                    stateService.getSearchCriteria = function () {
                                        return {
                                            wayPoints: wayPointsUsedForSearch,
                                            areasToAvoid: areasToAvoidUsedForSearch
                                        };
                                    };

                                    fakeEventParams.param.coords = {
                                        latitude: 'positionCoordinates',
                                        longitude: 'positionCoordinates'
                                    };

                                    //fake to make code thinking
                                    //that position is changing
                                    //but check if wayPoint is visited return true
                                    //for each iteration change waypoint (make wayPointCoordinate2 visited)
                                    mapApiService.distance = function (a, b) {
                                        if (a.coordinates === 'positionCoordinates' && b.coordinates == 'positionCoordinates') {
                                            return 100;
                                        } else if (b === 'wayPointCoordinate2') {
                                            return 0;
                                        }
                                        return 100;

                                    };

                                    newRoute = {
                                        shape: [
                                            'x,y',
                                            'a,b'
                                        ]
                                    };


                                    fakePromise = {
                                        then: function (success) {
                                            success([newRoute]);
                                        }
                                    };

                                    $controller("NavigationController", {
                                        $scope: $scope,
                                        $sce: $sce,
                                        $routeParams: $routeParams,
                                        routingService: routingService,
                                        stateService: stateService,
                                        mapApiService: mapApiService,
                                        config: config,
                                        events: events
                                    });

                                    $scope.$apply();

                                    routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                                    wayPointsUsedForSearch[0] = {
                                        title: '',
                                        coordinates: {
                                            latitude: fakeEventParams.param.coords.latitude,
                                            longitude: fakeEventParams.param.coords.longitude
                                        }
                                    };

                                    //prepare expected array without visited wayPoint
                                    wayPointsUsedForSearch = wayPointsUsedForSearch.filter(function(w) {
                                        return w.coordinates !== 'wayPointCoordinate2';
                                    });

                                    $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                                    expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalledWith(wayPointsUsedForSearch, areasToAvoidUsedForSearch);
                                    expect($scope.route).toEqual(newRoute);
                                    expect($scope.recalculating).toEqual(false);


                                });

                            });

                        });

                    });

                    describe('and routingService calculation failed', function () {

                        it('should not update routingService and it should keep old route in scope', function () {

                            fakePromise = {
                                then: function (success, failure) {
                                    failure(null);
                                }
                            };

                            newRoute = {};

                            $controller("NavigationController", {
                                $scope: $scope,
                                $sce: $sce,
                                $routeParams: $routeParams,
                                routingService: routingService,
                                stateService: stateService,
                                mapApiService: mapApiService,
                                config: config,
                                events: events
                            });

                            $scope.$apply();

                            routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                            wayPointsUsedForSearch[0] = {
                                title: '',
                                coordinates: {
                                    latitude: fakeEventParams.param.coords.latitude,
                                    longitude: fakeEventParams.param.coords.longitude
                                }
                            };

                            $scope.recalculating = true;

                            $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                            expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalledWith(wayPointsUsedForSearch, areasToAvoidUsedForSearch);
                            expect($scope.route).toEqual(defaultRoute);
                            expect($scope.recalculating).toEqual(false);

                        });

                    });

                });


            });

        });

    });

});