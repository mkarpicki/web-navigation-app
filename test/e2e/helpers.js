var SELECTORS = {
    FORM_PAGE: {
        INPUT_FROM: '#from',
        INPUT_TO: '#to',
        INPUT_WAY_POINT: '#waypoint-',
        BTN_ADD_WAY_POINT: 'button[data-ng-click="addWayPoint();"]',
        BTN_REMOVE_WAY_POINT: 'button[data-ng-click="removeWayPoint($index);"]',
        BTN_GET_ROUTE: 'button[data-ng-click="getRoute();"]',
        BTN_CLEAR: 'button[data-ng-click="clear();"]'
    },
    SEARCH_PAGE: {
        NOT_ENOUGH_INFORMATION: 'p[data-ng-show="notEnoughInformation"]',
        NO_ROUTES_FOUND: 'p[data-ng-show="noRouteFound"]',
        RESULTS_LIST: 'ul[data-ng-hide="noRouteFound || notEnoughInformation"]',
        BACK_LINK: 'a[data-ng-click="back();"]'
    }
};

var getHost = function() {
    return 'http://0.0.0.0:3000';
};

var getMainPage = function () {
    return getHost() + "/";
};

var getSearchPage = function () {
    return getHost() + '/search';
};

var getRouteDetailsPage = function () {
    return getHost() + '/route';
};

var helpers = {
    SELECTORS: SELECTORS,

    getMainPage: getMainPage,
    getSearchPage: getSearchPage,
    getRouteDetailsPage: getRouteDetailsPage
};

module.exports = helpers;