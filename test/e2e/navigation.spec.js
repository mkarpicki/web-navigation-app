
/**
* @readme
* This is only example script with e2e tests supported by protractor 2.5.1
* http://angular.github.io/protractor/#/tutorial
* **/

var helpers = require('./helpers.js');

describe('Navigation between pages', function() {

    var fromPosition,
        toPosition,
        wayPoints = [];


    beforeEach(function () {

        fromPosition = '52.52096291446619,13.411852988615038';
        toPosition = '52.515792286169,13.457085761442187';

        wayPoints.push('52.5231951048162,13.430666774511337');
        wayPoints.push('52.5182695619384,13.434885218739595');

    });

    it("should allow user to use Browser's back and forward buttons to change views", function () {

        var resultsList,
            routeNumber = 0;

        browser.get(helpers.getMainPage());

        element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_FROM)).sendKeys(fromPosition);
        element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_TO)).sendKeys(toPosition);
        element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_GET_ROUTE)).first().click();

        browser.getCurrentUrl().then(function(url) {
            expect(url).toEqual(helpers.getSearchPage() + "?w0=" + fromPosition + "&w1=" + toPosition);
        });

        var number = 0,
            listItemSelector = helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST + ' li:first-child a',
            firstItem;

        //browser.get(helpers.getSearchPage() + "/?w0=" + fromPosition + "&w1=" + toPosition);

        firstItem = element(by.css(listItemSelector));

        browser.wait(firstItem.isDisplayed()).then(function () {

            firstItem.click();

            browser.getCurrentUrl().then(function (url) {

                expect(url).toEqual(helpers.getRouteDetailsPage() + "/" + number);

                browser.navigate().back().then(function () {

                    browser.getCurrentUrl().then(function(url) {

                        expect(url).toEqual(helpers.getSearchPage() + "?w0=" + fromPosition + "&w1=" + toPosition);

                        browser.navigate().forward().then(function () {

                            browser.getCurrentUrl().then(function(url) {
                                expect(url).toEqual(helpers.getRouteDetailsPage() + "/" + routeNumber);
                            });

                        });

                    });

                });

            });
        });

    });
});