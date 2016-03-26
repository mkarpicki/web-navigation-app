describe('SearchController', function () {

    "use strict";

    var $rootScope,
        $scope,
        $controller,

        $sce,
        $location,
        $window,

        routingService,
        colorThemesService,
        stateService,

        fakeDeSerializedQuery,
        fakeRoutingServicePromise;

    beforeEach(module('navigationApp.controllers'));

    beforeEach(inject(function (_$rootScope_, _$sce_, _$controller_) {

        //$location, $window, routingService, colorThemesService, stateService

        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = $rootScope.$new();

        $sce = _$sce_;

        $location = {};
        $window = {
            history: {
                back: function () {}
            }
        };

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
            deserializeQuery: function () {
                return fakeDeSerializedQuery;
            }
        };

    }));

    describe('when executed', function () {

        it('should reset scope variables and routes in routeService', function () {

            routingService.clearResults = jasmine.createSpy('routingService.clearResults');

            $controller("SearchController", {
                $scope: $scope,
                $sce: $sce,
                $location: $location,
                $window: $window,
                routingService: routingService,
                colorThemesService: colorThemesService,
                stateService: stateService
            });

            $scope.$apply();

            expect(routingService.clearResults).toHaveBeenCalled();
            expect($scope.routes).toEqual([]);
            expect($scope.noRouteFound).toEqual(false);
            //expect($scope.notEnoughInformation).toEqual(true);

        });

        describe('and no waypoints delivered in stateService', function () {

            it('should set in scope notEnoughInformation value', function () {

                fakeDeSerializedQuery = {
                    wayPoints: [],
                    areasToAvoid: []
                };

                $controller("SearchController", {
                    $scope: $scope,
                    $sce: $sce,
                    $location: $location,
                    $window: $window,
                    routingService: routingService,
                    colorThemesService: colorThemesService,
                    stateService: stateService
                });

                $scope.$apply();

                expect($scope.notEnoughInformation).toEqual(true);

            });

        });

        describe('and at least two waypoints delivered in stateService', function () {

            it('should set in scope notEnoughInformation value to false', function () {

                fakeDeSerializedQuery.wayPoints = [1,2];

                $controller("SearchController", {
                    $scope: $scope,
                    $sce: $sce,
                    $location: $location,
                    $window: $window,
                    routingService: routingService,
                    colorThemesService: colorThemesService,
                    stateService: stateService
                });

                $scope.$apply();

                expect($scope.notEnoughInformation).toEqual(false);

            });

            describe('but no routes found', function () {

                it('should set in scope noRouteFound value to true', function () {

                    fakeRoutingServicePromise = {
                        then: function (callback) { callback([]); }
                    };

                    fakeDeSerializedQuery.wayPoints = [1,2];

                    $controller("SearchController", {
                        $scope: $scope,
                        $sce: $sce,
                        $location: $location,
                        $window: $window,
                        routingService: routingService,
                        colorThemesService: colorThemesService,
                        stateService: stateService
                    });

                    $scope.$apply();

                    expect($scope.noRouteFound).toEqual(true);

                });

            });

            describe('and routes found', function () {

                it('should set in scope noRouteFound value to true', function () {

                    var wayPoints = [
                        {
                            coordinates: '52.1,13.1',
                            test: 'some-address-1'
                        },
                        {
                            coordinates: '52.2,13.2',
                            test: 'some-address-2'
                        }];

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
                        $location: $location,
                        $window: $window,
                        routingService: routingService,
                        colorThemesService: colorThemesService,
                        stateService: stateService
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

    describe('back', function () {

        it ('should go back in history', function () {

            $window.history.back = jasmine.createSpy('$history.back');

            $controller("SearchController", {
                $scope: $scope,
                $sce: $sce,
                $location: $location,
                $window: $window,
                routingService: routingService,
                colorThemesService: colorThemesService,
                stateService: stateService
            });

            $scope.$apply();

            $scope.back();

            expect($window.history.back).toHaveBeenCalled();

        });

    });

    describe('trustedText', function (){

        it ('should return text with HTML', function () {

            var html = '<h1>hello world</h1>';

            $controller("SearchController", {
                $scope: $scope,
                $sce: $sce,
                $location: $location,
                $window: $window,
                routingService: routingService,
                colorThemesService: colorThemesService,
                stateService: stateService
            });

            $scope.$apply();

            var textWithHTML = $scope.trustedText(html);

            expect(textWithHTML.toString()).toEqual($sce.trustAsHtml(html).toString());

        });

    });

});