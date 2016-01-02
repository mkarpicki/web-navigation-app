describe('PageController', function () {

    "use strict";

    var $rootScope,
        $scope,
        $controller,

        $location,

        routingService,
        stateService,
        events,

        fakeDeSerializedQuery,
        fakeSerializedQuery,
        fakeEventParams,

        fakeGeoParam,
        fakeEventType;

    beforeEach(module('navigationApp.controllers'));

    beforeEach(inject(function (_$rootScope_, _$controller_) {

        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = $rootScope.$new();

        $location = {
            url: function () {}
        };

        routingService = {
            clearResults: function () {}
        };

        fakeDeSerializedQuery = {
            wayPoints: [],
            areasToAvoid: []
        };

        fakeSerializedQuery = "param=value";

        fakeGeoParam = {
            latitude: '52',
            longitude: '13'
        };

        fakeEventParams = {
            geoParam: fakeGeoParam,
            eventType: fakeEventType
        };

        stateService = {
            clear: function () {},
            setWayPoints: function () {},
            setAreasToAvoid: function () {},
            serializeQuery: function () {
                return fakeSerializedQuery;
            },
            deserializeQuery: function () {
                return fakeDeSerializedQuery;
            },
            overwriteStartPoint: function () {}
        };

        /**
         * @todo - maybe load reall events value instead o creating copied mock
         * @type {{MAP_EVENT: string, MAP_EVENT_TYPES: {}}}
         */
        events = {
            MAP_EVENT: "MAP_EVENT",
            MAP_EVENT_TYPES: {
                OVERWRITE_START_POINT: 0,
                ADD_WAY_POINT: 1,
                OVERWRITE_DESTINATION_POINT: 2,
                AVOID_AREA: 3
            }
        };

    }));

    describe('pageReady', function () {

        it('should set $scope.ready to true', function () {

            $controller("PageController", {
                $scope: $scope,
                events: events,
                routingService: routingService,
                stateService: stateService
            });

            $scope.$apply();

            expect($scope.ready).toEqual(false);

            $scope.pageReady();

            expect($scope.ready).toEqual(true);

        });

    });

    describe('when MAP_EVENT fired', function () {

        it ('should change url to "/" and searchQuery', function () {

            $location.url = jasmine.createSpy('$location.url');
            stateService.serializeQuery = jasmine.createSpy('stateService.serializeQuery').and.returnValue(fakeSerializedQuery);
            routingService.clearResults = jasmine.createSpy('routingService.clearResults');

            $controller("PageController", {
                $scope: $scope,
                $location: $location,
                events: events,
                routingService: routingService,
                stateService: stateService
            });

            $scope.$apply();

            $scope.$emit(events.MAP_EVENT, fakeEventParams);

            expect(stateService.serializeQuery).toHaveBeenCalled();
            expect($location.url).toHaveBeenCalledWith("/?" + fakeSerializedQuery);
            expect(routingService.clearResults).toHaveBeenCalled();
        });

        describe('when event type equal OVERWRITE_START_POINT', function () {

            it('should call stateService.overwriteStartPoint', function () {

                stateService.overwriteStartPoint = jasmine.createSpy('stateService.overwriteStartPoint');

                fakeEventParams.eventType = events.MAP_EVENT_TYPES.OVERWRITE_START_POINT;

                $controller("PageController", {
                    $scope: $scope,
                    $location: $location,
                    events: events,
                    routingService: routingService,
                    stateService: stateService
                });

                $scope.$apply();

                $scope.$emit(events.MAP_EVENT, fakeEventParams);

                expect(stateService.overwriteStartPoint).toHaveBeenCalledWith(fakeGeoParam.latitude + "," + fakeGeoParam.longitude);

            });

        });

        describe('when event type equal OVERWRITE_DESTINATION_POINT', function () {

            it('should call stateService.overwriteDestinationPoint', function () {

                stateService.overwriteDestinationPoint = jasmine.createSpy('stateService.overwriteDestinationPoint');

                fakeEventParams.eventType = events.MAP_EVENT_TYPES.OVERWRITE_DESTINATION_POINT;

                $controller("PageController", {
                    $scope: $scope,
                    $location: $location,
                    events: events,
                    routingService: routingService,
                    stateService: stateService
                });

                $scope.$apply();

                $scope.$emit(events.MAP_EVENT, fakeEventParams);

                expect(stateService.overwriteDestinationPoint).toHaveBeenCalledWith(fakeGeoParam.latitude + "," + fakeGeoParam.longitude);

            });

        });

        describe('when event type equal ADD_WAY_POINT', function () {

            it('should call stateService.overwriteDestinationPoint', function () {

                stateService.addWayPoint = jasmine.createSpy('stateService.addWayPoint');

                fakeEventParams.eventType = events.MAP_EVENT_TYPES.ADD_WAY_POINT;

                $controller("PageController", {
                    $scope: $scope,
                    $location: $location,
                    events: events,
                    routingService: routingService,
                    stateService: stateService
                });

                $scope.$apply();

                $scope.$emit(events.MAP_EVENT, fakeEventParams);

                expect(stateService.addWayPoint).toHaveBeenCalledWith(fakeGeoParam.latitude + "," + fakeGeoParam.longitude);

            });

        });

        describe('when event type equal AVOID_AREA', function () {

            it('should call stateService.overwriteDestinationPoint', function () {

                stateService.addAreaToAvoid = jasmine.createSpy('stateService.addAreaToAvoid');

                fakeEventParams.eventType = events.MAP_EVENT_TYPES.AVOID_AREA;

                $controller("PageController", {
                    $scope: $scope,
                    $location: $location,
                    events: events,
                    routingService: routingService,
                    stateService: stateService
                });

                $scope.$apply();

                fakeEventParams.geoParam = {
                    topLeft: {
                        latitude: 1,
                        longitude: 2
                    },
                    bottomRight: {
                        latitude: 3,
                        longitude: 4
                    }
                };

                $scope.$emit(events.MAP_EVENT, fakeEventParams);

                expect(stateService.addAreaToAvoid).toHaveBeenCalledWith(
                    fakeEventParams.geoParam.topLeft.latitude + "," + fakeEventParams.geoParam.topLeft.longitude + ";" +
                    fakeEventParams.geoParam.bottomRight.latitude + "," + fakeEventParams.geoParam.bottomRight.longitude
                );

            });

        });

    });

});