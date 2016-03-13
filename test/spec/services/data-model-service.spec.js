describe('dataModelService', function () {

    'use strict';

    beforeEach(module('navigationApp.services'));

    describe('getWayPoint', function () {

        describe('when values are delivered', function () {

            it('should return object with set properties', inject(function(dataModelService) {

                var wayPoint = dataModelService.getWayPoint('some text', [1,2], '52.12,31.32');

                expect(wayPoint.text).toEqual('some text');
                expect(wayPoint.suggestions).toEqual([1,2]);
                expect(wayPoint.coordinates).toEqual('52.12,31.32');

            }));

        });

        describe('when values are not delivered', function () {

            it('should return object with default properties', inject(function(dataModelService) {

                var wayPoint = dataModelService.getWayPoint();

                expect(wayPoint.text).toEqual('');
                expect(wayPoint.suggestions).toEqual([]);
                expect(wayPoint.coordinates).toEqual('');

            }));

        });

    });

    describe('getBoundingBox', function () {

        describe('when values are delivered', function () {

            it('should return object with set properties', inject(function(dataModelService) {

                var boundingBox = dataModelService.getBoundingBox('some text', '52.12,31.32,52.14,13.22');

                expect(boundingBox.text).toEqual('some text');
                expect(boundingBox.boundingBox).toEqual('52.12,31.32,52.14,13.22');

            }));

        });

        describe('when values are not delivered', function () {

            it('should return object with default properties', inject(function(dataModelService) {

                var boundingBox = dataModelService.getBoundingBox();

                expect(boundingBox.text).toEqual('');
                expect(boundingBox.boundingBox).toEqual('');

            }));

        });

    });


});