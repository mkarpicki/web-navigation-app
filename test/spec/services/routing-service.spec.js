describe('routingService', function () {


    'use strict';

    var config,
        $http,
        $q,
        $interpolate,

        //$httpBackend,

        fakeExp;


    beforeEach(module('navigationApp.services'));

    beforeEach(module(function ($provide) {

        //fakeExp = function () {};
        //
        //$interpolate = function () {
        //    return fakeExp;
        //};
        //
        //$provide.value('$interpolate', $interpolate);
        //
        //$q = {
        //    then: function () {},
        //    defer: function () {}
        //};
        //
        //$provide.value('$q', $q);
        //
        //$http = {
        //    get: function () { return $q; }
        //};
        //$provide.value('$http', $http);

        config = {};
        config.appId = 'someAppId';
        config.appCode = 'someAppCode';
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
                '52.5182,13.4279',
                '52.5138,13.4733'
            ];

            areasToAvoid = [
                '52.516,13.453;52.514,13.455',
                '52.517,13.454;52.515,13.456'
            ];

            URL = "https://route.api.here.com/routing/7.2/calculateroute.json?" +
                "app_id={{appId}}" +
                "&app_code={{appCode}}" +
                "{{wayPoints}}" +
                "{{avoidAreas}}" +
                "&alternatives={{alternatives}}" +
                "&legattributes=sm" +
                "&linkattributes=" +
                "&maneuverattributes=all" +
                "&metricSystem=metric" +
                "&mode=fastest;car;traffic:{{traffic}};" +
                "&routeattributes=none,sh,wp,sm,bb,lg,no,li,tx" +
                "&transportModeType=car";

        });


        it ('should get route with option of enabled traffic', inject(function (routingService, $httpBackend) {

            //$http.get = jasmine.createSpy('$http.get').and.returnValue($q);

            //$httpBackend
            //    .when('GET', 'https://route.api.here.com/routing/7.2/calculateroute.json').respond(200, {
            //        status: "ERROR",
            //        data: []
            //    });

            //$httpBackend.expectGET('https://route.api.here.com/routing/7.2/calculateroute.json').respond(200, {
            $httpBackend.expectGET(URL).respond(200, {
                data: {
                    response: {
                        route: [1,2,3]
                    }
                }
            });


            var res = routingService.calculateWithTrafficEnabled(waypoints, areasToAvoid);

            console.log(res);
            //expect($http.get).toHaveBeenCalledWith();

        }));

    });

});