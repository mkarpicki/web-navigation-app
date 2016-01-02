describe('FormController', function () {

    "use strict";

    var $rootScope,
        $scope,
        $controller,

        $location,
        $timeout,

        routingService,
        stateService,

        fakeDeSerializedQuery;

    beforeEach(module('navigationApp.controllers'));

    beforeEach(inject(function (_$rootScope_, _$controller_) {

        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = $rootScope.$new();

        $location = {
            url: function () {}
        };

        $timeout = function () {};

        routingService = {
            clearResults: function () {}
        };

        fakeDeSerializedQuery = {
            wayPoints: [],
            areasToAvoid: []
        };

        stateService = {
            clear: function () {},
            setWayPoints: function () {},
            setAreasToAvoid: function () {},
            serializeQuery: function () {},
            deserializeQuery: function () {
                return fakeDeSerializedQuery;
            }
        };

    }));

    describe('when initialized', function () {

        it('should clear results of routingService', function () {

            routingService.clearResults = jasmine.createSpy('routingService.clearResults');

            $controller("FormController", {
                $scope: $scope,
                $location: $location,
                $timeout: $timeout,
                routingService: routingService,
                stateService: stateService
            });

            $scope.$apply();

            expect(routingService.clearResults).toHaveBeenCalled();

        });

        describe('and way points kept in stateService', function () {

            it('should set start point, destination point and way points in scope', function () {

                fakeDeSerializedQuery.wayPoints = ['start', 'middle1', 'middle2', 'destination'];

                $controller("FormController", {
                    $scope: $scope,
                    $location: $location,
                    $timeout: $timeout,
                    routingService: routingService,
                    stateService: stateService
                });

                $scope.$apply();

                expect($scope.from).toEqual('start');
                expect($scope.to).toEqual('destination');
                expect($scope.wayPoints).toEqual([ 'middle1', 'middle2' ]);

            });

        });

        describe('and areas to avoid kept in stateService', function () {

            it('should set ares to avoid in scope', function () {

                fakeDeSerializedQuery.areasToAvoid = [1,2];

                $controller("FormController", {
                    $scope: $scope,
                    $location: $location,
                    $timeout: $timeout,
                    routingService: routingService,
                    stateService: stateService
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
                $timeout: $timeout,
                routingService: routingService,
                stateService: stateService
            });

            $scope.$apply();

            $scope.clear();

            expect(stateService.clear).toHaveBeenCalled();

        });

        it('should replace $location state to "/"', function () {

            stateService.clear = jasmine.createSpy('stateService.clear');

            $location.replace = jasmine.createSpy('$locationReplace');
            $location.url = jasmine.createSpy('$location.url').and.returnValue($location);

            $controller("FormController", {
                $scope: $scope,
                $location: $location,
                $timeout: $timeout,
                routingService: routingService,
                stateService: stateService
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
                $timeout: $timeout,
                routingService: routingService,
                stateService: stateService
            });

            $scope.$apply();

            expect($scope.wayPoints).toEqual([]);

            $scope.addWayPoint();

            expect($scope.wayPoints).toEqual(['']);

            $scope.addWayPoint();

            expect($scope.wayPoints).toEqual(['', '']);

        });

    });

    describe('onInputDefined', function () {

        it('should update url to "/" and add search query', function () {

            var searchQuery = 'some=query';

            $location.url = jasmine.createSpy('$location.url');

            stateService.serializeQuery = jasmine.createSpy('stateService.serializeQuery').and.returnValue(searchQuery);
            stateService.clear = jasmine.createSpy('stateService.clear');
            stateService.setWayPoints = jasmine.createSpy('stateService.setWayPoints');
            stateService.setAreasToAvoid = jasmine.createSpy('stateService.setAreasToAvoid');

            $controller("FormController", {
                $scope: $scope,
                $location: $location,
                $timeout: $timeout,
                routingService: routingService,
                stateService: stateService
            });

            $scope.$apply();

            $scope.areasToAvoid = [1,2,3];

            $scope.from = 'from';
            $scope.wayPoints = ['middle1', 'middle2'];
            $scope.to = 'destination';

            var allPoints = [$scope.from].concat($scope.wayPoints).concat($scope.to);

            $scope.onInputDefined();

            expect(stateService.clear).toHaveBeenCalled();
            expect(stateService.setWayPoints).toHaveBeenCalledWith(allPoints);
            expect(stateService.setAreasToAvoid).toHaveBeenCalledWith($scope.areasToAvoid);

            expect($location.url).toHaveBeenCalledWith('/?' + searchQuery);

        });

    });

    describe('removeWayPoint', function () {

        it('should remove way point by passed index', function () {

            $controller("FormController", {
                $scope: $scope,
                $location: $location,
                $timeout: $timeout,
                routingService: routingService,
                stateService: stateService
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
                $timeout: $timeout,
                routingService: routingService,
                stateService: stateService
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
                $timeout: $timeout,
                routingService: routingService,
                stateService: stateService
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
                $timeout: $timeout,
                routingService: routingService,
                stateService: stateService
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
                $location.url = jasmine.createSpy('$location.url').and.returnValue($location.replace);

                stateService.serializeQuery = jasmine.createSpy('stateService.serializeQuery').and.returnValue(searchQuery);

                $controller("FormController", {
                    $scope: $scope,
                    $location: $location,
                    $timeout: $timeout,
                    routingService: routingService,
                    stateService: stateService
                });

                $scope.$apply();

                $scope.from = null;
                $scope.to = '13.1';

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
                $location.url = jasmine.createSpy('$location.url').and.returnValue($location.replace);

                stateService.serializeQuery = jasmine.createSpy('stateService.serializeQuery').and.returnValue(searchQuery);

                $controller("FormController", {
                    $scope: $scope,
                    $location: $location,
                    $timeout: $timeout,
                    routingService: routingService,
                    stateService: stateService
                });

                $scope.$apply();

                $scope.from = '52.1';
                $scope.to = null;

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

                $timeout = jasmine.createSpy('$timeout').and.callFake(function () {

                    $timeout.calls.argsFor(0)[0]();
                });

                $controller("FormController", {
                    $scope: $scope,
                    $location: $location,
                    $timeout: $timeout,
                    routingService: routingService,
                    stateService: stateService
                });

                $scope.$apply();

                $scope.from = '52.1';
                $scope.to = '13.1';

                $scope.getRoute();

                expect($timeout).toHaveBeenCalledWith(jasmine.any(Function), 500);
                expect($location.url.calls.count()).toEqual(2);
                expect($location.url).toHaveBeenCalledWith('/?' + searchQuery);
                expect($location.url).toHaveBeenCalledWith('/search?' + searchQuery);
                expect($location.replace).toHaveBeenCalled();
                expect(stateService.serializeQuery).toHaveBeenCalled();

            });

        });

    });


});