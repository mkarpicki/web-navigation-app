/**
 * Created by mariuszkarpicki on 15/05/16.
 */

angular.module('navigationApp.filters').filter('metersPerSecondToKilometersPerHour', function() {
    return function(metersPerSecondValue) {
        return metersPerSecondValue * 3.6;
    };
});