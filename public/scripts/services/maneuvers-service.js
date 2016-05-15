angular.module('navigationApp.services').factory('maneuversService', [function () {

    'use strict';

    var getRouteManeuvers = function (route) {

        var maneuvers = [];

        if (route && route.leg) {

            for (var i = 0, len = route.leg.length; i < len; i++) {
                var m = route.leg[i].maneuver;
                maneuvers = maneuvers.concat(m);
            }
        }

        return maneuvers;
    };

    return {
        getRouteManeuvers: getRouteManeuvers
    };

}]);