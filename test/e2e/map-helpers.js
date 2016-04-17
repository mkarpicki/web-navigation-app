var SELECTORS = {
    MAP_SELECTOR: "#map"
};

var getMapApiServiceScript = function () {
    return "var mapApiService = angular.element(document.querySelector('" + SELECTORS.MAP_SELECTOR + "')).injector().get('mapApiService'); ";
};

/*************** markers (wayPoints) ************************/

var getMarkersScript = function () {
    return getMapApiServiceScript() + "var markers = mapApiService.getObjects().filter(function(o) { return (o instanceof H.map.Marker && o.getVisibility() === true); }); ";
};

var getCountWayPointsScript = function () {
    return getMarkersScript() + "return markers.length; ";
};

var countWayPoints = function () {
    return browser.driver.executeScript(getCountWayPointsScript());
};

/*************** routes ************************/

var getRoutesScript = function () {
    return getMapApiServiceScript() + "var routes = mapApiService.getObjects().filter(function(o) { return (o instanceof H.map.Polyline && o.getVisibility() === true); }); ";
};

var getCountRoutesScript = function () {
    return getRoutesScript() + "return routes.length; ";
};

var countRoutes = function () {
    return browser.driver.executeScript(getCountRoutesScript());
};

var helpers = {

    countWayPoints: countWayPoints,
    countRoutes: countRoutes
};

module.exports = helpers;