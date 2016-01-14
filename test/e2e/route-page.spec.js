
/**
 * @readme
 * This is only example script with e2e tests supported by protractor 2.5.1
 * http://angular.github.io/protractor/#/tutorial
 * **/

var helpers = require('./helpers.js');

describe('Route page', function() {

    var fromPosition,
        toPosition,
        wayPoints = [],

        noRouteFound;


    beforeEach(function () {

        fromPosition = '52.52096291446619,13.411852988615038';
        toPosition = '52.515792286169,13.457085761442187';

        wayPoints.push('52.5231951048162,13.430666774511337');
        wayPoints.push('52.5182695619384,13.434885218739595');

    });

    describe('when opened without route index in path', function () {

        it ('should redirect to main page', function () {

            browser.get(helpers.getRouteDetailsPage() + "/");

            browser.getCurrentUrl().then(function(url) {

                expect(url).toEqual(helpers.getMainPage());
            });

        });

    });

    describe('when opened with not existing route (not found by search)', function () {

        it('should display that route is not found', function () {

            var notExisitngRoutePage = helpers.getRouteDetailsPage() + "/666";

            browser.get(notExisitngRoutePage);

            browser.getCurrentUrl().then(function(url) {

                expect(url).toEqual(notExisitngRoutePage);
            });

            noRouteFound = element(by.css(
                helpers.SELECTORS.ROUTE_PAGE.NO_ROUTE_FOUND));

            expect(noRouteFound.isDisplayed()).toBeTruthy();

        });

        /**
         * @todo
         * implement me
         */
        it ('should display "go to search" button', function () {

        });
    });

    describe('when opened found route by search', function () {

        it ('should display route details', function () {

            browser.get(helpers.getSearchPage() + "/?w0=" + fromPosition + "&w1=" + toPosition);

            var notExisitngRoutePage = helpers.getRouteDetailsPage() + "/0",
                list = element(by.css(helpers.SELECTORS.ROUTE_PAGE.ROUTE_MANEUVERS));

            browser.get(notExisitngRoutePage);

            browser.getCurrentUrl().then(function(url) {

                expect(url).toEqual(notExisitngRoutePage);
            });

            expect(list.isDisplayed()).toBeFalsy();

        });
    });
});