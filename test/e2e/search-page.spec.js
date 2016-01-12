
/**
 * @readme
 * This is only example script with e2e tests supported by protractor 2.5.1
 * http://angular.github.io/protractor/#/tutorial
 * **/

var helpers = require('./helpers.js');

describe('Search page', function() {

    var fromPosition,
        toPosition,
        wayPoints = [];

    beforeEach(function () {

        fromPosition = '52.52096291446619,13.411852988615038';
        toPosition = '52.515792286169,13.457085761442187';

        wayPoints.push('52.5231951048162,13.430666774511337');
        wayPoints.push('52.5182695619384,13.434885218739595');

    });

    beforeEach(function () {

        //browser.get(helpers.getSearchPage());
    });

    describe('when opened without query params', function () {

        it ('should display that there is not enough info to search', function () {

            browser.get(helpers.getSearchPage());

            var notEnoughInformationMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION));
            var noRouteFoundMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND));
            var resultsList = element(by.css(helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST));

            expect(notEnoughInformationMessage.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
            expect(resultsList.isDisplayed()).toBeFalsy();

        });

    });

    describe('when opened with only start point in query params', function () {

        it ('should display that there is not enough info to search', function () {

            browser.get(helpers.getSearchPage() + "/?w0=" + fromPosition);

            var notEnoughInformationMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION));
            var noRouteFoundMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND));
            var resultsList = element(by.css(helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST));

            expect(notEnoughInformationMessage.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
            expect(resultsList.isDisplayed()).toBeFalsy();

        });

    });

    describe('when opened with only destination point in query params', function () {

        it ('should display that there is not enough info to search', function () {

            browser.get(helpers.getSearchPage() + "/?w1=" + toPosition);

            var notEnoughInformationMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION));
            var noRouteFoundMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND));
            var resultsList = element(by.css(helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST));

            expect(notEnoughInformationMessage.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
            expect(resultsList.isDisplayed()).toBeFalsy();

        });

    });

    describe('when opened with invalid points in query params', function () {

        it ('should display that there is not enough info to search', function () {

            browser.get(helpers.getSearchPage() + "/?w0=" + "a" + "&w1=" + "b");

            var notEnoughInformationMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION));
            var noRouteFoundMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND));
            var resultsList = element(by.css(helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST));

            expect(notEnoughInformationMessage.isDisplayed()).toBeFalsy();
            expect(noRouteFoundMessage.isDisplayed()).toBeTruthy();
            expect(resultsList.isDisplayed()).toBeFalsy();

        });

    });

    describe('when valid start and destination points in query params', function () {

        it ('should display that there is not enough info to search', function () {

            browser.get(helpers.getSearchPage() + "/?w0=" + fromPosition + "&w1=" + toPosition);

            var notEnoughInformationMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION));
            var noRouteFoundMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND));
            var resultsList = element(by.css(helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST));

            expect(notEnoughInformationMessage.isDisplayed()).toBeFalsy();
            expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
            expect(resultsList.isDisplayed()).toBeTruthy();

        });

        describe('when valid middle way point in query params', function () {

            it ('should display that there is not enough info to search', function () {

                browser.get(helpers.getSearchPage() + "/?w0=" + fromPosition + "&w1=" + wayPoints[0] + "&w2=" + toPosition);

                var notEnoughInformationMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION));
                var noRouteFoundMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND));
                var resultsList = element(by.css(helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST));

                expect(notEnoughInformationMessage.isDisplayed()).toBeFalsy();
                expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
                expect(resultsList.isDisplayed()).toBeTruthy();

            });

        });

        describe('when NOT valid middle way point in query params', function () {

            it ('should display that there is not enough info to search', function () {

                browser.get(helpers.getSearchPage() + "/?w0=" + fromPosition + "&w1=" + "abcdefg" + "&w2=" + toPosition);

                var notEnoughInformationMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION));
                var noRouteFoundMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND));
                var resultsList = element(by.css(helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST));

                expect(notEnoughInformationMessage.isDisplayed()).toBeFalsy();
                expect(noRouteFoundMessage.isDisplayed()).toBeTruthy();
                expect(resultsList.isDisplayed()).toBeFalsy();

            });

        });

    });

});