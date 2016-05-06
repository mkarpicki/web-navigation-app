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

            describe('when stateService.getRoutes result is empty', function () {

                describe('and search criteria were NOT defined', function () {

                    it ('should set notEnoughInformation in scope', function () {

                        stateService.getSearchCriteria = function () {
                            return {
                                wayPoints: [],
                                areasToAvoid: []
                            }
                        };

                        stateService.getRoutes = jasmine.createSpy('stateService.getRoutes').and.returnValue(null);

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

                });

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

                    describe('and routingService can not deliver empty array of routes', function () {

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
                                { summary: {
                                    text: 'route1'
                                }}
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

                            stateService.getRoutes = jasmine.createSpy('stateService.getRoutes').and.returnValue([]);

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

                            expect($scope.routes).toEqual(routes);

                            expect(mapApiService.centerToRoute).toHaveBeenCalledWith(routes[0]);

                        });

                        describe('and two returned routes are same', function () {

                            it ('should set route only once', function () {

                                var routes = [
                                    { summary: {
                                        text: 'route1'
                                    }},
                                    { summary: {
                                        text: 'route1'
                                    }},
                                    { summary: {
                                        text: 'route2'
                                    }}
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

                                stateService.getRoutes = jasmine.createSpy('stateService.getRoutes').and.returnValue([]);

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
                                expect($scope.routes[0]).toEqual(routes[0]);
                                expect($scope.routes[1]).toEqual(routes[2]);


                                expect(mapApiService.centerToRoute).toHaveBeenCalledWith(routes[0]);

                            });

                        });

                    });


                });

            });

        });

    });

    //describe('when initialised', function () {
    //
    //    it('should reset scope variables and routes in routeService', function () {
    //
    //        stateService.clearRoutes = jasmine.createSpy('stateService.clearRoutes');
    //
    //        $controller("SearchController", {
    //            $scope: $scope,
    //            $sce: $sce,
    //            routingService: routingService,
    //            colorThemesService: colorThemesService,
    //            stateService: stateService,
    //            mapApiService: mapApiService
    //        });
    //
    //        $scope.$apply();
    //
    //        expect(stateService.clearRoutes).toHaveBeenCalled();
    //        expect($scope.routes).toEqual([]);
    //        expect($scope.noRouteFound).toEqual(false);
    //        //expect($scope.notEnoughInformation).toEqual(true);
    //
    //    });
    //
    //    describe('and no wayPoints delivered in stateService', function () {
    //
    //        it('should set in scope notEnoughInformation value', function () {
    //
    //
    //            fakeDeSerializedQuery = {
    //                wayPoints: [],
    //                areasToAvoid: []
    //            };
    //
    //            $controller("SearchController", {
    //                $scope: $scope,
    //                $sce: $sce,
    //                routingService: routingService,
    //                colorThemesService: colorThemesService,
    //                stateService: stateService,
    //                mapApiService: mapApiService
    //            });
    //
    //            $scope.$apply();
    //
    //            expect($scope.notEnoughInformation).toEqual(true);
    //
    //        });
    //
    //    });
    //
    //
    //    describe('and at least two wayPoints delivered in stateService', function () {
    //
    //        describe('and at least one are to avoid delivered in stateService', function () {
    //
    //            it ('should call routing service with both arrays', function () {
    //
    //                fakeDeSerializedQuery.wayPoints = [
    //                    {
    //                        title: '',
    //                        coordinates: {
    //                            latitude: 1,
    //                            longitude: 2
    //                        }
    //                    },
    //                    {
    //                        title: '',
    //                        coordinates: {
    //                            latitude: 3,
    //                            longitude: 4
    //                        }
    //                    }
    //                ];
    //                fakeDeSerializedQuery.areasToAvoid = [
    //                    {
    //                        title: '',
    //                        boundingBox: {
    //                            topLeft: {
    //                                latitude: 1,
    //                                longitude: 2
    //                            },
    //                            bottomRight: {
    //                                latitude: 1,
    //                                longitude: 2
    //                            }
    //                        }
    //                    }
    //                ];
    //
    //                var fakePromise = {
    //                    then: function () {}
    //                };
    //
    //                routingService.calculateWithTrafficDisabled = jasmine.createSpy('routingService.calculateWithTrafficDisabled').and.returnValue(fakePromise);
    //                routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficDisabled').and.returnValue(fakePromise);
    //
    //                stateService.deserializeQuery = function () {
    //                    return fakeDeSerializedQuery;
    //                };
    //
    //                $controller("SearchController", {
    //                    $scope: $scope,
    //                    $sce: $sce,
    //                    routingService: routingService,
    //                    colorThemesService: colorThemesService,
    //                    stateService: stateService,
    //                    mapApiService: mapApiService
    //                });
    //
    //                $scope.$apply();
    //
    //                expect(routingService.calculateWithTrafficDisabled).toHaveBeenCalledWith(fakeDeSerializedQuery.wayPoints, fakeDeSerializedQuery.areasToAvoid);
    //                expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalledWith(fakeDeSerializedQuery.wayPoints, fakeDeSerializedQuery.areasToAvoid);
    //
    //            });
    //
    //        });
    //
    //        it('should set in scope notEnoughInformation value to false', function () {
    //
    //            fakeDeSerializedQuery.wayPoints = [
    //                {
    //                    title: '',
    //                    coordinates: {
    //                        latitude: 1,
    //                        longitude: 2
    //                    }
    //                },
    //                {
    //                    title: '',
    //                    coordinates: {
    //                        latitude: 3,
    //                        longitude: 4
    //                    }
    //                }
    //            ];
    //
    //            $controller("SearchController", {
    //                $scope: $scope,
    //                $sce: $sce,
    //                routingService: routingService,
    //                colorThemesService: colorThemesService,
    //                stateService: stateService,
    //                mapApiService: mapApiService
    //            });
    //
    //            $scope.$apply();
    //
    //            expect($scope.notEnoughInformation).toEqual(false);
    //
    //        });
    //
    //        describe('but routingService rejected promised (failed)', function () {
    //
    //            it('should set in scope noRouteFound value to true', function () {
    //
    //                fakeRoutingServicePromise = {
    //                    then: function (callback, failureCallback) { failureCallback(); }
    //                };
    //
    //                fakeDeSerializedQuery.wayPoints = [
    //                    {
    //                        title: '',
    //                        coordinates: {
    //                            latitude: 1,
    //                            longitude: 2
    //                        }
    //                    },
    //                    {
    //                        title: '',
    //                        coordinates: {
    //                            latitude: 3,
    //                            longitude: 4
    //                        }
    //                    }
    //                ];
    //
    //                $controller("SearchController", {
    //                    $scope: $scope,
    //                    $sce: $sce,
    //                    routingService: routingService,
    //                    colorThemesService: colorThemesService,
    //                    stateService: stateService,
    //                    mapApiService: mapApiService
    //                });
    //
    //                $scope.$apply();
    //
    //                expect($scope.noRouteFound).toEqual(true);
    //
    //            });
    //
    //        });
    //
    //        describe('but no routes found', function () {
    //
    //            it('should set in scope noRouteFound value to true', function () {
    //
    //                fakeRoutingServicePromise = {
    //                    then: function (callback) { callback([]); }
    //                };
    //
    //                fakeDeSerializedQuery.wayPoints = [
    //                    {
    //                        title: '',
    //                        coordinates: {
    //                            latitude: 1,
    //                            longitude: 2
    //                        }
    //                    },
    //                    {
    //                        title: '',
    //                        coordinates: {
    //                            latitude: 3,
    //                            longitude: 4
    //                        }
    //                    }
    //                ];
    //
    //                $controller("SearchController", {
    //                    $scope: $scope,
    //                    $sce: $sce,
    //                    routingService: routingService,
    //                    colorThemesService: colorThemesService,
    //                    stateService: stateService,
    //                    mapApiService: mapApiService
    //                });
    //
    //                $scope.$apply();
    //
    //                expect($scope.noRouteFound).toEqual(true);
    //
    //            });
    //
    //        });
    //
    //        describe('and routes found', function () {
    //
    //            it('should set in scope routes', function () {
    //
    //                var wayPoints = [
    //                    {
    //                        title: '',
    //                        coordinates: {
    //                            latitude: 1,
    //                            longitude: 2
    //                        }
    //                    },
    //                    {
    //                        title: '',
    //                        coordinates: {
    //                            latitude: 3,
    //                            longitude: 4
    //                        }
    //                    }
    //                ];
    //
    //                var routes = [
    //                    { summary: { text: 'route1' }},
    //                    { summary: { text: 'route2' }}
    //                ];
    //
    //                var someTheme = colorThemesService.POSITIVE_THEME;
    //
    //                fakeRoutingServicePromise = {
    //                    then: function (callback) { callback(routes, someTheme , wayPoints); }
    //                };
    //
    //                fakeDeSerializedQuery.wayPoints = wayPoints;
    //
    //                stateService.getRoutes = jasmine.createSpy('stateService.getRoutes').and.returnValue(routes);
    //
    //                $controller("SearchController", {
    //                    $scope: $scope,
    //                    $sce: $sce,
    //                    routingService: routingService,
    //                    colorThemesService: colorThemesService,
    //                    stateService: stateService,
    //                    mapApiService: mapApiService
    //                });
    //
    //                $scope.$apply();
    //
    //                expect($scope.noRouteFound).toEqual(false);
    //                expect($scope.routes).toEqual(routes);
    //
    //                expect(stateService.getRoutes).toHaveBeenCalled();
    //
    //                expect($scope.routes).toEqual(routes);
    //
    //            });
    //
    //        });
    //
    //    });
    //
    //});

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