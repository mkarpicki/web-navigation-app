
/**
* @readme
* This is only example script with e2e tests supported by protractor 2.5.1
* http://angular.github.io/protractor/#/tutorial
* **/

var helpers = require('./page-helpers.js');

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

        browser.get(helpers.FORM_PAGE.getPage());

        helpers.FORM_PAGE.getWayPointByPosition(0).sendKeys(wayPoints[0]);
        suggestion = helpers.FORM_PAGE.getSuggestionByPosition(0);
        suggestion.click();

        helpers.FORM_PAGE.getWayPointByPosition(1).sendKeys(wayPoints[3]);
        suggestion = helpers.FORM_PAGE.getSuggestionByPosition(0);
        suggestion.click();

        helpers.FORM_PAGE.getCalculateRouteButton().click();

        browser.getCurrentUrl().then(function(url) {
            expect(helpers.doesUrlContains(url, helpers.SEARCH_RESULTS_PAGE.getPage())).toEqual(true);
            expect(helpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
            expect(helpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[3]))).toEqual(true);
        });

        var position = 0,
            firstItem = helpers.SEARCH_RESULTS_PAGE.getFirstResult();


        browser.wait(firstItem.isDisplayed()).then(function () {

            firstItem.click();

            browser.getCurrentUrl().then(function (url) {

                expect(url).toEqual(helpers.ROUTE_DETAILS_PAGE.getPage() + "/" + position);

                browser.navigate().back().then(function () {

                    browser.getCurrentUrl().then(function(url) {

                        expect(helpers.doesUrlContains(url, helpers.SEARCH_RESULTS_PAGE.getPage())).toEqual(true);
                        expect(helpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
                        expect(helpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[3]))).toEqual(true);

                        browser.navigate().forward().then(function () {

                            browser.getCurrentUrl().then(function(url) {
                                expect(url).toEqual(helpers.ROUTE_DETAILS_PAGE.getPage() + "/" + position);
                            });

                        });

                    });

                });

            });
        });

    });
});