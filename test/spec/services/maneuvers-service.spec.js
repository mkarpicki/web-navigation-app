/**
 * Created by mariuszkarpicki on 15/05/16.
 */
describe('maneuvers-service', function () {

    'use strict';

    beforeEach(module('navigationApp.services'));

    describe('getRouteManeuvers', function () {

        describe('when route not provided', function () {

            it('should return empty array', inject(function(maneuversService) {

                var maneuvers = maneuversService.getRouteManeuvers(null);

                expect(maneuvers.length).toEqual(0);

            }));

        });

        describe('when route provided', function () {

            describe('but route has no leg object', function (){

                it('should return empty array', inject(function(maneuversService) {

                    var route = {};

                    var maneuvers = maneuversService.getRouteManeuvers(route);

                    expect(maneuvers.length).toEqual(0);

                }));
            });

            describe('and leg object provided', function () {

                describe('but leg is empty', function () {

                    it('should return empty array', inject(function(maneuversService) {

                        var route = {
                            leg: []
                        };

                        var maneuvers = maneuversService.getRouteManeuvers(route);

                        expect(maneuvers.length).toEqual(0);

                    }));

                });

                describe('and leg is not empty array', function () {

                    it('should collect and return array with maneuvers from each leg', inject(function(maneuversService) {

                        var route = {
                            leg: [
                                { maneuver: [1,2]},
                                { maneuver: [3]}
                            ]
                        };

                        var maneuvers = maneuversService.getRouteManeuvers(route);

                        expect(maneuvers.length).toEqual(3);
                        expect(maneuvers[0]).toEqual(1);
                        expect(maneuvers[1]).toEqual(2);
                        expect(maneuvers[2]).toEqual(3);

                    }));

                });

            });

        });

    });
});