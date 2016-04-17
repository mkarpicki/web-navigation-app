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
            getResults: function () {},
            clearResults: function () {},
            saveRoute: function () {},
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
            back: function () {}
        };

        mapApiService = {
            centerToRoute: function () {}
        };

    }));

    describe('when initialised', function () {

        it('should reset scope variables and routes in routeService', function () {

            routingService.clearResults = jasmine.createSpy('routingService.clearResults');

            $controller("SearchController", {
                $scope: $scope,
                $sce: $sce,
                routingService: routingService,
                colorThemesService: colorThemesService,
                stateService: stateService,
                mapApiService: mapApiService
            });

            $scope.$apply();

            expect(routingService.clearResults).toHaveBeenCalled();
            expect($scope.routes).toEqual([]);
            expect($scope.noRouteFound).toEqual(false);
            //expect($scope.notEnoughInformation).toEqual(true);

        });

        describe('and no wayPoints delivered in stateService', function () {

            it('should set in scope notEnoughInformation value', function () {

                fakeDeSerializedQuery = {
                    wayPoints: [],
                    areasToAvoid: []
                };

                $controller("SearchController", {
                    $scope: $scope,
                    $sce: $sce,
                    routingService: routingService,
                    colorThemesService: colorThemesService,
                    stateService: stateService,
                    mapApiService: mapApiService
                });

                $scope.$apply();

                expect($scope.notEnoughInformation).toEqual(true);

            });

        });


        describe('and at least two wayPoints delivered in stateService', function () {

            describe('and at lest one are to avoid delivered in stateService', function () {

                it ('should call routing service with both arrays', function () {

                    fakeDeSerializedQuery.wayPoints = [
                        {
                            title: '',
                            coordinates: {
                                latitude: 1,
                                longitude: 2
                            }
                        },
                        {
                            title: '',
                            coordinates: {
                                latitude: 3,
                                longitude: 4
                            }
                        }
                    ];
                    fakeDeSerializedQuery.areasToAvoid = [
                        {
                            title: '',
                            boundingBox: {
                                topLeft: {
                                    latitude: 1,
                                    longitude: 2
                                },
                                bottomRight: {
                                    latitude: 1,
                                    longitude: 2
                                }
                            }
                        }
                    ];

                    var fakePromise = {
                        then: function () {}
                    };

                    routingService.calculateWithTrafficDisabled = jasmine.createSpy('routingService.calculateWithTrafficDisabled').and.returnValue(fakePromise);
                    routingService.calculateWithTrafficEnabled = jasmine.createSpy('routingService.calculateWithTrafficDisabled').and.returnValue(fakePromise);

                    stateService.deserializeQuery = function () {
                        return fakeDeSerializedQuery;
                    };

                    $controller("SearchController", {
                        $scope: $scope,
                        $sce: $sce,
                        routingService: routingService,
                        colorThemesService: colorThemesService,
                        stateService: stateService,
                        mapApiService: mapApiService
                    });

                    $scope.$apply();

                    expect(routingService.calculateWithTrafficDisabled).toHaveBeenCalledWith(fakeDeSerializedQuery.wayPoints, fakeDeSerializedQuery.areasToAvoid);
                    expect(routingService.calculateWithTrafficEnabled).toHaveBeenCalledWith(fakeDeSerializedQuery.wayPoints, fakeDeSerializedQuery.areasToAvoid);

                });

            });

            it('should set in scope notEnoughInformation value to false', function () {

                fakeDeSerializedQuery.wayPoints = [
                    {
                        title: '',
                        coordinates: {
                            latitude: 1,
                            longitude: 2
                        }
                    },
                    {
                        title: '',
                        coordinates: {
                            latitude: 3,
                            longitude: 4
                        }
                    }
                ];

                $controller("SearchController", {
                    $scope: $scope,
                    $sce: $sce,
                    routingService: routingService,
                    colorThemesService: colorThemesService,
                    stateService: stateService,
                    mapApiService: mapApiService
                });

                $scope.$apply();

                expect($scope.notEnoughInformation).toEqual(false);

            });

            describe('but routingService rejected promised (failed)', function () {

                it('should set in scope noRouteFound value to true', function () {

                    fakeRoutingServicePromise = {
                        then: function (callback, failureCallback) { failureCallback(); }
                    };

                    fakeDeSerializedQuery.wayPoints = [
                        {
                            title: '',
                            coordinates: {
                                latitude: 1,
                                longitude: 2
                            }
                        },
                        {
                            title: '',
                            coordinates: {
                                latitude: 3,
                                longitude: 4
                            }
                        }
                    ];

                    $controller("SearchController", {
                        $scope: $scope,
                        $sce: $sce,
                        routingService: routingService,
                        colorThemesService: colorThemesService,
                        stateService: stateService,
                        mapApiService: mapApiService
                    });

                    $scope.$apply();

                    expect($scope.noRouteFound).toEqual(true);

                });

            });

            describe('but no routes found', function () {

                it('should set in scope noRouteFound value to true', function () {

                    fakeRoutingServicePromise = {
                        then: function (callback) { callback([]); }
                    };

                    fakeDeSerializedQuery.wayPoints = [
                        {
                            title: '',
                            coordinates: {
                                latitude: 1,
                                longitude: 2
                            }
                        },
                        {
                            title: '',
                            coordinates: {
                                latitude: 3,
                                longitude: 4
                            }
                        }
                    ];

                    $controller("SearchController", {
                        $scope: $scope,
                        $sce: $sce,
                        routingService: routingService,
                        colorThemesService: colorThemesService,
                        stateService: stateService,
                        mapApiService: mapApiService
                    });

                    $scope.$apply();

                    expect($scope.noRouteFound).toEqual(true);

                });

            });

            describe('and routes found', function () {

                it('should set in scope noRouteFound value to true', function () {

                    var wayPoints = [
                        {
                            title: '',
                            coordinates: {
                                latitude: 1,
                                longitude: 2
                            }
                        },
                        {
                            title: '',
                            coordinates: {
                                latitude: 3,
                                longitude: 4
                            }
                        }
                    ];

                    var routes = [1,2];

                    var someTheme = colorThemesService.POSITIVE_THEME;

                    fakeRoutingServicePromise = {
                        then: function (callback) { callback(routes, someTheme , wayPoints); }
                    };

                    fakeDeSerializedQuery.wayPoints = wayPoints;

                    routingService.getResults = jasmine.createSpy('routingService.getResults').and.returnValue(routes);
                    routingService.saveRoute = jasmine.createSpy('routingService.saveRoute');

                    colorThemesService.getColor = jasmine.createSpy('colorThemesService.getColor').and.returnValue('some-color');

                    $controller("SearchController", {
                        $scope: $scope,
                        $sce: $sce,
                        routingService: routingService,
                        colorThemesService: colorThemesService,
                        stateService: stateService,
                        mapApiService: mapApiService
                    });

                    $scope.$apply();

                    expect($scope.noRouteFound).toEqual(false);
                    expect($scope.routes).toEqual(routes);

                    expect(colorThemesService.getColor).toHaveBeenCalledWith(someTheme);
                    expect(routingService.saveRoute).toHaveBeenCalledWith(routes[0]);
                    expect(routingService.saveRoute).toHaveBeenCalledWith(routes[1]);
                    expect(routingService.getResults).toHaveBeenCalled();

                    expect($scope.routes).toEqual(routes);

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