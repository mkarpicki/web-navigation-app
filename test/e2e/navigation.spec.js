
/**
* @readme
* This is only example script with e2e tests supported by protractor 2.5.1
* http://angular.github.io/protractor/#/tutorial
* **/

var pageHelpers = require('./page-helpers.js');
var mapHelpers = require('./map-helpers.js');

var mapHelpersParams = {
    mapSelector: "#map"
};

describe('Navigation between pages', function() {

    var wayPoints = [],
        suggestion;

    beforeEach(function () {

        wayPoints[0] = "Warsaw";
        wayPoints[1] = "Poznan";
        wayPoints[2] = "Szczecin";
        wayPoints[3] = "Berlin";

    });

    it("should allow user to use Browser's back and forward buttons to change views", function () {

        browser.get(pageHelpers.FORM_PAGE.getPage());

        mapHelpers.countWayPoints(mapHelpersParams).then(function (results) {
            expect(results).toEqual(0);
        });

        mapHelpers.countRoutes(mapHelpersParams).then(function (results) {
            expect(results).toEqual(0);
        });

        pageHelpers.FORM_PAGE.getWayPointByPosition(0).sendKeys(wayPoints[0]);
        suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
        suggestion.click();

        pageHelpers.FORM_PAGE.getWayPointByPosition(1).sendKeys(wayPoints[3]);
        suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
        suggestion.click();

        mapHelpers.countWayPoints(mapHelpersParams).then(function (results) {
            expect(results).toEqual(2);
        });

        pageHelpers.FORM_PAGE.getCalculateRouteButton().click();

        browser.getCurrentUrl().then(function(url) {
            expect(pageHelpers.doesUrlContains(url, pageHelpers.SEARCH_RESULTS_PAGE.getPage())).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[3]))).toEqual(true);

        });

        mapHelpers.countWayPoints(mapHelpersParams).then(function (results) {
            expect(results).toEqual(2);
        });

        mapHelpers.countRoutes(mapHelpersParams).then(function (results) {
            expect(results > 0).toBeTruthy();
        });

        var position = 0,
            firstItem = pageHelpers.SEARCH_RESULTS_PAGE.getFirstResult();


        browser.wait(firstItem.isDisplayed()).then(function () {

            firstItem.click();

            browser.getCurrentUrl().then(function (url) {

                expect(url).toEqual(pageHelpers.ROUTE_DETAILS_PAGE.getPage() + "/" + position);

                mapHelpers.countWayPoints(mapHelpersParams).then(function (results) {
                    expect(results).toEqual(2);
                });

                mapHelpers.countRoutes(mapHelpersParams).then(function (results) {
                    expect(results > 0).toBeTruthy();
                });

                browser.navigate().back().then(function () {

                    browser.getCurrentUrl().then(function(url) {

                        expect(pageHelpers.doesUrlContains(url, pageHelpers.SEARCH_RESULTS_PAGE.getPage())).toEqual(true);
                        expect(pageHelpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
                        expect(pageHelpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[3]))).toEqual(true);

                        mapHelpers.countWayPoints(mapHelpersParams).then(function (results) {
                            expect(results).toEqual(2);
                        });

                        mapHelpers.countRoutes(mapHelpersParams).then(function (results) {
                            expect(results > 0).toBeTruthy();
                        });

                        browser.navigate().forward().then(function () {

                            browser.getCurrentUrl().then(function(url) {
                                expect(url).toEqual(pageHelpers.ROUTE_DETAILS_PAGE.getPage() + "/" + position);
                            });

                            mapHelpers.countWayPoints(mapHelpersParams).then(function (results) {
                                expect(results).toEqual(2);
                            });

                            mapHelpers.countRoutes(mapHelpersParams).then(function (results) {
                                expect(results > 0).toBeTruthy();
                            });

                        });

                    });

                });

            });
        });

    });
});