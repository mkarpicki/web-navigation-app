var SELECTORS = {
    FORM_PAGE: {
        INPUT_WAY_POINT: 'li input[type="text"]',
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
        NO_ROUTE_FOUND_BACK_LINK: 'p[data-ng-show="undefinedRoute"] a',
        ROUTE_MANEUVERS: 'ul[data-ng-hide="undefinedRoute"]'
    }
};

var getHost = function() {
    return browser.baseUrl;
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

formPage.getWayPoints = function () {
    return element.all(by.css(SELECTORS.FORM_PAGE.INPUT_WAY_POINT));
};

formPage.getWayPointByPosition = function (position) {
    return formPage.getWayPoints().get(position);
};

formPage.getCalculateRouteButton = function () {
    return element.all(by.css(SELECTORS.FORM_PAGE.BTN_GET_ROUTE)).first();
};

formPage.getClearButton = function () {
    return element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_CLEAR)).first();
};

formPage.getAddWayPointButton = function () {
    return element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_ADD_WAY_POINT)).first();
};

formPage.getRemoveWayPointButton = function () {
    return element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_REMOVE_WAY_POINT)).last();
};

/****************************************************************************************/

var searchResultsPage = {};

searchResultsPage.getPage = function () {
    return getHost() + '/search';
};

searchResultsPage.getResultByPosition = function (position) {
    return element.all(by.css(SELECTORS.SEARCH_PAGE.RESULTS_LIST)).get(position).element('a');
};

searchResultsPage.getResults = function () {
    return element.all(by.css(SELECTORS.SEARCH_PAGE.RESULTS_LIST)).first();
};

searchResultsPage.getFirstResult = function () {
    return element.all(by.css(SELECTORS.SEARCH_PAGE.RESULTS_LIST + ' li:first-child a')).first();
};

searchResultsPage.getNotEnoughInformationElement = function () {
    return element.all(by.css(SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION)).first();
};

searchResultsPage.getNoRoutesFoundElement = function () {
    return element.all(by.css(SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND)).first();
};

searchResultsPage.getNotEnoughInformationMessageBackLink = function () {
    return element.all(by.css(SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION + " " + SELECTORS.SEARCH_PAGE.BACK_LINK)).first();
};

searchResultsPage.getNoRouteFoundMessageBackLink = function () {
    return element.all(by.css(SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND + " " + SELECTORS.SEARCH_PAGE.BACK_LINK)).first();
};

/****************************************************************************************/

var routeDetailsPage = {};

routeDetailsPage.getPage = function () {
    return getHost() + '/route';
};

routeDetailsPage.getNoRouteFoundElement =function () {
    return element(by.css(SELECTORS.ROUTE_PAGE.NO_ROUTE_FOUND));
};

routeDetailsPage.getNoRouteFoundBackLink = function () {
    return element(by.css(SELECTORS.ROUTE_PAGE.NO_ROUTE_FOUND_BACK_LINK));
};

routeDetailsPage.getManeuvers = function () {
    return element(by.css(SELECTORS.ROUTE_PAGE.ROUTE_MANEUVERS));
};

/****************************************************************************************/

var helpers = {

    FORM_PAGE: formPage,
    SEARCH_RESULTS_PAGE: searchResultsPage,
    ROUTE_DETAILS_PAGE: routeDetailsPage,

    doesUrlContains: doesUrlContains,

    SELECTORS: SELECTORS
};

module.exports = helpers;