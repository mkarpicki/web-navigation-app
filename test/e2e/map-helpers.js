
var getMapApiServiceScript = function () {
    return "var mapApiService = angular.element(document.querySelector('#map')).injector().get('mapApiService'); ";
};

var getMarkersScript = function () {
    return getMapApiServiceScript() + "var markers = mapApiService.getObjects().filter(function(o) { return o instanceof H.map.Marker; }); ";
};

var getCountWayPointsScript = function () {
    return getMarkersScript() + "return markers.length";
};


var countWayPoints = function () {
    return browser.driver.executeScript(getCountWayPointsScript());
};

var helpers = {

    countWayPoints: countWayPoints
};

module.exports = helpers;