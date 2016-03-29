
/**
 * @readme
 * This is only example script with e2e tests supported by protractor 2.5.1
 * http://angular.github.io/protractor/#/tutorial
 * @todo
 * add back button when list displayed (??)
 * **/

var helpers = require('./helpers.js');

describe('Search page', function() {

    var wayPoints = [],

        notEnoughInformationMessage,
        noRouteFoundMessage,
        resultsList,

        notEnoughInformationMessageBackLink,
        noRouteFoundMessageBackLink;


    beforeEach(function () {

        wayPoints = [
            'Warsaw|52.23558,21.01027',
            'Szczecin|53.42521,14.55549',
            'Berlin|52.51607,13.37699'
        ];

    });

    describe('when opened without query params', function () {

        it ('should display that there is not enough info to search', function () {

            browser.get(helpers.SEARCH_RESULTS_PAGE.getPage());

            notEnoughInformationMessage = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationElement();
            noRouteFoundMessage = helpers.SEARCH_RESULTS_PAGE.getNoRoutesFoundElement();
            resultsList = helpers.SEARCH_RESULTS_PAGE.getResults();

            notEnoughInformationMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationMessageBackLink();
            noRouteFoundMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNoRouteFoundMessageBackLink();

            expect(notEnoughInformationMessage.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
            expect(resultsList.isDisplayed()).toBeFalsy();

            expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessageBackLink.isDisplayed()).toBeFalsy();

        });

        describe("and visited page before", function () {

            describe('when clicking on back link', function () {

                it('should move user to previous page', function () {

                    browser.get(helpers.FORM_PAGE.getPage());
                    browser.get(helpers.SEARCH_RESULTS_PAGE.getPage());

                    notEnoughInformationMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationMessageBackLink();

                    expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeTruthy();

                    notEnoughInformationMessageBackLink.click();

                    browser.getCurrentUrl().then(function(url) {

                        expect(url).toEqual(helpers.FORM_PAGE.getPage());
                    });


                });

            });

        });

    });

    describe('when opened with only start point in query params', function () {

        it ('should display that there is not enough info to search', function () {

            var startPoint = 'Warsaw|52.23558,21.01027';

            browser.get(helpers.SEARCH_RESULTS_PAGE.getPage() + "/?w0=" + encodeURIComponent(startPoint));

            notEnoughInformationMessage = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationElement();
            noRouteFoundMessage = helpers.SEARCH_RESULTS_PAGE.getNoRoutesFoundElement();
            resultsList = helpers.SEARCH_RESULTS_PAGE.getResults();

            notEnoughInformationMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationMessageBackLink();
            noRouteFoundMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNoRouteFoundMessageBackLink();

            expect(notEnoughInformationMessage.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
            expect(resultsList.isDisplayed()).toBeFalsy();
            expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessageBackLink.isDisplayed()).toBeFalsy();

        });

    });

    describe('when opened with only destination point in query params', function () {

        it ('should display that there is not enough info to search', function () {

            var destinationPoint = 'Warsaw|52.23558,21.01027';

            browser.get(helpers.SEARCH_RESULTS_PAGE.getPage() + "/?w0=" + encodeURIComponent(destinationPoint));

            notEnoughInformationMessage = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationElement();
            noRouteFoundMessage = helpers.SEARCH_RESULTS_PAGE.getNoRoutesFoundElement();
            resultsList = helpers.SEARCH_RESULTS_PAGE.getResults();

            notEnoughInformationMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationMessageBackLink();
            noRouteFoundMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNoRouteFoundMessageBackLink();

            expect(notEnoughInformationMessage.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
            expect(resultsList.isDisplayed()).toBeFalsy();
            expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessageBackLink.isDisplayed()).toBeFalsy();

        });

    });

    describe('when opened with invalid points in query params', function () {

        it ('should display that route was not found', function () {

            browser.get(helpers.SEARCH_RESULTS_PAGE.getPage() + "/?w0=" + "/?w0=" + "a" + "&w1=" + "b");

            notEnoughInformationMessage = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationElement();
            noRouteFoundMessage = helpers.SEARCH_RESULTS_PAGE.getNoRoutesFoundElement();
            resultsList = helpers.SEARCH_RESULTS_PAGE.getResults();

            notEnoughInformationMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationMessageBackLink();
            noRouteFoundMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNoRouteFoundMessageBackLink();

            expect(notEnoughInformationMessage.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
            expect(resultsList.isDisplayed()).toBeFalsy();
            expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeTruthy();
            expect(noRouteFoundMessageBackLink.isDisplayed()).toBeFalsy();

        });

        describe("and visited page before", function () {

            describe('when clicking on back link', function () {

                it('should move user to previous page', function () {

                    browser.get(helpers.FORM_PAGE.getPage());
                    browser.get(helpers.SEARCH_RESULTS_PAGE.getPage() + "/?w0=" + "/?w0=" + "a" + "&w1=" + "b");

                    notEnoughInformationMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationMessageBackLink();
                    notEnoughInformationMessageBackLink.click();

                    browser.getCurrentUrl().then(function(url) {

                        expect(url).toEqual(helpers.FORM_PAGE.getPage());
                    });

                });

            });

        });

    });

    describe('when valid start and destination points in query params', function () {

        it ('should display results with routes', function () {

            var url = helpers.SEARCH_RESULTS_PAGE.getPage() +
                "?w0=" + encodeURIComponent(wayPoints[0]) +
                "&w1=" + encodeURIComponent(wayPoints[1]) +
                "&w2=" + encodeURIComponent(wayPoints[2]);

            browser.get(url);

            notEnoughInformationMessage = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationElement();
            noRouteFoundMessage = helpers.SEARCH_RESULTS_PAGE.getNoRoutesFoundElement();
            resultsList = helpers.SEARCH_RESULTS_PAGE.getResults();

            notEnoughInformationMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationMessageBackLink();
            noRouteFoundMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNoRouteFoundMessageBackLink();

            expect(notEnoughInformationMessage.isDisplayed()).toBeFalsy();
            expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
            expect(resultsList.isDisplayed()).toBeTruthy();
            expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeFalsy();
            expect(noRouteFoundMessageBackLink.isDisplayed()).toBeFalsy();

        });

        describe('when clicked on first result', function () {

            it('should redirect to route details page', function () {

                var url = helpers.SEARCH_RESULTS_PAGE.getPage() +
                    "?w0=" + encodeURIComponent(wayPoints[0]) +
                    "&w1=" + encodeURIComponent(wayPoints[1]) +
                    "&w2=" + encodeURIComponent(wayPoints[2]);

                browser.get(url);

                var position = 0;

                var firstItem = helpers.SEARCH_RESULTS_PAGE.getFirstResult();

                browser.wait(firstItem.isDisplayed()).then(function () {

                    firstItem.click();

                    browser.getCurrentUrl().then(function (url) {

                        expect(url).toEqual(helpers.ROUTE_DETAILS_PAGE.getPage() + "/" + position);
                    });
                });

            });

        });

        describe('when valid middle way point in query params', function () {

            it ('should display results with routes', function () {

                var url = helpers.SEARCH_RESULTS_PAGE.getPage() +
                    "?w0=" + encodeURIComponent(wayPoints[0]) +
                    "&w1=" + encodeURIComponent(wayPoints[1]) +
                    "&w2=" + encodeURIComponent(wayPoints[2]);

                browser.get(url);

                notEnoughInformationMessage = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationElement();
                noRouteFoundMessage = helpers.SEARCH_RESULTS_PAGE.getNoRoutesFoundElement();
                resultsList = helpers.SEARCH_RESULTS_PAGE.getResults();

                notEnoughInformationMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationMessageBackLink();
                noRouteFoundMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNoRouteFoundMessageBackLink();

                expect(notEnoughInformationMessage.isDisplayed()).toBeFalsy();
                expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
                expect(resultsList.isDisplayed()).toBeTruthy();
                expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeFalsy();
                expect(noRouteFoundMessageBackLink.isDisplayed()).toBeFalsy();

            });

        });

        describe('when NOT valid middle way point in query params', function () {

            it ('should use valid way points to calculate route', function () {

                wayPoints[1] = 'abcdef';

                var url = helpers.SEARCH_RESULTS_PAGE.getPage() +
                    "?w0=" + encodeURIComponent(wayPoints[0]) +
                    "&w1=" + encodeURIComponent(wayPoints[1]) +
                    "&w2=" + encodeURIComponent(wayPoints[2]);

                browser.get(url);

                notEnoughInformationMessage = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationElement();
                noRouteFoundMessage = helpers.SEARCH_RESULTS_PAGE.getNoRoutesFoundElement();
                resultsList = helpers.SEARCH_RESULTS_PAGE.getResults();

                notEnoughInformationMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNotEnoughInformationMessageBackLink();
                noRouteFoundMessageBackLink = helpers.SEARCH_RESULTS_PAGE.getNoRouteFoundMessageBackLink();

                expect(notEnoughInformationMessage.isDisplayed()).toBeFalsy();
                expect(noRouteFoundMessage.isDisplayed()).toBeFalsy();
                expect(resultsList.isDisplayed()).toBeTruthy();
                expect(notEnoughInformationMessageBackLink.isDisplayed()).toBeFalsy();
                expect(noRouteFoundMessageBackLink.isDisplayed()).toBeFalsy();

            });

        });

    });

});