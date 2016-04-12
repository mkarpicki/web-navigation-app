
var getMapApiServiceScript = function (params) {
    return "var mapApiService = angular.element(document.querySelector('" + params.mapSelector + "')).injector().get('mapApiService'); ";
};

/*************** markers (wayPoints) ************************/

var getMarkersScript = function (params) {
    return getMapApiServiceScript(params) + "var markers = mapApiService.getObjects().filter(function(o) { return o instanceof H.map.Marker; }); ";
};

var getCountWayPointsScript = function (params) {
    return getMarkersScript(params) + "return markers.length; ";
};

var countWayPoints = function (params) {
    return browser.driver.executeScript(getCountWayPointsScript(params));
};

/*************** routes ************************/

var getRoutesScript = function (params) {
    return getMapApiServiceScript(params) + "var routes = mapApiService.getObjects().filter(function(o) { return o instanceof H.map.Polyline; }); ";
};

var getCountRoutesScript = function (params) {
    return getRoutesScript(params) + "return routes.length; ";
};

var countRoutes = function (params) {
    return browser.driver.executeScript(getCountRoutesScript(params));
};

var helpers = {

    countWayPoints: countWayPoints,
    countRoutes: countRoutes
};

module.exports = helpers;