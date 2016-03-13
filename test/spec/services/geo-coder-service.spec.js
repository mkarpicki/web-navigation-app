describe('geoCoderService', function () {

    'use strict';

    var config,
        REVERSE_GEO_CODER_URL =  "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json";

    beforeEach(module('navigationApp.services'));

    beforeEach(module(function ($provide) {

        config = {};
        config.APP_ID = 'someAppId';
        config.APP_CODE = 'someAppCode';
        $provide.value('config', config);

    }));

    describe('reverse', function () {

        describe('when api returns not successful response', function () {

            it ('should reject promise', inject(function(geoCoderService, $httpBackend) {

                var coordinates = '52.10,13.2',
                    radius = 5,
                    apiUrl,
                    response;

                apiUrl = REVERSE_GEO_CODER_URL + "?" +
                "app_id=" + config.APP_ID +
                "&app_code=" + config.APP_CODE +
                "&gen=9" +
                "&prox=" + coordinates + "," + radius +
                "&maxresults=1" +
                "&mode=retrieveAddresses";

                response = {};

                var fail = false;

                $httpBackend.expectGET(apiUrl).respond(400, response);

                geoCoderService.reverse(coordinates, radius).then(function () {

                }, function () {
                    fail = true;
                });

                $httpBackend.flush();

                expect(fail).toBe(true);

            }));

        });

        describe('when api returns successful response', function () {

            describe('but not expected response format', function () {

                it ('should resolve promise with empty result', inject(function(geoCoderService, $httpBackend) {

                    var coordinates = '52.10,13.2',
                        radius = 5,
                        apiUrl,
                        response;

                    apiUrl = REVERSE_GEO_CODER_URL + "?" +
                    "app_id=" + config.APP_ID +
                    "&app_code=" + config.APP_CODE +
                    "&gen=9" +
                    "&prox=" + coordinates + "," + radius +
                    "&maxresults=1" +
                    "&mode=retrieveAddresses";

                    response = {};

                    $httpBackend.expectGET(apiUrl).respond(200, response);

                    geoCoderService.reverse(coordinates, radius).then(function (text) {
                        expect(text).toEqual('');
                    });

                    $httpBackend.flush();

                    response = {
                        Response: {}
                    };

                    $httpBackend.expectGET(apiUrl).respond(200, response);

                    geoCoderService.reverse(coordinates, radius).then(function (text) {
                        expect(text).toEqual('');
                    });

                    $httpBackend.flush();

                    response = {
                        Response: {
                            View: []
                        }
                    };

                    $httpBackend.expectGET(apiUrl).respond(200, response);

                    geoCoderService.reverse(coordinates, radius).then(function (text) {
                        expect(text).toEqual('');
                    });

                    $httpBackend.flush();

                    response = {
                        Response: {
                            View: [{
                                Result:[]
                            }]
                        }
                    };

                    $httpBackend.expectGET(apiUrl).respond(200, response);

                    geoCoderService.reverse(coordinates, radius).then(function (text) {
                        expect(text).toEqual('');
                    });

                    $httpBackend.flush();

                    response = {
                        Response: {
                            View: [{
                                Result:[{
                                    Location: {}
                                }]
                            }]
                        }
                    };

                    $httpBackend.expectGET(apiUrl).respond(200, response);

                    geoCoderService.reverse(coordinates, radius).then(function (text) {
                        expect(text).toEqual('');
                    });

                    $httpBackend.flush();

                    response = {
                        Response: {
                            View: [{
                                Result:[{
                                    Location: {
                                        Address: {}
                                    }
                                }]
                            }]
                        }
                    };

                    $httpBackend.expectGET(apiUrl).respond(200, response);

                    geoCoderService.reverse(coordinates, radius).then(function (text) {
                        expect(text).toEqual('');
                    });

                    $httpBackend.flush();


                    response = {
                        Response: {
                            View: [{
                                Result:[{
                                    Location: {
                                        Address: {
                                            Label: null
                                        }
                                    }
                                }]
                            }]
                        }
                    };

                    $httpBackend.expectGET(apiUrl).respond(200, response);

                    geoCoderService.reverse(coordinates, radius).then(function (text) {
                        expect(text).toEqual('');
                    });

                    $httpBackend.flush();

                }));

            });

            describe('and radius not defined by client', function () {

                it('sgould use default radius', inject(function(geoCoderService, $httpBackend) {

                    var coordinates = '52.10,13.2',
                        radius = null,
                        apiUrl,
                        response;

                    apiUrl = REVERSE_GEO_CODER_URL + "?" +
                    "app_id=" + config.APP_ID +
                    "&app_code=" + config.APP_CODE +
                    "&gen=9" +
                    "&prox=" + coordinates + "," + 200 +
                    "&maxresults=1" +
                    "&mode=retrieveAddresses";

                    response = {
                        Response: {
                            View: [{
                                Result:[{
                                    Location: {
                                        Address: {
                                            Label: 'some text'
                                        }
                                    }
                                }]
                            }]
                        }
                    };

                    $httpBackend.expectGET(apiUrl).respond(200, response);

                    geoCoderService.reverse(coordinates, radius).then(function (text) {
                        expect(text).toEqual('some text');
                    });

                    $httpBackend.flush();

                }));

            });

            describe('and found address for position', function () {

                it ('should resolve promise with result', inject(function(geoCoderService, $httpBackend) {

                    var coordinates = '52.10,13.2',
                        radius = 5,
                        apiUrl,
                        response;

                    apiUrl = REVERSE_GEO_CODER_URL + "?" +
                    "app_id=" + config.APP_ID +
                    "&app_code=" + config.APP_CODE +
                    "&gen=9" +
                    "&prox=" + coordinates + "," + radius +
                    "&maxresults=1" +
                    "&mode=retrieveAddresses";

                    response = {
                        Response: {
                            View: [{
                                Result:[{
                                    Location: {
                                        Address: {
                                            Label: 'some text'
                                        }
                                    }
                                }]
                            }]
                        }
                    };

                    $httpBackend.expectGET(apiUrl).respond(200, response);

                    geoCoderService.reverse(coordinates, radius).then(function (text) {
                        expect(text).toEqual('some text');
                    });

                    $httpBackend.flush();

                }));

            });
        });
    });

});