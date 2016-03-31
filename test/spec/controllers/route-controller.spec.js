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
            saveRoute: function () {}
        };

        stateService = {
            enableNavigationMode: function () {},
            disableNavigationMode: function (){},
            back: function () {}
        };

        events = {
            POSITION_EVENT: 0
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
                    { wayPointsUsedForSearch: []},
                    { wayPointsUsedForSearch: []}
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
                    { wayPointsUsedForSearch: []},
                    { wayPointsUsedForSearch: []}
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

});