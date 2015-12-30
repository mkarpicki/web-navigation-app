describe('routingService', function () {


    'use strict';

    var config,
        $http,
        $q,
        $interpolate;


    beforeEach(module('navigationApp.services'));


    beforeEach(module(function ($provide) {


        //$interpolate = {};
        //$provide.value('$interpolate', $interpolate);
        //
        //$q = {};
        //$provide.value('$q', $q);
        //
        //$http = _$http_;
        //$http.value('$http', $http);


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

});