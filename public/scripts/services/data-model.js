angular.module('navigationApp.services').factory('dataModel', [function () {

    'use strict';

    var WayPoint = function (t, s, c) {

        this.text = t || '';
        this.suggestions = s || [];
        this.coordinates = c || '';
    };

    var getWayPoint = function (text, suggestions, coordinates) {
        return new WayPoint(text, suggestions, coordinates);
    };

    var getBoundingBox = function () {


    };

    return {
        getWayPoint: getWayPoint,
        getBoundingBox: getBoundingBox
    };

}]);