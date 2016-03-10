angular.module('navigationApp.services').factory('dataModel', [function () {

    'use strict';

    var WayPoint = function (t, s, c) {

        this.text = t || '';
        this.suggestions = s || [];
        this.coordinates = c || '';
    };

    var BoundingBox = function (t, b) {
        this.text = t || '';
        this.boundingBox = b || '';
    };

    var getWayPoint = function (text, suggestions, coordinates) {
        return new WayPoint(text, suggestions, coordinates);
    };

    var getBoundingBox = function (text, boundingBox) {
        return new BoundingBox(text, boundingBox);
    };

    return {
        getWayPoint: getWayPoint,
        getBoundingBox: getBoundingBox
    };

}]);