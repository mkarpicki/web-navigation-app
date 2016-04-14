var SELECTORS = {
    MAP_SELECTOR: "#map",
    MENU: "[data-map] .bubble"
};

var getMapApiServiceScript = function () {
    return "var mapApiService = angular.element(document.querySelector('" + SELECTORS.MAP_SELECTOR + "')).injector().get('mapApiService'); ";
};

/*************** markers (wayPoints) ************************/

var getMarkersScript = function () {
    return getMapApiServiceScript() + "var markers = mapApiService.getObjects().filter(function(o) { return o instanceof H.map.Marker; }); ";
};

var getCountWayPointsScript = function () {
    return getMarkersScript() + "return markers.length; ";
};

var countWayPoints = function () {
    return browser.driver.executeScript(getCountWayPointsScript());
};

/*************** routes ************************/

var getRoutesScript = function () {
    return getMapApiServiceScript() + "var routes = mapApiService.getObjects().filter(function(o) { return o instanceof H.map.Polyline; }); ";
};

var getCountRoutesScript = function () {
    return getRoutesScript() + "return routes.length; ";
};

var countRoutes = function () {
    return browser.driver.executeScript(getCountRoutesScript());
};

/*************** menu ************************/

var getMenu = function () {
    return element.all(by.css(SELECTORS.MAP_SELECTOR)).first();
};

var helpers = {

    countWayPoints: countWayPoints,
    countRoutes: countRoutes,

    getMenu: getMenu
};

module.exports = helpers;