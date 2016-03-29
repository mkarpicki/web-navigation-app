
/**
 * @readme
 * This is only example script with e2e tests supported by protractor 2.5.1
 * http://angular.github.io/protractor/#/tutorial
 * **/

var helpers = require('./helpers.js');

describe('Route page', function() {

    var wayPoints = [],

        noRouteFound;


    beforeEach(function () {

        wayPoints = [
            'Warsaw|52.23558,21.01027',
            'Szczecin|53.42521,14.55549',
            'Berlin|52.51607,13.37699'
        ];

    });

    describe('when opened without route index in path', function () {

        it ('should redirect to main page', function () {

            browser.get(helpers.ROUTE_DETAILS_PAGE.getPage() + "/");

            browser.getCurrentUrl().then(function(url) {

                expect(url).toEqual(helpers.FORM_PAGE.getPage());
            });

        });

    });

    describe('when opened with not existing route (not found by search)', function () {

        it('should display that route is not found', function () {

            var notExistingRoutePage = helpers.ROUTE_DETAILS_PAGE.getPage() + "/666";

            browser.get(notExistingRoutePage);

            browser.getCurrentUrl().then(function(url) {

                expect(url).toEqual(notExistingRoutePage);
            });

            noRouteFound = helpers.ROUTE_DETAILS_PAGE.getNoRouteFoundElement();

            expect(noRouteFound.isDisplayed()).toBeTruthy();

        });

        /**
         * @todo
         * implement me
         */
        it ('should display "go to search" button', function () {

            var notExistingRoutePage = helpers.ROUTE_DETAILS_PAGE.getPage() + "/666";

            browser.get(helpers.FORM_PAGE.getPage());
            browser.get(notExistingRoutePage);

            browser.getCurrentUrl().then(function(url) {

                expect(url).toEqual(notExistingRoutePage);
            });

            var getNoRouteFoundBackLink = helpers.ROUTE_DETAILS_PAGE.getNoRouteFoundBackLink();

            browser.wait(getNoRouteFoundBackLink.isDisplayed()).then(function () {

                getNoRouteFoundBackLink.click();

                browser.getCurrentUrl().then(function (url) {

                    expect(url).toEqual(helpers.FORM_PAGE.getPage());
                });
            });

        });
    });

    describe('when opened found route by search', function () {

        it ('should display route details', function () {

            var position = 0;

            var url = helpers.SEARCH_RESULTS_PAGE.getPage() +
                "?w0=" + encodeURIComponent(wayPoints[0]) +
                "&w1=" + encodeURIComponent(wayPoints[1]) +
                "&w2=" + encodeURIComponent(wayPoints[2]);

            browser.get(url);

            var firstItem = helpers.SEARCH_RESULTS_PAGE.getFirstResult();

            browser.wait(firstItem.isDisplayed()).then(function () {

                firstItem.click();

                browser.getCurrentUrl().then(function (url) {

                    expect(url).toEqual(helpers.ROUTE_DETAILS_PAGE.getPage() + "/" + position);
                    expect(helpers.ROUTE_DETAILS_PAGE.getManeuvers().isDisplayed()).toBeTruthy();
                });
            });

        });
    });
});