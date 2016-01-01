describe('routingService', function () {

    'use strict';

    var config;

    beforeEach(module('navigationApp.services'));

    beforeEach(module(function ($provide) {

        config = {};
        config.APP_ID = 'someAppId';
        config.APP_CODE = 'someAppCode';
        $provide.value('config', config);

    }));

    describe('getResults & saveResults', function () {

       it('should get saved results', inject(function (routingService) {

           var route1 = 'r1',
               route2 = 'r2';

           routingService.saveRoute(route1);
           routingService.saveRoute(route2);

           var res = routingService.getResults();

           expect(res[0]).toEqual(route1);
           expect(res[1]).toEqual(route2);

       }))

   });

    describe('clearResults', function () {

        it('should get saved results', inject(function (routingService) {

            var route1 = 'r1',
                route2 = 'r2';

            routingService.saveRoute(route1);
            routingService.saveRoute(route2);

            var res = routingService.getResults();

            expect(res[0]).toEqual(route1);
            expect(res[1]).toEqual(route2);

            routingService.clearResults();

            expect(routingService.getResults().length).toEqual(0);

        }))

    });

    describe('calculateWithTrafficEnabled', function () {

        var waypoints,
            areasToAvoid,
            URL;

        beforeEach(function (){

            waypoints = [
                '52.5,13.4',
                '52.6,13.5'
            ];

            areasToAvoid = [
                '52.5,13.4;52.6,13.5',
                '52.7,13.6;52.8,13.7'
            ];

            URL = "https://route.api.here.com/routing/7.2/calculateroute.json?" +
                "app_id=" + config.APP_ID +
                "&app_code=" + config.APP_CODE +
                "{{wayPoints}}" +
                "{{avoidAreas}}" +
                "&alternatives={{alternatives}}" +
                "&legattributes=sm" +
                "&linkattributes=" +
                "&maneuverattributes=all" +
                "&metricSystem=metric" +
                "&mode=fastest;car;traffic:enabled;" + // <- (!)
                "&routeattributes=none,sh,wp,sm,bb,lg,no,li,tx" +
                "&transportModeType=car";

        });

        describe("when routes returned by http request", function () {

            it ('should call API with enabled traffic and get routes', inject(function (routingService, $httpBackend) {

                var returnedRoutes = [1,2,3];

                var url = URL;

                var wayPointsQuery = "&waypoint0=geo!" + waypoints[0] + "&waypoint1=geo!" + waypoints[1];

                var avoidAreasQuery = "&avoidareas=" + areasToAvoid[0] + "!" + areasToAvoid[1];

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficEnabled(waypoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });

        describe("when routes NOT returned by http request", function () {

            it ('should call API with enabled traffic and get empty array', inject(function (routingService, $httpBackend) {

                var returnedRoutes = [];

                var url = URL;

                var wayPointsQuery = "&waypoint0=geo!" + waypoints[0] + "&waypoint1=geo!" + waypoints[1];

                var avoidAreasQuery = "&avoidareas=" + areasToAvoid[0] + "!" + areasToAvoid[1];

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficEnabled(waypoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });


        describe("when http request failed", function () {

            it ('should call API with enabled traffic and get empty array', inject(function (routingService, $httpBackend) {

                var url = URL;

                var wayPointsQuery = "&waypoint0=geo!" + waypoints[0] + "&waypoint1=geo!" + waypoints[1];

                var avoidAreasQuery = "&avoidareas=" + areasToAvoid[0] + "!" + areasToAvoid[1];

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(500, null);


                routingService.calculateWithTrafficEnabled(waypoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual([]);
                });

                $httpBackend.flush();

            }));

        });

        describe("when http response has missing info", function () {

            it ('should call API with enabled traffic and get empty array', inject(function (routingService, $httpBackend) {

                var url = URL;

                var wayPointsQuery = "&waypoint0=geo!" + waypoints[0] + "&waypoint1=geo!" + waypoints[1];

                var avoidAreasQuery = "&avoidareas=" + areasToAvoid[0] + "!" + areasToAvoid[1];

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, null);


                routingService.calculateWithTrafficEnabled(waypoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual([]);
                });

                $httpBackend.flush();

            }));

        });

        describe("when no areas to avoid provided", function () {

            it ('should call API with enabled traffic and WITHOUT areas to avoid', inject(function (routingService, $httpBackend) {

                areasToAvoid = [];

                var returnedRoutes = [];

                var url = URL;

                var wayPointsQuery = "&waypoint0=geo!" + waypoints[0] + "&waypoint1=geo!" + waypoints[1];

                var avoidAreasQuery = "&avoidareas=";

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficEnabled(waypoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });

        describe("when more then two wayPoints delivered", function () {

            it ('should call API with enabled traffic and WITHOUT alternatives', inject(function (routingService, $httpBackend) {

                waypoints = [
                    '52.5,13.4',
                    '52.6,13.5',
                    '52.7,13.6'
                ];

                var returnedRoutes = [];

                var url = URL;

                var wayPointsQuery = "&waypoint0=geo!" + waypoints[0] + "&waypoint1=geo!" + waypoints[1] + "&waypoint2=geo!" + waypoints[2];

                var avoidAreasQuery = "&avoidareas=" + areasToAvoid[0] + "!" + areasToAvoid[1];

                url = url.replace("{{alternatives}}", 0);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficEnabled(waypoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });

    });

    describe('calculateWithTrafficDisabled', function () {

        var waypoints,
            areasToAvoid,
            URL;

        beforeEach(function (){

            waypoints = [
                '52.5,13.4',
                '52.6,13.5'
            ];

            areasToAvoid = [
                '52.5,13.4;52.6,13.5',
                '52.7,13.6;52.8,13.7'
            ];

            URL = "https://route.api.here.com/routing/7.2/calculateroute.json?" +
            "app_id=" + config.APP_ID +
            "&app_code=" + config.APP_CODE +
            "{{wayPoints}}" +
            "{{avoidAreas}}" +
            "&alternatives={{alternatives}}" +
            "&legattributes=sm" +
            "&linkattributes=" +
            "&maneuverattributes=all" +
            "&metricSystem=metric" +
            "&mode=fastest;car;traffic:disabled;" + // <- (!)
            "&routeattributes=none,sh,wp,sm,bb,lg,no,li,tx" +
            "&transportModeType=car";

        });

        describe("when routes returned by http request", function () {

            it ('should call API with enabled traffic and get routes', inject(function (routingService, $httpBackend) {

                var returnedRoutes = [1,2,3];

                var url = URL;

                var wayPointsQuery = "&waypoint0=geo!" + waypoints[0] + "&waypoint1=geo!" + waypoints[1];

                var avoidAreasQuery = "&avoidareas=" + areasToAvoid[0] + "!" + areasToAvoid[1];

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficDisabled(waypoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });

        describe("when routes NOT returned by http request", function () {

            it ('should call API with enabled traffic and get empty array', inject(function (routingService, $httpBackend) {

                var returnedRoutes = [];

                var url = URL;

                var wayPointsQuery = "&waypoint0=geo!" + waypoints[0] + "&waypoint1=geo!" + waypoints[1];

                var avoidAreasQuery = "&avoidareas=" + areasToAvoid[0] + "!" + areasToAvoid[1];

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficDisabled(waypoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });


        describe("when http request failed", function () {

            it ('should call API with enabled traffic and get empty array', inject(function (routingService, $httpBackend) {

                var url = URL;

                var wayPointsQuery = "&waypoint0=geo!" + waypoints[0] + "&waypoint1=geo!" + waypoints[1];

                var avoidAreasQuery = "&avoidareas=" + areasToAvoid[0] + "!" + areasToAvoid[1];

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(500, null);


                routingService.calculateWithTrafficDisabled(waypoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual([]);
                });

                $httpBackend.flush();

            }));

        });

        describe("when http response has missing info", function () {

            it ('should call API with enabled traffic and get empty array', inject(function (routingService, $httpBackend) {

                var url = URL;

                var wayPointsQuery = "&waypoint0=geo!" + waypoints[0] + "&waypoint1=geo!" + waypoints[1];

                var avoidAreasQuery = "&avoidareas=" + areasToAvoid[0] + "!" + areasToAvoid[1];

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, null);


                routingService.calculateWithTrafficDisabled(waypoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual([]);
                });

                $httpBackend.flush();

            }));

        });

        describe("when no areas to avoid provided", function () {

            it ('should call API with enabled traffic and WITHOUT areas to avoid', inject(function (routingService, $httpBackend) {

                areasToAvoid = [];

                var returnedRoutes = [];

                var url = URL;

                var wayPointsQuery = "&waypoint0=geo!" + waypoints[0] + "&waypoint1=geo!" + waypoints[1];

                var avoidAreasQuery = "&avoidareas=";

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficDisabled(waypoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });

        describe("when more then two wayPoints delivered", function () {

            it ('should call API with enabled traffic and WITHOUT alternatives', inject(function (routingService, $httpBackend) {

                waypoints = [
                    '52.5,13.4',
                    '52.6,13.5',
                    '52.7,13.6'
                ];

                var returnedRoutes = [];

                var url = URL;

                var wayPointsQuery = "&waypoint0=geo!" + waypoints[0] + "&waypoint1=geo!" + waypoints[1] + "&waypoint2=geo!" + waypoints[2];

                var avoidAreasQuery = "&avoidareas=" + areasToAvoid[0] + "!" + areasToAvoid[1];

                url = url.replace("{{alternatives}}", 0);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficDisabled(waypoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });

    });


});