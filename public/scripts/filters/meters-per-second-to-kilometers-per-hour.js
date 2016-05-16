/**
 * Created by mariuszkarpicki on 15/05/16.
 */

angular.module('navigationApp.filters').filter('metersPerSecondToKilometersPerHour', function() {
    return function(metersPerSecondValue) {
        return Math.round(metersPerSecondValue * 3.6);
    };
});