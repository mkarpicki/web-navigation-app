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

        var wayPoints,
            areasToAvoid,
            URL;

        beforeEach(function (){

            wayPoints = [
                { coordinates: { latitude: 52.5, longitude: 13.4} },
                { coordinates: { latitude: 52.6, longitude: 13.5} }
            ];

            areasToAvoid = [
                {
                    boundingBox: {
                        topLeft: { latitude: 52.5, longitude: 13.4 },
                        bottomRight: {latitude: 52.6, longitude: 13.5 }
                    }
                },
                {
                    boundingBox: {
                        topLeft: { latitude: 52.7, longitude: 13.6 },
                        bottomRight: {latitude: 52.8, longitude: 13.7 }
                    }
                }
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

                var strWayPoint0 = wayPoints[0].coordinates.latitude + "," + wayPoints[0].coordinates.longitude;
                var strWayPoint1 = wayPoints[1].coordinates.latitude + "," + wayPoints[1].coordinates.longitude;

                var wayPointsQuery = "&waypoint0=geo!" + strWayPoint0 + "&waypoint1=geo!" + strWayPoint1;

                var strAreasToAvoid0 = areasToAvoid[0].boundingBox.topLeft.latitude + ',' +
                        areasToAvoid[0].boundingBox.topLeft.longitude + ';' +
                        areasToAvoid[0].boundingBox.bottomRight.latitude + ',' +
                        areasToAvoid[0].boundingBox.bottomRight.longitude;

                var strAreasToAvoid1 = areasToAvoid[1].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[1].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[1].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[1].boundingBox.bottomRight.longitude;

                var avoidAreasQuery = "&avoidareas=" + strAreasToAvoid0 + "!" + strAreasToAvoid1;

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficEnabled(wayPoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });

        describe("when routes NOT returned by http request", function () {

            it ('should call API with enabled traffic and get empty array', inject(function (routingService, $httpBackend) {

                var returnedRoutes = [];

                var url = URL;

                var strWayPoint0 = wayPoints[0].coordinates.latitude + "," + wayPoints[0].coordinates.longitude;
                var strWayPoint1 = wayPoints[1].coordinates.latitude + "," + wayPoints[1].coordinates.longitude;

                var wayPointsQuery = "&waypoint0=geo!" + strWayPoint0 + "&waypoint1=geo!" + strWayPoint1;

                var strAreasToAvoid0 = areasToAvoid[0].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[0].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[0].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[0].boundingBox.bottomRight.longitude;

                var strAreasToAvoid1 = areasToAvoid[1].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[1].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[1].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[1].boundingBox.bottomRight.longitude;

                var avoidAreasQuery = "&avoidareas=" + strAreasToAvoid0 + "!" + strAreasToAvoid1;

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficEnabled(wayPoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });


        describe("when http request failed", function () {

            it ('should call API with enabled traffic and get empty array', inject(function (routingService, $httpBackend) {

                var url = URL;

                var strWayPoint0 = wayPoints[0].coordinates.latitude + "," + wayPoints[0].coordinates.longitude;
                var strWayPoint1 = wayPoints[1].coordinates.latitude + "," + wayPoints[1].coordinates.longitude;

                var wayPointsQuery = "&waypoint0=geo!" + strWayPoint0 + "&waypoint1=geo!" + strWayPoint1;

                var strAreasToAvoid0 = areasToAvoid[0].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[0].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[0].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[0].boundingBox.bottomRight.longitude;

                var strAreasToAvoid1 = areasToAvoid[1].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[1].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[1].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[1].boundingBox.bottomRight.longitude;

                var avoidAreasQuery = "&avoidareas=" + strAreasToAvoid0 + "!" + strAreasToAvoid1;

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(500, null);


                routingService.calculateWithTrafficEnabled(wayPoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual([]);
                });

                $httpBackend.flush();

            }));

        });

        describe("when http response has missing info", function () {

            it ('should call API with enabled traffic and get empty array', inject(function (routingService, $httpBackend) {

                var url = URL;

                var strWayPoint0 = wayPoints[0].coordinates.latitude + "," + wayPoints[0].coordinates.longitude;
                var strWayPoint1 = wayPoints[1].coordinates.latitude + "," + wayPoints[1].coordinates.longitude;

                var wayPointsQuery = "&waypoint0=geo!" + strWayPoint0 + "&waypoint1=geo!" + strWayPoint1;

                var strAreasToAvoid0 = areasToAvoid[0].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[0].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[0].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[0].boundingBox.bottomRight.longitude;

                var strAreasToAvoid1 = areasToAvoid[1].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[1].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[1].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[1].boundingBox.bottomRight.longitude;

                var avoidAreasQuery = "&avoidareas=" + strAreasToAvoid0 + "!" + strAreasToAvoid1;

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, null);


                routingService.calculateWithTrafficEnabled(wayPoints, areasToAvoid).then(function (routes) {
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

                var strWayPoint0 = wayPoints[0].coordinates.latitude + "," + wayPoints[0].coordinates.longitude;
                var strWayPoint1 = wayPoints[1].coordinates.latitude + "," + wayPoints[1].coordinates.longitude;

                var wayPointsQuery = "&waypoint0=geo!" + strWayPoint0 + "&waypoint1=geo!" + strWayPoint1;

                var avoidAreasQuery = "&avoidareas=";

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficEnabled(wayPoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });

        describe("when more then two wayPoints delivered", function () {

            it ('should call API with enabled traffic and WITHOUT alternatives', inject(function (routingService, $httpBackend) {

                wayPoints = [
                    { coordinates: { latitude: 52.5, longitude: 13.4} },
                    { coordinates: { latitude: 52.6, longitude: 13.5} },
                    { coordinates: { latitude: 52.7, longitude: 13.6} }
                ];

                var returnedRoutes = [];

                var url = URL;

                var strWayPoint0 = wayPoints[0].coordinates.latitude + "," + wayPoints[0].coordinates.longitude;
                var strWayPoint1 = wayPoints[1].coordinates.latitude + "," + wayPoints[1].coordinates.longitude;
                var strWayPoint2 = wayPoints[2].coordinates.latitude + "," + wayPoints[2].coordinates.longitude;

                var wayPointsQuery = "&waypoint0=geo!" + strWayPoint0 + "&waypoint1=geo!" + strWayPoint1 + "&waypoint2=geo!" + strWayPoint2;

                var strAreasToAvoid0 = areasToAvoid[0].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[0].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[0].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[0].boundingBox.bottomRight.longitude;

                var strAreasToAvoid1 = areasToAvoid[1].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[1].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[1].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[1].boundingBox.bottomRight.longitude;

                var avoidAreasQuery = "&avoidareas=" + strAreasToAvoid0 + "!" + strAreasToAvoid1;

                url = url.replace("{{alternatives}}", 0);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficEnabled(wayPoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });

    });

    describe('calculateWithTrafficDisabled', function () {

        var wayPoints,
            areasToAvoid,
            URL;

        beforeEach(function (){

            wayPoints = [
                { coordinates: { latitude: 52.5, longitude: 13.4}},
                { coordinates: { latitude: 52.6, longitude: 13.5}}
            ];

            areasToAvoid = [
                {
                    boundingBox: {
                        topLeft: { latitude: 52.5, longitude: 13.4 },
                        bottomRight: {latitude: 52.6, longitude: 13.5 }
                    }
                },
                {
                    boundingBox: {
                        topLeft: { latitude: 52.7, longitude: 13.6 },
                        bottomRight: {latitude: 52.8, longitude: 13.7 }
                    }
                }
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

                var strWayPoint0 = wayPoints[0].coordinates.latitude + "," + wayPoints[0].coordinates.longitude;
                var strWayPoint1 = wayPoints[1].coordinates.latitude + "," + wayPoints[1].coordinates.longitude;

                var wayPointsQuery = "&waypoint0=geo!" + strWayPoint0 + "&waypoint1=geo!" + strWayPoint1;

                var strAreasToAvoid0 = areasToAvoid[0].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[0].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[0].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[0].boundingBox.bottomRight.longitude;

                var strAreasToAvoid1 = areasToAvoid[1].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[1].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[1].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[1].boundingBox.bottomRight.longitude;

                var avoidAreasQuery = "&avoidareas=" + strAreasToAvoid0 + "!" + strAreasToAvoid1;

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficDisabled(wayPoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });

        describe("when routes NOT returned by http request", function () {

            it ('should call API with enabled traffic and get empty array', inject(function (routingService, $httpBackend) {

                var returnedRoutes = [];

                var url = URL;

                var strWayPoint0 = wayPoints[0].coordinates.latitude + "," + wayPoints[0].coordinates.longitude;
                var strWayPoint1 = wayPoints[1].coordinates.latitude + "," + wayPoints[1].coordinates.longitude;

                var wayPointsQuery = "&waypoint0=geo!" + strWayPoint0 + "&waypoint1=geo!" + strWayPoint1;

                var strAreasToAvoid0 = areasToAvoid[0].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[0].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[0].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[0].boundingBox.bottomRight.longitude;

                var strAreasToAvoid1 = areasToAvoid[1].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[1].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[1].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[1].boundingBox.bottomRight.longitude;

                var avoidAreasQuery = "&avoidareas=" + strAreasToAvoid0 + "!" + strAreasToAvoid1;

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficDisabled(wayPoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });


        describe("when http request failed", function () {

            it ('should call API with enabled traffic and get empty array', inject(function (routingService, $httpBackend) {

                var url = URL;

                var strWayPoint0 = wayPoints[0].coordinates.latitude + "," + wayPoints[0].coordinates.longitude;
                var strWayPoint1 = wayPoints[1].coordinates.latitude + "," + wayPoints[1].coordinates.longitude;

                var wayPointsQuery = "&waypoint0=geo!" + strWayPoint0 + "&waypoint1=geo!" + strWayPoint1;

                var strAreasToAvoid0 = areasToAvoid[0].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[0].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[0].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[0].boundingBox.bottomRight.longitude;

                var strAreasToAvoid1 = areasToAvoid[1].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[1].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[1].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[1].boundingBox.bottomRight.longitude;

                var avoidAreasQuery = "&avoidareas=" + strAreasToAvoid0 + "!" + strAreasToAvoid1;

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(500, null);


                routingService.calculateWithTrafficDisabled(wayPoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual([]);
                });

                $httpBackend.flush();

            }));

        });

        describe("when http response has missing info", function () {

            it ('should call API with enabled traffic and get empty array', inject(function (routingService, $httpBackend) {

                var url = URL;

                var strWayPoint0 = wayPoints[0].coordinates.latitude + "," + wayPoints[0].coordinates.longitude;
                var strWayPoint1 = wayPoints[1].coordinates.latitude + "," + wayPoints[1].coordinates.longitude;

                var wayPointsQuery = "&waypoint0=geo!" + strWayPoint0 + "&waypoint1=geo!" + strWayPoint1;

                var strAreasToAvoid0 = areasToAvoid[0].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[0].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[0].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[0].boundingBox.bottomRight.longitude;

                var strAreasToAvoid1 = areasToAvoid[1].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[1].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[1].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[1].boundingBox.bottomRight.longitude;

                var avoidAreasQuery = "&avoidareas=" + strAreasToAvoid0 + "!" + strAreasToAvoid1;

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, null);


                routingService.calculateWithTrafficDisabled(wayPoints, areasToAvoid).then(function (routes) {
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

                var strWayPoint0 = wayPoints[0].coordinates.latitude + "," + wayPoints[0].coordinates.longitude;
                var strWayPoint1 = wayPoints[1].coordinates.latitude + "," + wayPoints[1].coordinates.longitude;

                var wayPointsQuery = "&waypoint0=geo!" + strWayPoint0 + "&waypoint1=geo!" + strWayPoint1;

                var avoidAreasQuery = "&avoidareas=";

                url = url.replace("{{alternatives}}", 1);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficDisabled(wayPoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });

        describe("when more then two wayPoints delivered", function () {

            it ('should call API with enabled traffic and WITHOUT alternatives', inject(function (routingService, $httpBackend) {

                wayPoints = [
                    { coordinates: { latitude: 52.5, longitude: 13.4 }},
                    { coordinates: { latitude: 52.6, longitude: 13.5}},
                    { coordinates: { latitude: 52.7, longitude: 13.6}}
                ];

                var returnedRoutes = [];

                var url = URL;

                var strWayPoint0 = wayPoints[0].coordinates.latitude + "," + wayPoints[0].coordinates.longitude;
                var strWayPoint1 = wayPoints[1].coordinates.latitude + "," + wayPoints[1].coordinates.longitude;
                var strWayPoint2 = wayPoints[2].coordinates.latitude + "," + wayPoints[2].coordinates.longitude;

                var wayPointsQuery = "&waypoint0=geo!" + strWayPoint0 + "&waypoint1=geo!" + strWayPoint1 + "&waypoint2=geo!" + strWayPoint2;

                var strAreasToAvoid0 = areasToAvoid[0].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[0].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[0].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[0].boundingBox.bottomRight.longitude;

                var strAreasToAvoid1 = areasToAvoid[1].boundingBox.topLeft.latitude + ',' +
                    areasToAvoid[1].boundingBox.topLeft.longitude + ';' +
                    areasToAvoid[1].boundingBox.bottomRight.latitude + ',' +
                    areasToAvoid[1].boundingBox.bottomRight.longitude;

                var avoidAreasQuery = "&avoidareas=" + strAreasToAvoid0 + "!" + strAreasToAvoid1;

                url = url.replace("{{alternatives}}", 0);
                url = url.replace("{{wayPoints}}", wayPointsQuery);
                url = url.replace("{{avoidAreas}}", avoidAreasQuery);

                $httpBackend.expectGET(url).respond(200, {

                    response: {
                        route: returnedRoutes
                    }

                });


                routingService.calculateWithTrafficDisabled(wayPoints, areasToAvoid).then(function (routes) {
                    expect(routes).toEqual(returnedRoutes);
                });

                $httpBackend.flush();

            }));

        });

    });


});