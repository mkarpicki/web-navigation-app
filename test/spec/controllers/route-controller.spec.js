describe('RouteController', function () {

    "use strict";

    var $rootScope,
        $scope,
        $controller,

        $sce,
        $routeParams,

        routingService,
        stateService,
        mapApiService,
        events;

    beforeEach(module('navigationApp.controllers'));

    beforeEach(inject(function (_$rootScope_, _$sce_, _$controller_) {

        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = $rootScope.$new();

        $sce = _$sce_;
        $routeParams = {};

        routingService = {
            getResults: function () {},
            clearResults: function () {},
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

            it ('should save route to own scope', function () {

                var routes = [
                    {},
                    {}
                ];

                $routeParams.index = 1;

                routingService.getResults = jasmine.createSpy('routingService.getResults').and.returnValue(routes);
                routingService.saveRoute = jasmine.createSpy('routingService.saveRoute');

                $controller("RouteController", {
                    $scope: $scope,
                    $sce: $sce,
                    $routeParams: $routeParams,
                    routingService: routingService,
                    stateService: stateService,
                    mapApiService: mapApiService,
                    events: events
                });

                $scope.$apply();

                expect(routingService.getResults).toHaveBeenCalled();
                expect(routingService.saveRoute).toHaveBeenCalledWith(routes[$routeParams.index]);
                expect($scope.undefinedRoute).toEqual(false);
                expect($scope.route).toEqual(routes[$routeParams.index]);

            });

        });

        describe('when route with such a index does not exist', function () {

            it ('should save route to own scope', function () {

                var routes = [
                    {},
                    {}
                ];

                $routeParams.index = 666;

                routingService.getResults = jasmine.createSpy('routingService.getResults').and.returnValue(routes);
                routingService.saveRoute = jasmine.createSpy('routingService.saveRoute');

                $controller("RouteController", {
                    $scope: $scope,
                    $sce: $sce,
                    $routeParams: $routeParams,
                    routingService: routingService,
                    stateService: stateService,
                    mapApiService: mapApiService,
                    events: events
                });

                $scope.$apply();

                expect(routingService.getResults).toHaveBeenCalled();
                expect(routingService.saveRoute).not.toHaveBeenCalled();
                expect($scope.undefinedRoute).toEqual(true);
                expect($scope.route).toEqual(null);

            });

        });

    });

    describe('when index of existing routes NOT provided', function () {

        it ('should save route to own scope', function () {

            $routeParams.index = null;

            routingService.getResults = jasmine.createSpy('routingService.getResults');
            routingService.saveRoute = jasmine.createSpy('routingService.saveRoute');

            $controller("RouteController", {
                $scope: $scope,
                $sce: $sce,
                $routeParams: $routeParams,
                routingService: routingService,
                stateService: stateService,
                mapApiService: mapApiService,
                events: events
            });

            $scope.$apply();

            expect(routingService.getResults).not.toHaveBeenCalled();
            expect(routingService.saveRoute).not.toHaveBeenCalled();
            expect($scope.undefinedRoute).toEqual(true);
            expect($scope.route).toEqual(null);

        });

    });

    describe('enableDriveMode', function () {

        it ('should set set driveModeEnabled to true and called stateService.enableNavigationMode', function () {

            stateService.enableNavigationMode = jasmine.createSpy('stateService.enableNavigationMode');

            $controller("RouteController", {
                $scope: $scope,
                $sce: $sce,
                $routeParams: $routeParams,
                routingService: routingService,
                stateService: stateService,
                mapApiService: mapApiService,
                events: events
            });

            $scope.$apply();

            $scope.driveModeEnabled = false;

            $scope.enableDriveMode();

            expect($scope.driveModeEnabled).toEqual(true);
            expect(stateService.enableNavigationMode).toHaveBeenCalled();

        });
    });

    describe('disableDriveMode', function () {

        it ('should set set driveModeEnabled to false and called stateService.disableNavigationMode', function () {

            stateService.disableNavigationMode = jasmine.createSpy('stateService.disableNavigationMode');

            $controller("RouteController", {
                $scope: $scope,
                $sce: $sce,
                $routeParams: $routeParams,
                routingService: routingService,
                stateService: stateService,
                mapApiService: mapApiService,
                events: events
            });

            $scope.$apply();

            $scope.driveModeEnabled = true;

            $scope.disableDriveMode();

            expect($scope.driveModeEnabled).toEqual(false);
            expect(stateService.disableNavigationMode).toHaveBeenCalled();

        });
    });

    describe('trustedText', function (){

        it ('should return text with HTML', function () {

            var html = '<h1>hello world</h1>';

            $controller("RouteController", {
                $scope: $scope,
                $sce: $sce,
                $routeParams: $routeParams,
                routingService: routingService,
                stateService: stateService,
                mapApiService: mapApiService,
                events: events
            });

            $scope.$apply();

            var textWithHTML = $scope.trustedText(html);

            expect(textWithHTML.toString()).toEqual($sce.trustAsHtml(html).toString());

        });

    });

    describe('back', function (){

        it('should call stateService.back', function () {

            stateService.back = jasmine.createSpy('stateService.back');

            $controller("RouteController", {
                $scope: $scope,
                $sce: $sce,
                $routeParams: $routeParams,
                routingService: routingService,
                stateService: stateService,
                mapApiService: mapApiService,
                events: events
            });

            $scope.$apply();

            $scope.back();

            expect(stateService.back).toHaveBeenCalled();

        });

    });

    describe('getManeuver', function () {

        describe('and no route set in scope', function () {

            it('should return empty array', function () {

                $controller("RouteController", {
                    $scope: $scope,
                    $sce: $sce,
                    $routeParams: $routeParams,
                    routingService: routingService,
                    stateService: stateService,
                    mapApiService: mapApiService,
                    events: events
                });

                $scope.$apply();

                $scope.route = null;

                expect($scope.getManeuver()).toEqual([]);

            });

        });

        describe('and route set in scope has no leg', function () {

            it('should return empty array', function () {

                $controller("RouteController", {
                    $scope: $scope,
                    $sce: $sce,
                    $routeParams: $routeParams,
                    routingService: routingService,
                    stateService: stateService,
                    mapApiService: mapApiService,
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

                $controller("RouteController", {
                    $scope: $scope,
                    $sce: $sce,
                    $routeParams: $routeParams,
                    routingService: routingService,
                    stateService: stateService,
                    mapApiService: mapApiService,
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

    describe('when POSITION_EVENT event fired', function () {

        var fakeEventParams = {},
            driveModeEnabled,
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

        describe('and navigation mode is not enabled', function () {

            it('should not react on position change', function () {

                driveModeEnabled = false;

                $controller("RouteController", {
                    $scope: $scope,
                    $sce: $sce,
                    $routeParams: $routeParams,
                    routingService: routingService,
                    stateService: stateService,
                    mapApiService: mapApiService,
                    events: events
                });

                $scope.$apply();

                mapApiService.distance = jasmine.createSpy('mapApiService.distance');
                routingService.clearResults = jasmine.createSpy('routingService.clearResults');
                routingService.saveRoute = jasmine.createSpy('routingService.saveRoute');
                routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled');

                $scope.driveModeEnabled = driveModeEnabled;

                expect(mapApiService.distance).not.toHaveBeenCalled();

                $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                expect(routingService.calculateWithTrafficEnabled).not.toHaveBeenCalled();
                expect(routingService.clearResults).not.toHaveBeenCalled();
                expect(routingService.saveRoute).not.toHaveBeenCalledWith(newRoute);
                expect($scope.route).toEqual(defaultRoute);
            });
        });

        describe('and navigation mode is enabled', function () {

            beforeEach(function () {

                driveModeEnabled = true;

            });

            describe('and any different event type then POSITION_EVENT_TYPES.CHANGE', function () {

                it('should not react on position change', function () {

                    fakeEventParams.eventType = events.POSITION_EVENT_TYPES.ANY_OTHER_THEN_CHANGE;

                    $controller("RouteController", {
                        $scope: $scope,
                        $sce: $sce,
                        $routeParams: $routeParams,
                        routingService: routingService,
                        stateService: stateService,
                        mapApiService: mapApiService,
                        events: events
                    });

                    $scope.$apply();

                    mapApiService.distance = jasmine.createSpy('mapApiService.distance');
                    routingService.clearResults = jasmine.createSpy('routingService.clearResults');
                    routingService.saveRoute = jasmine.createSpy('routingService.saveRoute');
                    routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled');

                    $scope.driveModeEnabled = driveModeEnabled;

                    expect(mapApiService.distance).not.toHaveBeenCalled();

                    $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                    expect(routingService.calculateWithTrafficEnabled).not.toHaveBeenCalled();
                    expect(routingService.clearResults).not.toHaveBeenCalled();
                    expect(routingService.saveRoute).not.toHaveBeenCalledWith(newRoute);
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

                        $controller("RouteController", {
                            $scope: $scope,
                            $sce: $sce,
                            $routeParams: $routeParams,
                            routingService: routingService,
                            stateService: stateService,
                            mapApiService: mapApiService,
                            events: events
                        });

                        $scope.$apply();

                        $scope.driveModeEnabled = driveModeEnabled;

                        $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                        wayPointsUsedForSearch[0] = {
                            title: '',
                            coordinates: {
                                latitude: fakeEventParams.param.coords.latitude,
                                longitude: fakeEventParams.param.coords.longitude
                            }
                        };

                        routingService.clearResults = jasmine.createSpy('routingService.clearResults');
                        routingService.saveRoute = jasmine.createSpy('routingService.saveRoute');
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

                                    $controller("RouteController", {
                                        $scope: $scope,
                                        $sce: $sce,
                                        $routeParams: $routeParams,
                                        routingService: routingService,
                                        stateService: stateService,
                                        mapApiService: mapApiService,
                                        events: events
                                    });

                                    $scope.$apply();

                                    routingService.clearResults = jasmine.createSpy('routingService.clearResults');
                                    routingService.saveRoute = jasmine.createSpy('routingService.saveRoute');
                                    routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                                    $scope.driveModeEnabled = driveModeEnabled;

                                    wayPointsUsedForSearch[0] = {
                                        title: '',
                                        coordinates: {
                                            latitude: fakeEventParams.param.coords.latitude,
                                            longitude: fakeEventParams.param.coords.longitude
                                        }
                                    };

                                    $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                                    expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalledWith(wayPointsUsedForSearch, areasToAvoidUsedForSearch);
                                    expect(routingService.clearResults).not.toHaveBeenCalled();
                                    expect(routingService.saveRoute).not.toHaveBeenCalledWith(newRoute);
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

                                    $controller("RouteController", {
                                        $scope: $scope,
                                        $sce: $sce,
                                        $routeParams: $routeParams,
                                        routingService: routingService,
                                        stateService: stateService,
                                        mapApiService: mapApiService,
                                        events: events
                                    });

                                    $scope.$apply();

                                    routingService.clearResults = jasmine.createSpy('routingService.clearResults');
                                    routingService.saveRoute = jasmine.createSpy('routingService.saveRoute');
                                    routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                                    $scope.driveModeEnabled = driveModeEnabled;

                                    wayPointsUsedForSearch[0] = {
                                        title: '',
                                        coordinates: {
                                            latitude: fakeEventParams.param.coords.latitude,
                                            longitude: fakeEventParams.param.coords.longitude
                                        }
                                    };

                                    $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                                    expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalledWith(wayPointsUsedForSearch, areasToAvoidUsedForSearch);
                                    expect(routingService.clearResults).not.toHaveBeenCalled();
                                    expect(routingService.saveRoute).not.toHaveBeenCalledWith(newRoute);
                                    expect($scope.route).toEqual(defaultRoute);
                                    expect($scope.recalculating).toEqual(false);

                                });

                            });

                            describe('and routingService found at least one route', function () {

                                describe('and not visited any wayPoints on route', function () {

                                    it('should clear routes in routingService, save new route in it and update route in scope', function () {

                                        newRoute = {};

                                        $controller("RouteController", {
                                            $scope: $scope,
                                            $sce: $sce,
                                            $routeParams: $routeParams,
                                            routingService: routingService,
                                            stateService: stateService,
                                            mapApiService: mapApiService,
                                            events: events
                                        });

                                        $scope.$apply();

                                        routingService.clearResults = jasmine.createSpy('routingService.clearResults');
                                        routingService.saveRoute = jasmine.createSpy('routingService.saveRoute');
                                        routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                                        $scope.driveModeEnabled = driveModeEnabled;

                                        wayPointsUsedForSearch[0] = {
                                            title: '',
                                            coordinates: {
                                                latitude: fakeEventParams.param.coords.latitude,
                                                longitude: fakeEventParams.param.coords.longitude
                                            }
                                        };

                                        $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                                        expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalledWith(wayPointsUsedForSearch, areasToAvoidUsedForSearch);
                                        expect(routingService.clearResults).toHaveBeenCalled();
                                        expect(routingService.saveRoute).toHaveBeenCalledWith(newRoute);
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

                                        $controller("RouteController", {
                                            $scope: $scope,
                                            $sce: $sce,
                                            $routeParams: $routeParams,
                                            routingService: routingService,
                                            stateService: stateService,
                                            mapApiService: mapApiService,
                                            events: events
                                        });

                                        $scope.$apply();

                                        routingService.clearResults = jasmine.createSpy('routingService.clearResults');
                                        routingService.saveRoute = jasmine.createSpy('routingService.saveRoute');
                                        routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                                        $scope.driveModeEnabled = driveModeEnabled;

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
                                        expect(routingService.clearResults).toHaveBeenCalled();
                                        expect(routingService.saveRoute).toHaveBeenCalledWith(newRoute);
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

                                $controller("RouteController", {
                                    $scope: $scope,
                                    $sce: $sce,
                                    $routeParams: $routeParams,
                                    routingService: routingService,
                                    stateService: stateService,
                                    mapApiService: mapApiService,
                                    events: events
                                });

                                $scope.$apply();

                                routingService.clearResults = jasmine.createSpy('routingService.clearResults');
                                routingService.saveRoute = jasmine.createSpy('routingService.saveRoute');
                                routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                                $scope.driveModeEnabled = driveModeEnabled;

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
                                expect(routingService.clearResults).not.toHaveBeenCalled();
                                expect(routingService.saveRoute).not.toHaveBeenCalledWith(newRoute);
                                expect($scope.route).toEqual(defaultRoute);
                                expect($scope.recalculating).toEqual(false);

                            });

                        });

                    });


                });

            });

        });

    });

});