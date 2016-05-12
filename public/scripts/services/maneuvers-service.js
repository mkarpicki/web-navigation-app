angular.module('navigationApp.services').factory('maneuversService', [function () {

    'use strict';

    var getRouteManeuvers = function (route) {

        var maneuvers = [];

        //if (route && route.leg) {
        //
        //    var lastLeg = route.leg[route.leg.length - 1],
        //        maneuversFromLastLeg = lastLeg.maneuver;
        //
        //    if (maneuversFromLastLeg) {
        //
        //        var lastManeuver = maneuversFromLastLeg[maneuversFromLastLeg.length - 1];
        //
        //        for (var i = 0, len = route.leg.length; i < len; i++) {
        //            var m = route.leg[i].maneuver;
        //            //m.pop();
        //            maneuvers = maneuvers.concat(m);
        //        }
        //
        //        //maneuvers.push(lastManeuver);
        //
        //    }
        //}

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