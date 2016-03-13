describe('searchService', function () {

    'use strict';

    var config,
        URL,
        SEARCH_SUGGESTIONS_URL,
        SEARCH_URL;

    beforeEach(module('navigationApp.services'));

    beforeEach(module(function ($provide) {

        config = {};
        config.APP_ID = 'someAppId';
        config.APP_CODE = 'someAppCode';
        $provide.value('config', config);

        SEARCH_SUGGESTIONS_URL = "https://places.api.here.com/places/v1/suggest";
        SEARCH_URL = "https://places.api.here.com/places/v1/discover/search";

        URL = "{{url}}?" +
        "app_id={{appId}}" +
        "&app_code={{appCode}}" +
        "&at={{at}}" +
        "&q={{q}}";

    }));

    describe('getSuggestions', function () {

        describe('when api fails', function () {

            it('should reject promise', inject(function(searchService, $httpBackend) {

                var at = {
                        latitude: "52.12",
                        longitude: "13.01"
                    },
                    q = "poland",
                    apiUrl = SEARCH_SUGGESTIONS_URL +
                        "?app_id=" + config.APP_ID +
                        "&app_code=" + config.APP_CODE +
                        "&at=" + at.latitude + "," + at.longitude +
                        "&q=" + q;

                var status = null;

                $httpBackend.expectGET(apiUrl).respond(500, { });

                var apiHandler = searchService.getSuggestions(q, at);

                apiHandler.promise.then(function () {
                    status = 'ok'
                }, function () {
                    status = 'fail';
                });

                $httpBackend.flush();

                expect(status).toEqual('fail');

            }));

        });

        describe('when api succeed', function () {

            describe ('when at position param not delivered', function () {

                it('should use 0,0 as fallback', inject(function (searchService, $httpBackend){

                    var at = null,
                        q = "poland",
                        apiUrl = SEARCH_SUGGESTIONS_URL +
                            "?app_id=" + config.APP_ID +
                            "&app_code=" + config.APP_CODE +
                            "&at=0,0" +
                            "&q=" + q,

                        expectedSuggestions = ['p1', 'p2'];


                    $httpBackend.expectGET(apiUrl).respond(200, { suggestions: expectedSuggestions });

                    var apiHandler = searchService.getSuggestions(q, at);

                    apiHandler.promise.then(function (suggestions) {
                        expect(suggestions).toEqual(expectedSuggestions)
                    });

                    $httpBackend.flush();

                }));

            });

            it('should use search query and passed position to search against rest API', inject(function(searchService, $httpBackend) {

                var at = {
                        latitude: "52.12",
                        longitude: "13.01"
                    },
                    q = "poland",
                    apiUrl = SEARCH_SUGGESTIONS_URL +
                        "?app_id=" + config.APP_ID +
                        "&app_code=" + config.APP_CODE +
                        "&at=" + at.latitude + "," + at.longitude +
                        "&q=" + q,

                    expectedSuggestions = ['p1', 'p2'];


                $httpBackend.expectGET(apiUrl).respond(200, { suggestions: expectedSuggestions });

                var apiHandler = searchService.getSuggestions(q, at);

                apiHandler.promise.then(function (suggestions) {
                    expect(suggestions).toEqual(expectedSuggestions)
                });

                $httpBackend.flush();


            }));

        });

    });

    describe('getResults', function () {

        //describe('when client cancels promise', function (){
        //
        //    it('should not execute promise', inject(function (searchService, $httpBackend) {
        //
        //        var at = null,
        //            q = "poland",
        //            apiUrl = SEARCH_URL +
        //                "?app_id=" + config.APP_ID +
        //                "&app_code=" + config.APP_CODE +
        //                "&at=0,0" +
        //                "&q=" + q,
        //
        //            expectedResults = ['res1', 'res2'];
        //
        //        var executed = 0;
        //
        //
        //        $httpBackend.expectGET(apiUrl).respond(200, {
        //            results: {
        //                items: expectedResults
        //            }
        //
        //        });
        //
        //        var apiHandler1 = searchService.getResults(q, at),
        //            apiHandler2 = searchService.getResults(q, at);
        //
        //        apiHandler1.promise.then(function () {
        //            executed++;
        //        });
        //
        //        apiHandler2.promise.then(function () {
        //            executed++;
        //        });
        //
        //        apiHandler1.cancel();
        //
        //        $httpBackend.flush();
        //
        //        expect(executed).toEqual(1);
        //
        //    }));
        //
        //});

        describe('when api fails', function () {

            it('should reject promise', inject(function(searchService, $httpBackend) {

                var at = {
                        latitude: "52.12",
                        longitude: "13.01"
                    },
                    q = "poland",
                    apiUrl = SEARCH_URL +
                        "?app_id=" + config.APP_ID +
                        "&app_code=" + config.APP_CODE +
                        "&at=" + at.latitude + "," + at.longitude +
                        "&q=" + q;

                var status = null;

                $httpBackend.expectGET(apiUrl).respond(500, { });

                var apiHandler = searchService.getResults(q, at);

                apiHandler.promise.then(function () {
                    status = 'ok'
                }, function () {
                    status = 'fail';
                });

                $httpBackend.flush();

                expect(status).toEqual('fail');

            }));

        });

        describe('when api succeed', function () {

            describe ('when at position param not delivered', function () {

                it('should use 0,0 as fallback', inject(function (searchService, $httpBackend){

                    var at = null,
                        q = "poland",
                        apiUrl = SEARCH_URL +
                            "?app_id=" + config.APP_ID +
                            "&app_code=" + config.APP_CODE +
                            "&at=0,0" +
                            "&q=" + q,

                        expectedResults = ['res1', 'res2'];


                    $httpBackend.expectGET(apiUrl).respond(200, {
                        results: {
                            items: expectedResults
                        }

                    });

                    var apiHandler = searchService.getResults(q, at);

                    apiHandler.promise.then(function (results) {
                        expect(results).toEqual(expectedResults)
                    });

                    $httpBackend.flush();

                }));

            });

            it('should use search query and passed position to search against rest API', inject(function(searchService, $httpBackend) {

                var at = {
                        latitude: "52.12",
                        longitude: "13.01"
                    },
                    q = "poland",
                    apiUrl = SEARCH_URL +
                        "?app_id=" + config.APP_ID +
                        "&app_code=" + config.APP_CODE +
                        "&at=" + at.latitude + "," + at.longitude +
                        "&q=" + q,

                    expectedResults = ['res1', 'res2'];


                $httpBackend.expectGET(apiUrl).respond(200, {
                    results: {
                        items: expectedResults
                    }

                });

                var apiHandler = searchService.getResults(q, at);

                apiHandler.promise.then(function (results) {
                    expect(results).toEqual(expectedResults)
                });

                $httpBackend.flush();


            }));

        });

    });

});