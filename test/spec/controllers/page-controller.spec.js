describe('PageController', function () {

    "use strict";

    var $rootScope,
        $scope,
        $controller,

        $location,

        stateService,
        geoLocationService,
        events,
        geoCoderService,

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
            url: function () {},
            hash: function () {}
        };

        geoLocationService = {
            watchPosition: function () {}
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
            getSearchCriteria: function () {
                return fakeDeSerializedQuery;
            },
            overwriteStartPoint: function () {},
            addDestinationPoint: function () {},

            clearRoutes: function () {},
            getRoutes: function () {}
        };

        var fakeGeoCoderPromise = {
            then: function (s) {
                s('some address');
            }
        };

        geoCoderService = {
            reverse: function () { return fakeGeoCoderPromise; }
        };


        /**
         * @todo - maybe load real events value instead o creating copied mock
         * @type {{MAP_EVENT: string, MAP_EVENT_TYPES: {}}}
         */
        events = {
            MAP_EVENT: "MAP_EVENT",
            POSITION_EVENT: 'POSITION_EVENT',
            NAVIGATION_STATE_EVENT: 'NAVIGATION_STATE_EVENT',

            MAP_EVENT_TYPES: {
                OVERWRITE_START_POINT: 0,
                ADD_WAY_POINT: 1,
                OVERWRITE_DESTINATION_POINT: 2,
                AVOID_AREA: 3,
                ADD_DESTINATION_POINT: 4
            },

            POSITION_EVENT_TYPES: {

                CHANGE: 0,
                ERROR: 1
            },

            NAVIGATION_STATE_EVENT_TYPES: {
                NAVIGATION_ON: 0,
                NAVIGATION_OFF: 1
            }
        };

    }));

    describe('onlyMapShown', function () {

        describe('when hash in url', function () {

            it('should return true', function () {

                $location.hash = jasmine.createSpy('$location.hash').and.returnValue(true);

                $controller("PageController", {
                    $scope: $scope,
                    $location: $location,
                    events: events,
                    stateService: stateService,
                    geoLocationService: geoLocationService,
                    geoCoderService: geoCoderService
                });

                $scope.$apply();

                expect($scope.onlyMapShown()).toEqual(true);

                expect($location.hash).toHaveBeenCalled();

            });

        });

        describe('when hash not in url', function () {

            it('should return false', function () {

                $location.hash = jasmine.createSpy('$location.hash').and.returnValue(false);

                $controller("PageController", {
                    $scope: $scope,
                    $location: $location,
                    events: events,
                    stateService: stateService,
                    geoLocationService: geoLocationService,
                    geoCoderService: geoCoderService
                });

                $scope.$apply();

                expect($scope.onlyMapShown()).toEqual(false);

                expect($location.hash).toHaveBeenCalled();


            });

        });

    });

    describe('pageReady', function () {

        it('should set $scope.ready to true', function () {

            $controller("PageController", {
                $scope: $scope,
                $location: $location,
                events: events,
                stateService: stateService,
                geoLocationService: geoLocationService,
                geoCoderService: geoCoderService
            });

            $scope.$apply();

            expect($scope.ready).toEqual(false);

            $scope.pageReady();

            expect($scope.ready).toEqual(true);

        });

    });

    describe('when NAVIGATION_EVENT fired', function () {

        describe('and navigation started', function () {

            it ('should set zoom level to navigationZoomLevel and flag to update position of map to true', function () {

                fakeEventParams.eventType = events.NAVIGATION_STATE_EVENT_TYPES.NAVIGATION_ON;

                $controller("PageController", {
                    $scope: $scope,
                    $location: $location,
                    events: events,
                    stateService: stateService,
                    geoLocationService: geoLocationService,
                    geoCoderService: geoCoderService
                });

                $scope.$apply();

                //reset it as it is tru on construction
                $scope.updateToPosition = false;

                expect($scope.zoomLevel).toEqual(14);
                expect($scope.updateToPosition).toEqual(false);

                $scope.$emit(events.NAVIGATION_STATE_EVENT, fakeEventParams);

                expect($scope.zoomLevel).toEqual(16);
                expect($scope.updateToPosition).toEqual(true);

            });

        });

        describe('and navigation stopped', function () {

            it ('should set zoom level to defaultZoomLevel and flag to update position of map to false', function () {

                fakeEventParams.eventType = events.NAVIGATION_STATE_EVENT_TYPES.NAVIGATION_OFF;

                $controller("PageController", {
                    $scope: $scope,
                    $location: $location,
                    events: events,
                    stateService: stateService,
                    geoLocationService: geoLocationService,
                    geoCoderService: geoCoderService
                });

                $scope.$apply();

                $scope.zoomLevel = 'anything';
                $scope.updateToPosition = true;

                $scope.$emit(events.NAVIGATION_STATE_EVENT, fakeEventParams);

                expect($scope.zoomLevel).toEqual(14);
                expect($scope.updateToPosition).toEqual(false);

            });

        });

        describe('and unknown event info came', function () {

            it ('should do nothing', function () {

                fakeEventParams.eventType = "undefined type";

                $controller("PageController", {
                    $scope: $scope,
                    $location: $location,
                    events: events,
                    stateService: stateService,
                    geoLocationService: geoLocationService,
                    geoCoderService: geoCoderService
                });

                $scope.$apply();

                $scope.zoomLevel = 'anything';
                $scope.updateToPosition = 'not sure';

                $scope.$emit(events.NAVIGATION_STATE_EVENT, fakeEventParams);

                $scope.zoomLevel = 'anything';
                $scope.updateToPosition = 'not sure';

            });

        });

    });

    describe('when POSITION_EVENT fired', function () {

        describe('position changed', function () {

            it ('should update currentPosition with position from event and set error on finding position to false', function () {

                fakeEventParams.eventType = events.POSITION_EVENT_TYPES.CHANGE;
                fakeEventParams.param = {
                    coords: {
                        latitude: 'lat',
                        longitude: 'lng'
                    }
                };

                $controller("PageController", {
                    $scope: $scope,
                    $location: $location,
                    events: events,
                    stateService: stateService,
                    geoLocationService: geoLocationService,
                    geoCoderService: geoCoderService
                });

                $scope.$apply();

                $scope.gettingLocationError = true;

                $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                //expect($scope.updateToPosition).toEqual(false);
                expect($scope.currentPosition).toEqual({
                    latitude: fakeEventParams.param.coords.latitude,
                    longitude: fakeEventParams.param.coords.longitude
                });
                expect($scope.gettingLocationError).toEqual(false);

            });

            describe('when event fired next time', function (){

                it('should not update updateToPosition flag anymore', function () {

                    fakeEventParams.eventType = events.POSITION_EVENT_TYPES.CHANGE;
                    fakeEventParams.param = {
                        coords: {
                            latitude: 'lat',
                            longitude: 'lng'
                        }
                    };

                    $controller("PageController", {
                        $scope: $scope,
                        $location: $location,
                        events: events,
                        stateService: stateService,
                        geoLocationService: geoLocationService,
                        geoCoderService: geoCoderService
                    });

                    $scope.$apply();

                    $scope.gettingLocationError = true;

                    $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                    //expect($scope.updateToPosition).toEqual(false);
                    expect($scope.currentPosition).toEqual({
                        latitude: fakeEventParams.param.coords.latitude,
                        longitude: fakeEventParams.param.coords.longitude
                    });
                    expect($scope.gettingLocationError).toEqual(false);


                    $scope.updateToPosition = true;
                    $scope.$emit(events.POSITION_EVENT, fakeEventParams);
                    expect($scope.updateToPosition).toEqual(true);

                });
            });

        });

        describe('error detected', function () {

            it ('should update set error on finding position to true', function () {

                fakeEventParams.eventType = events.POSITION_EVENT_TYPES.ERROR;
                fakeEventParams.param = {};

                $controller("PageController", {
                    $scope: $scope,
                    $location: $location,
                    events: events,
                    stateService: stateService,
                    geoLocationService: geoLocationService,
                    geoCoderService: geoCoderService
                });

                $scope.$apply();

                $scope.gettingLocationError = false;

                $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                expect($scope.gettingLocationError).toEqual(true);

            });

        });

        describe('unsupported state detected', function () {

            it ('should do nothing', function () {

                fakeEventParams.eventType = 'something unsupported';
                fakeEventParams.param = {};

                $controller("PageController", {
                    $scope: $scope,
                    $location: $location,
                    events: events,
                    stateService: stateService,
                    geoLocationService: geoLocationService,
                    geoCoderService: geoCoderService
                });

                $scope.$apply();

                $scope.gettingLocationError = false;

                $scope.$emit(events.POSITION_EVENT, fakeEventParams);

                expect($scope.gettingLocationError).toEqual(false);

            });

        });

    });

    describe('when stateService update routes', function () {

        it('should update routes object in scope', function () {

            var fakeRoutes = null;

            stateService.getRoutes = function () {
                return fakeRoutes;
            };

            $controller("PageController", {
                $scope: $scope,
                $location: $location,
                events: events,
                stateService: stateService,
                geoLocationService: geoLocationService,
                geoCoderService: geoCoderService
            });

            $scope.$apply();

            expect($scope.routes).toBeNull();

            fakeRoutes = [{}, {}];

            $scope.$apply();

            expect($scope.routes.length).toEqual(2);
        });

    });

    describe('when MAP_EVENT fired', function () {

        it ('should change url to "/" and searchQuery', function () {

            $location.url = jasmine.createSpy('$location.url');
            stateService.serializeQuery = jasmine.createSpy('stateService.serializeQuery').and.returnValue(fakeSerializedQuery);
            stateService.clearRoutes = jasmine.createSpy('stateService.clearRoutes');

            $controller("PageController", {
                $scope: $scope,
                $location: $location,
                events: events,
                stateService: stateService,
                geoLocationService: geoLocationService,
                geoCoderService: geoCoderService
            });

            $scope.$apply();

            $scope.$emit(events.MAP_EVENT, fakeEventParams);

            expect(stateService.serializeQuery).toHaveBeenCalled();
            expect($location.url).toHaveBeenCalledWith("/?" + fakeSerializedQuery);
            expect(stateService.clearRoutes).toHaveBeenCalled();
        });

        describe('when event type equal OVERWRITE_START_POINT', function () {

            it('should call stateService.overwriteStartPoint', function () {

                stateService.overwriteStartPoint = jasmine.createSpy('stateService.overwriteStartPoint');

                fakeEventParams.eventType = events.MAP_EVENT_TYPES.OVERWRITE_START_POINT;

                $controller("PageController", {
                    $scope: $scope,
                    $location: $location,
                    events: events,
                    stateService: stateService,
                    geoLocationService: geoLocationService,
                    geoCoderService: geoCoderService
                });

                $scope.$apply();

                $scope.$emit(events.MAP_EVENT, fakeEventParams);

                expect(stateService.overwriteStartPoint).toHaveBeenCalledWith({
                    coordinates: {
                        latitude: fakeGeoParam.latitude,
                        longitude: fakeGeoParam.longitude
                    },
                    title: 'some address'
                });

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
                    stateService: stateService,
                    geoLocationService: geoLocationService,
                    geoCoderService: geoCoderService
                });

                $scope.$apply();

                $scope.$emit(events.MAP_EVENT, fakeEventParams);

                expect(stateService.overwriteDestinationPoint).toHaveBeenCalledWith({
                    coordinates: {
                        latitude: fakeGeoParam.latitude,
                        longitude: fakeGeoParam.longitude
                    },
                    title: 'some address'
                });

            });

        });

        describe('when event type equal ADD_DESTINATION_POINT', function () {

            it('should call stateService.addDestinationPoint', function () {

                stateService.addDestinationPoint = jasmine.createSpy('stateService.addDestinationPoint');

                fakeEventParams.eventType = events.MAP_EVENT_TYPES.ADD_DESTINATION_POINT;

                $controller("PageController", {
                    $scope: $scope,
                    $location: $location,
                    events: events,
                    stateService: stateService,
                    geoLocationService: geoLocationService,
                    geoCoderService: geoCoderService
                });

                $scope.$apply();

                $scope.$emit(events.MAP_EVENT, fakeEventParams);

                expect(stateService.addDestinationPoint).toHaveBeenCalledWith({
                    coordinates: {
                        latitude: fakeGeoParam.latitude,
                        longitude: fakeGeoParam.longitude
                    },
                    title: 'some address'
                });

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
                    stateService: stateService,
                    geoLocationService: geoLocationService,
                    geoCoderService: geoCoderService
                });

                $scope.$apply();

                $scope.$emit(events.MAP_EVENT, fakeEventParams);

                expect(stateService.addWayPoint).toHaveBeenCalledWith({
                    coordinates: {
                        latitude: fakeGeoParam.latitude,
                        longitude: fakeGeoParam.longitude
                    },
                    title: 'some address'
                });

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
                    stateService: stateService,
                    geoLocationService: geoLocationService,
                    geoCoderService: geoCoderService
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

                //fakeEventParams.geoParam.bottomRight.latitude + "," + fakeEventParams.geoParam.bottomRight.longitude;

                $scope.$emit(events.MAP_EVENT, fakeEventParams);

                expect(stateService.addAreaToAvoid).toHaveBeenCalledWith({
                    boundingBox: fakeEventParams.geoParam,
                    title: 'some address'
                });

            });

        });

    });

});