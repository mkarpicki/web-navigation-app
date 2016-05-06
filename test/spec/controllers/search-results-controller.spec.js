describe('SearchController', function () {

    "use strict";

    var $rootScope,
        $scope,
        $controller,

        $sce,

        routingService,
        colorThemesService,
        stateService,
        mapApiService,

        fakeDeSerializedQuery,
        fakeRoutingServicePromise;

    beforeEach(module('navigationApp.controllers'));

    beforeEach(inject(function (_$rootScope_, _$sce_, _$controller_) {

        // $window, routingService, colorThemesService, stateService

        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = $rootScope.$new();

        $sce = _$sce_;

        fakeRoutingServicePromise = {
            then: function (c) { c(); }
        };

        routingService = {
            calculateWithTrafficDisabled: function () { return fakeRoutingServicePromise; },
            calculateWithTrafficEnabled: function () { return fakeRoutingServicePromise; }
        };

        colorThemesService = {
            NEGATIVE_THEME: 0,
            POSITIVE_THEME: 1,
            getColor: function () {}
        };

        fakeDeSerializedQuery = {
            wayPoints: [],
            areasToAvoid: []
        };

        stateService = {
            getSearchCriteria: function () {
                return fakeDeSerializedQuery;
            },
            addRoute: function () {},
            clearRoutes: function () {},
            getRoutes: function () { return []; }
        };

        mapApiService = {
            centerToRoute: function () {}
        };

    }));

    describe('when initialised', function () {

        describe('and stateService has routes saved', function () {

            it ('should assign returned routes to scope and to not call routingService to get new ones', function () {

                var routes = [
                    { title: 'r0', hidden: true },
                    { title: 'r1', hidden: true }
                ];

                stateService.getRoutes = jasmine.createSpy('stateService.getRoutes').and.returnValue(routes);

                routingService.calculateWithTrafficDisabled = jasmine.createSpy('routingService.calculateWithTrafficDisabled');
                routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficDisabled');

                $controller("SearchController", {
                    $scope: $scope,
                    $sce: $sce,
                    routingService: routingService,
                    colorThemesService: colorThemesService,
                    stateService: stateService,
                    mapApiService: mapApiService
                });

                $scope.$apply();

                expect(routingService.calculateWithTrafficDisabled).not.toHaveBeenCalled();
                expect(routingService.calculateWithTrafficEnabled).not.toHaveBeenCalled();

                expect($scope.routes.length).toEqual(2);
                expect($scope.routes[0]).toEqual({ title: 'r0', hidden: false });
                expect($scope.routes[1]).toEqual({ title: 'r1', hidden: false });

            });

        });

        describe('and stateService has no routes saved', function () {

            var fakePromise;

            beforeEach(function () {

                fakePromise = {
                    then: function () {}
                };

            });


            describe('when stateService.getRoutes result is empty arrays of routes', function () {

                describe('and search criteria were NOT defined', function () {

                    it ('should set notEnoughInformation in scope', function () {

                        stateService.getSearchCriteria = function () {
                            return {
                                wayPoints: [],
                                areasToAvoid: []
                            }
                        };

                        stateService.getRoutes = jasmine.createSpy('stateService.getRoutes').and.returnValue([]);

                        routingService.calculateWithTrafficDisabled = jasmine.createSpy('routingService.calculateWithTrafficDisabled').and.returnValue(fakePromise);
                        routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                        $controller("SearchController", {
                            $scope: $scope,
                            $sce: $sce,
                            routingService: routingService,
                            colorThemesService: colorThemesService,
                            stateService: stateService,
                            mapApiService: mapApiService
                        });

                        $scope.$apply();

                        expect(routingService.calculateWithTrafficDisabled).not.toHaveBeenCalled();
                        expect(routingService.calculateWithTrafficEnabled).not.toHaveBeenCalled();

                        expect($scope.notEnoughInformation).toEqual(true);

                    });

                });

                describe('and search criteria were defined', function () {

                    it ('should use routingService to find routes', function () {

                        stateService.getSearchCriteria = function () {
                            return {
                                wayPoints: [
                                    { coordinates: { latitude: 1, longitude: 2}},
                                    { coordinates: { latitude: 3, longitude: 4}}
                                ],
                                areasToAvoid: [
                                    {},
                                    {}
                                ]
                            }
                        };

                        stateService.getRoutes = jasmine.createSpy('stateService.getRoutes').and.returnValue([]);

                        routingService.calculateWithTrafficDisabled = jasmine.createSpy('routingService.calculateWithTrafficDisabled').and.returnValue(fakePromise);
                        routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                        $controller("SearchController", {
                            $scope: $scope,
                            $sce: $sce,
                            routingService: routingService,
                            colorThemesService: colorThemesService,
                            stateService: stateService,
                            mapApiService: mapApiService
                        });

                        $scope.$apply();

                        expect(routingService.calculateWithTrafficDisabled).toHaveBeenCalled();
                        expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalled();

                        expect($scope.notEnoughInformation).toEqual(false);

                    });

                    describe('and routingService can not deliver any routes', function () {

                        it ('should set in scope that noRouteFound', function () {

                            fakePromise = {
                                then: function (callback) {
                                    callback(null);
                                }
                            };

                            stateService.getSearchCriteria = function () {
                                return {
                                    wayPoints: [
                                        { coordinates: { latitude: 1, longitude: 2}},
                                        { coordinates: { latitude: 3, longitude: 4}}
                                    ],
                                    areasToAvoid: [
                                        {},
                                        {}
                                    ]
                                }
                            };

                            stateService.getRoutes = jasmine.createSpy('stateService.getRoutes').and.returnValue([]);

                            routingService.calculateWithTrafficDisabled = jasmine.createSpy('routingService.calculateWithTrafficDisabled').and.returnValue(fakePromise);
                            routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                            $controller("SearchController", {
                                $scope: $scope,
                                $sce: $sce,
                                routingService: routingService,
                                colorThemesService: colorThemesService,
                                stateService: stateService,
                                mapApiService: mapApiService
                            });

                            $scope.$apply();

                            expect(routingService.calculateWithTrafficDisabled).toHaveBeenCalled();
                            expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalled();

                            expect($scope.notEnoughInformation).toEqual(false);

                            expect($scope.noRouteFound).toEqual(true);

                        });

                    });

                    describe('and routingService deliver empty array of routes', function () {

                        it ('should set in scope that noRouteFound', function () {

                            fakePromise = {
                                then: function (callback) {
                                    callback([]);
                                }
                            };

                            stateService.getSearchCriteria = function () {
                                return {
                                    wayPoints: [
                                        { coordinates: { latitude: 1, longitude: 2}},
                                        { coordinates: { latitude: 3, longitude: 4}}
                                    ],
                                    areasToAvoid: [
                                        {},
                                        {}
                                    ]
                                }
                            };

                            stateService.getRoutes = jasmine.createSpy('stateService.getRoutes').and.returnValue([]);

                            routingService.calculateWithTrafficDisabled = jasmine.createSpy('routingService.calculateWithTrafficDisabled').and.returnValue(fakePromise);
                            routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                            $controller("SearchController", {
                                $scope: $scope,
                                $sce: $sce,
                                routingService: routingService,
                                colorThemesService: colorThemesService,
                                stateService: stateService,
                                mapApiService: mapApiService
                            });

                            $scope.$apply();

                            expect(routingService.calculateWithTrafficDisabled).toHaveBeenCalled();
                            expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalled();

                            expect($scope.notEnoughInformation).toEqual(false);

                            expect($scope.noRouteFound).toEqual(true);

                        });

                    });

                    describe('and routingService can deliver routes', function () {

                        it ('should not set in scope that noRouteFound but set routes', function () {

                            var routes = [
                                {
                                    summary: { text: 'route1' }
                                }
                            ];

                            fakePromise = {
                                then: function (callback) {
                                    callback(routes);
                                }
                            };

                            stateService.getSearchCriteria = function () {
                                return {
                                    wayPoints: [
                                        { coordinates: { latitude: 1, longitude: 2}},
                                        { coordinates: { latitude: 3, longitude: 4}}
                                    ],
                                    areasToAvoid: [
                                        {},
                                        {}
                                    ]
                                }
                            };

                            var foundRoutes = [];

                            stateService.getRoutes = jasmine.createSpy('stateService.getRoutes').and.returnValue(foundRoutes);
                            stateService.addRoute = jasmine.createSpy().and.callFake(function (r) {
                                foundRoutes.push(r);
                            });

                            routingService.calculateWithTrafficDisabled = jasmine.createSpy('routingService.calculateWithTrafficDisabled').and.returnValue(fakePromise);
                            routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                            mapApiService.centerToRoute = jasmine.createSpy('mapApiService.centerToRoute');

                            $controller("SearchController", {
                                $scope: $scope,
                                $sce: $sce,
                                routingService: routingService,
                                colorThemesService: colorThemesService,
                                stateService: stateService,
                                mapApiService: mapApiService
                            });

                            $scope.$apply();

                            expect(routingService.calculateWithTrafficDisabled).toHaveBeenCalled();
                            expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalled();
                            expect(stateService.addRoute).toHaveBeenCalledWith(routes[0]);

                            expect($scope.notEnoughInformation).toEqual(false);
                            expect($scope.noRouteFound).toEqual(false);

                            expect($scope.routes).toEqual(foundRoutes);

                            expect(mapApiService.centerToRoute).toHaveBeenCalledWith(foundRoutes[0]);

                        });

                        describe('and two returned routes are same', function () {

                            it ('should set route only once', function () {

                                var routes = [
                                    {
                                        summary: { text: 'route1' }
                                    },
                                    {
                                        summary: { text: 'route1' }
                                    },
                                    {
                                        summary: { text: 'route2' }
                                    }
                                ];

                                fakePromise = {
                                    then: function (callback) {
                                        callback(routes);
                                    }
                                };

                                stateService.getSearchCriteria = function () {
                                    return {
                                        wayPoints: [
                                            { coordinates: { latitude: 1, longitude: 2}},
                                            { coordinates: { latitude: 3, longitude: 4}}
                                        ],
                                        areasToAvoid: [
                                            {},
                                            {}
                                        ]
                                    }
                                };

                                var foundRoutes = [];

                                stateService.getRoutes = jasmine.createSpy('stateService.getRoutes').and.returnValue(foundRoutes);
                                stateService.addRoute = jasmine.createSpy().and.callFake(function (r) {
                                    foundRoutes.push(r);
                                });

                                routingService.calculateWithTrafficDisabled = jasmine.createSpy('routingService.calculateWithTrafficDisabled').and.returnValue(fakePromise);
                                routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                                mapApiService.centerToRoute = jasmine.createSpy('mapApiService.centerToRoute');

                                $controller("SearchController", {
                                    $scope: $scope,
                                    $sce: $sce,
                                    routingService: routingService,
                                    colorThemesService: colorThemesService,
                                    stateService: stateService,
                                    mapApiService: mapApiService
                                });

                                $scope.$apply();

                                expect(routingService.calculateWithTrafficDisabled).toHaveBeenCalled();
                                expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalled();

                                expect($scope.notEnoughInformation).toEqual(false);
                                expect($scope.noRouteFound).toEqual(false);

                                expect($scope.routes.length).toEqual(2);
                                expect($scope.routes[0]).toEqual(foundRoutes[0]);
                                expect($scope.routes[1]).toEqual(foundRoutes[1]);

                                expect(mapApiService.centerToRoute).toHaveBeenCalledWith(routes[0]);

                            });

                        });

                    });

                    describe('and routingService rejected promise (failed)', function () {

                        it('should set noRouteFound in scope', function () {

                            fakePromise = {
                                then: function (callback, errCallback) {
                                    errCallback();
                                }
                            };

                            stateService.getSearchCriteria = function () {
                                return {
                                    wayPoints: [
                                        { coordinates: { latitude: 1, longitude: 2}},
                                        { coordinates: { latitude: 3, longitude: 4}}
                                    ],
                                    areasToAvoid: [
                                        {},
                                        {}
                                    ]
                                }
                            };

                            stateService.getRoutes = jasmine.createSpy('stateService.getRoutes').and.returnValue([]);

                            routingService.calculateWithTrafficDisabled = jasmine.createSpy('routingService.calculateWithTrafficDisabled').and.returnValue(fakePromise);
                            routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficEnabled').and.returnValue(fakePromise);

                            $controller("SearchController", {
                                $scope: $scope,
                                $sce: $sce,
                                routingService: routingService,
                                colorThemesService: colorThemesService,
                                stateService: stateService,
                                mapApiService: mapApiService
                            });

                            $scope.$apply();

                            expect(routingService.calculateWithTrafficDisabled).toHaveBeenCalled();
                            expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalled();

                            expect($scope.notEnoughInformation).toEqual(false);

                            expect($scope.noRouteFound).toEqual(true);

                        });

                    });


                });

            });

        });

    });

    describe('trustedText', function (){

        it ('should return text with HTML', function () {

            var html = '<h1>hello world</h1>';

            $controller("SearchController", {
                $scope: $scope,
                $sce: $sce,
                routingService: routingService,
                colorThemesService: colorThemesService,
                stateService: stateService,
                mapApiService: mapApiService
            });

            $scope.$apply();

            var textWithHTML = $scope.trustedText(html);

            expect(textWithHTML.toString()).toEqual($sce.trustAsHtml(html).toString());

        });

    });

});