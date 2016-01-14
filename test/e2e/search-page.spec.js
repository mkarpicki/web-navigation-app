
/**
 * @readme
 * This is only example script with e2e tests supported by protractor 2.5.1
 * http://angular.github.io/protractor/#/tutorial
 * @todo
 * add back button when list displayed
 * add test for back button (on UI) in all cases
 * add test to go to route details page (by clicking on found route)
 * **/

var helpers = require('./helpers.js');

describe('Search page', function() {

    var fromPosition,
        toPosition,
        wayPoints = [],

        notEnoughInformationMessage,
        noRouteFoundMessage,
        resultsList,

        notEnoughInformationMessageBackLink,
        noRouteFoundMessageBackLink;


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

            notEnoughInformationMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION));
            noRouteFoundMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND));
            resultsList = element(by.css(helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST));

            notEnoughInformationMessageBackLink = element(by.css(
                helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION +
                " " +
                helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));

            noRouteFoundMessageBackLink = element(by.css(
                helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND +
                " " +
                helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));

            expect(notEnoughInformationMessage.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
            expect(resultsList.isDisplayed()).toBeFalsy();

            expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessageBackLink.isDisplayed()).toBeFalsy();

        });

        describe("and visited page before", function () {

            describe('when clicking on back link', function () {

                it('should move user to previous page', function () {

                    browser.get(helpers.getMainPage());
                    browser.get(helpers.getSearchPage());

                    notEnoughInformationMessageBackLink = element(by.css(
                        helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION +
                        " " +
                        helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));

                    expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeTruthy();

                    notEnoughInformationMessageBackLink.click();

                    browser.getCurrentUrl().then(function(url) {

                        expect(url).toEqual(helpers.getMainPage());
                    });


                });

            });

        });

    });

    describe('when opened with only start point in query params', function () {

        it ('should display that there is not enough info to search', function () {

            browser.get(helpers.getSearchPage() + "/?w0=" + fromPosition);

            notEnoughInformationMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION));
            noRouteFoundMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND));
            resultsList = element(by.css(helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST));

            notEnoughInformationMessageBackLink = element(by.css(
                helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION +
                " " +
                helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));

            noRouteFoundMessageBackLink = element(by.css(
                helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND +
                " " +
                helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));

            expect(notEnoughInformationMessage.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
            expect(resultsList.isDisplayed()).toBeFalsy();
            expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessageBackLink.isDisplayed()).toBeFalsy();

        });

    });

    describe('when opened with only destination point in query params', function () {

        it ('should display that there is not enough info to search', function () {

            browser.get(helpers.getSearchPage() + "/?w1=" + toPosition);

            notEnoughInformationMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION));
            noRouteFoundMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND));
            resultsList = element(by.css(helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST));

            expect(notEnoughInformationMessage.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
            expect(resultsList.isDisplayed()).toBeFalsy();

            notEnoughInformationMessageBackLink = element(by.css(
                helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION +
                " " +
                helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));

            noRouteFoundMessageBackLink = element(by.css(
                helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND +
                " " +
                helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));

            expect(notEnoughInformationMessage.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
            expect(resultsList.isDisplayed()).toBeFalsy();
            expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessageBackLink.isDisplayed()).toBeFalsy();

        });

    });

    describe('when opened with invalid points in query params', function () {

        it ('should display that route was not found', function () {

            browser.get(helpers.getSearchPage() + "/?w0=" + "a" + "&w1=" + "b");

            notEnoughInformationMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION));
            noRouteFoundMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND));
            resultsList = element(by.css(helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST));

            expect(notEnoughInformationMessage.isDisplayed()).toBeFalsy();
            expect(noRouteFoundMessage.isDisplayed()).toBeTruthy();
            expect(resultsList.isDisplayed()).toBeFalsy();

            notEnoughInformationMessageBackLink = element(by.css(
                helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION +
                " " +
                helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));

            noRouteFoundMessageBackLink = element(by.css(
                helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND +
                " " +
                helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));

            expect(notEnoughInformationMessage.isDisplayed()).toBeFalsy();
            expect(noRouteFoundMessage.isDisplayed()).toBeTruthy();
            expect(resultsList.isDisplayed()).toBeFalsy();
            expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeFalsy();
            expect(noRouteFoundMessageBackLink.isDisplayed()).toBeTruthy();

        });

        describe("and visited page before", function () {

            describe('when clicking on back link', function () {

                it('should move user to previous page', function () {

                    browser.get(helpers.getMainPage());
                    browser.get(helpers.getSearchPage() + "/?w0=" + "a" + "&w1=" + "b");

                    noRouteFoundMessageBackLink = element(by.css(
                        helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND +
                        " " +
                        helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));


                    expect(noRouteFoundMessageBackLink.isDisplayed()).toBeTruthy();

                    noRouteFoundMessageBackLink.click();

                    browser.getCurrentUrl().then(function(url) {

                        expect(url).toEqual(helpers.getMainPage());
                    });


                });

            });

        });

    });

    describe('when valid start and destination points in query params', function () {

        it ('should display results with routes', function () {

            browser.get(helpers.getSearchPage() + "/?w0=" + fromPosition + "&w1=" + toPosition);

            notEnoughInformationMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION));
            noRouteFoundMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND));
            resultsList = element(by.css(helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST));

            notEnoughInformationMessageBackLink = element(by.css(
                helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION +
                " " +
                helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));

            noRouteFoundMessageBackLink = element(by.css(
                helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND +
                " " +
                helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));

            expect(notEnoughInformationMessage.isDisplayed()).toBeFalsy();
            expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
            expect(resultsList.isDisplayed()).toBeTruthy();
            expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeFalsy();
            expect(noRouteFoundMessageBackLink.isDisplayed()).toBeFalsy();

        });

        describe('when clicked on result', function () {

            it('should redirect to route details page', function () {

                var number = 0;

                browser.get(helpers.getSearchPage() + "/?w0=" + fromPosition + "&w1=" + toPosition);
                
                resultsList = element.all(by.css(helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST + ' li'));

                resultsList.first().click();

                browser.getCurrentUrl().then(function(url) {

                    expect(url).toEqual(helpers.getRouteDetailsPage() + "/" + number);
                });

            });

        });

        describe('when valid middle way point in query params', function () {

            it ('should display results with routes', function () {

                browser.get(helpers.getSearchPage() + "/?w0=" + fromPosition + "&w1=" + wayPoints[0] + "&w2=" + toPosition);

                notEnoughInformationMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION));
                noRouteFoundMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND));
                resultsList = element(by.css(helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST));

                notEnoughInformationMessageBackLink = element(by.css(
                    helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION +
                    " " +
                    helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));

                noRouteFoundMessageBackLink = element(by.css(
                    helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND +
                    " " +
                    helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));

                expect(notEnoughInformationMessage.isDisplayed()).toBeFalsy();
                expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
                expect(resultsList.isDisplayed()).toBeTruthy();
                expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeFalsy();
                expect(noRouteFoundMessageBackLink.isDisplayed()).toBeFalsy();

            });

        });

        describe('when NOT valid middle way point in query params', function () {

            it ('should display that there is no route found for that query', function () {

                browser.get(helpers.getSearchPage() + "/?w0=" + fromPosition + "&w1=" + "abcdefg" + "&w2=" + toPosition);

                notEnoughInformationMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION));
                noRouteFoundMessage = element(by.css(helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND));
                resultsList = element(by.css(helpers.SELECTORS.SEARCH_PAGE.RESULTS_LIST));

                notEnoughInformationMessageBackLink = element(by.css(
                    helpers.SELECTORS.SEARCH_PAGE.NOT_ENOUGH_INFORMATION +
                    " " +
                    helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));

                noRouteFoundMessageBackLink = element(by.css(
                    helpers.SELECTORS.SEARCH_PAGE.NO_ROUTES_FOUND +
                    " " +
                    helpers.SELECTORS.SEARCH_PAGE.BACK_LINK));

                expect(notEnoughInformationMessage.isDisplayed()).toBeFalsy();
                expect(noRouteFoundMessage.isDisplayed()).toBeTruthy();

                expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeFalsy();
                expect(noRouteFoundMessageBackLink.isDisplayed()).toBeTruthy();

            });

        });

    });

});