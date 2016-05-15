/**
 * Created by mariuszkarpicki on 16/05/16.
 */

describe('filter', function() {

    'use strict';

    var $filter;

    beforeEach(module('navigationApp.filters'));

    beforeEach(inject(function (_$filter_) {
        $filter = _$filter_;

    }));

    describe('metersPerSecondToKilometersPerHour', function() {

        it('should transform value in meters/second to km/hour', function() {

            expect($filter('metersPerSecondToKilometersPerHour')(1)).toEqual(3.6);
//            expect(metersPerSecondToKilometersPerHour(10)).toEqual(36);
//            expect(metersPerSecondToKilometersPerHour(50)).toEqual(180);

        });
    });
});