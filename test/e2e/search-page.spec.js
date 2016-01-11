
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

});