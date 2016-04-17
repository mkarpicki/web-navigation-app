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
            getResults: function () {}
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

            it ('should save route to own scope', function () {

                var routes = [
                    {},
                    {}
                ];

                $routeParams.index = 1;

                routingService.getResults = jasmine.createSpy('routingService.getResults').and.returnValue(routes);

                $controller("RouteController", {
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
                expect($scope.undefinedRoute).toEqual(false);
                expect($scope.route).toEqual(routes[$routeParams.index]);

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

                $controller("RouteController", {
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

        it ('should save route to own scope', function () {

            $routeParams.index = null;

            routingService.getResults = jasmine.createSpy('routingService.getResults');

            $controller("RouteController", {
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

            $controller("RouteController", {
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

                $controller("RouteController", {
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

                $controller("RouteController", {
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

                $controller("RouteController", {
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

});