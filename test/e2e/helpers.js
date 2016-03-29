var SELECTORS = {
    FORM_PAGE: {
        INPUT_WAY_POINT: '#search-field-',
        BTN_ADD_WAY_POINT: 'button[data-ng-click*="addWayPoint();"]',
        BTN_REMOVE_WAY_POINT: 'button[data-ng-click="removeWayPoint($index);"]',
        BTN_GET_ROUTE: 'button[data-ng-click="getRoute();"]',
        BTN_SEARCH_SUGGESTION: 'ul.search-suggestions button',
        BTN_CLEAR: 'button[data-ng-click="clear();"]'
    },
    SEARCH_PAGE: {
        NOT_ENOUGH_INFORMATION: 'p[data-ng-show="notEnoughInformation"]',
        NO_ROUTES_FOUND: 'p[data-ng-show="noRouteFound"]',
        RESULTS_LIST: 'ul[data-ng-hide="noRouteFound || notEnoughInformation"]',
        BACK_LINK: 'a[data-ng-click="back();"]'
    },
    ROUTE_PAGE: {
        NO_ROUTE_FOUND: 'p[data-ng-show="undefinedRoute"]',
        ROUTE_MANEUVERS: 'ul[data-ng-hide="undefinedRoute"]'
    }
};

var getHost = function() {
    return browser.baseUrl;
};

var getRouteDetailsPage = function () {
    return getHost() + '/route';
};

var doesUrlContains = function (url, stringToCheck) {
    return url.indexOf(stringToCheck) >= 0;
};

/****************************************************************************************/

var formPage = {};

formPage.getPage = function () {
    return getHost() + "/";
};

formPage.getSuggestionByPosition = function (position) {
    return element.all(by.css(SELECTORS.FORM_PAGE.BTN_SEARCH_SUGGESTION)).get(position);
};

formPage.getWayPointByPosition = function (position) {
    return element.all(by.css(SELECTORS.FORM_PAGE.INPUT_WAY_POINT + position)).first();
};

formPage.getCalculateRouteButton = function () {
    return element.all(by.css(SELECTORS.FORM_PAGE.BTN_GET_ROUTE)).first();
};

/****************************************************************************************/

var searchResultsPage = {};

searchResultsPage.getPage = function () {
    return getHost() + '/search';
};

var helpers = {

    FORM_PAGE: formPage,

    SEARCH_RESULTS_PAGE: searchResultsPage,

    doesUrlContains: doesUrlContains,

    SELECTORS: SELECTORS,

    getRouteDetailsPage: getRouteDetailsPage
};

module.exports = helpers;