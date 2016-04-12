
var getMapApiServiceScript = function (params) {
    return "var mapApiService = angular.element(document.querySelector('" + params.mapSelector + "')).injector().get('mapApiService'); ";
};

var getMarkersScript = function (params) {
    return getMapApiServiceScript(params) + "var markers = mapApiService.getObjects().filter(function(o) { return o instanceof H.map.Marker; }); ";
};

var getCountWayPointsScript = function (params) {
    return getMarkersScript(params) + "return markers.length";
};


var countWayPoints = function (params) {
    return browser.driver.executeScript(getCountWayPointsScript(params));
};

var helpers = {

    countWayPoints: countWayPoints
};

module.exports = helpers;