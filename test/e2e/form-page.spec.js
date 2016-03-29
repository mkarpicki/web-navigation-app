
/**
 * @readme
 * This is only example script with e2e tests supported by protractor 2.5.1
 * http://angular.github.io/protractor/#/tutorial
 * **/

var helpers = require('./helpers.js');

describe('Main page (form page)', function() {

    var wayPoints = [];
    var suggestion;

    beforeEach(function () {

        wayPoints[0] = "Warsaw";
        wayPoints[1] = "Poznan";
        wayPoints[2] = "Szczecin";
        wayPoints[3] = "Berlin";

    });

    beforeEach(function() {

        browser.get(helpers.FORM_PAGE.getPage());
    });

    describe('get route button', function () {

        it('should redirect to search results page after entering start and destination positions', function() {

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

        });

        describe('and middle way points are added', function () {

            it('should redirect to search results page with middle way points', function () {

                element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_ADD_WAY_POINT)).first().click();


                helpers.FORM_PAGE.getWayPointByPosition(0).sendKeys(wayPoints[0]);
                suggestion = helpers.FORM_PAGE.getSuggestionByPosition(0);
                suggestion.click();

                helpers.FORM_PAGE.getWayPointByPosition(1).sendKeys(wayPoints[1]);
                suggestion = helpers.FORM_PAGE.getSuggestionByPosition(0);
                suggestion.click();

                helpers.FORM_PAGE.getWayPointByPosition(2).sendKeys(wayPoints[3]);
                suggestion = helpers.FORM_PAGE.getSuggestionByPosition(0);
                suggestion.click();

                helpers.FORM_PAGE.getCalculateRouteButton().click();

                browser.getCurrentUrl().then(function(url) {

                    expect(helpers.doesUrlContains(url, helpers.SEARCH_RESULTS_PAGE.getPage())).toEqual(true);
                    expect(helpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
                    expect(helpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[1]))).toEqual(true);
                    expect(helpers.doesUrlContains(url, "w2=" + encodeURIComponent(wayPoints[3]))).toEqual(true);
                });

            });

        });

    });

    describe('clear button', function () {

        it('should provide clear functionality that rests form', function () {

            helpers.FORM_PAGE.getWayPointByPosition(0).sendKeys(wayPoints[0]);
            suggestion = helpers.FORM_PAGE.getSuggestionByPosition(0);
            suggestion.click();

            helpers.FORM_PAGE.getWayPointByPosition(1).sendKeys(wayPoints[3]);
            suggestion = helpers.FORM_PAGE.getSuggestionByPosition(0);
            suggestion.click();
            
            expect(helpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual(wayPoints[0]);
            expect(helpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual(wayPoints[3]);

            element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_CLEAR)).first().click();

            expect(helpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual('');
            expect(helpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual('');

        });

        describe('and middle way points are added', function () {

            it('should provide clear functionality that rests form (incl. way points)', function () {

                element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_ADD_WAY_POINT)).first().click();


                helpers.FORM_PAGE.getWayPointByPosition(0).sendKeys(wayPoints[0]);
                suggestion = helpers.FORM_PAGE.getSuggestionByPosition(0);
                suggestion.click();

                helpers.FORM_PAGE.getWayPointByPosition(1).sendKeys(wayPoints[1]);
                suggestion = helpers.FORM_PAGE.getSuggestionByPosition(0);
                suggestion.click();

                helpers.FORM_PAGE.getWayPointByPosition(2).sendKeys(wayPoints[3]);
                suggestion = helpers.FORM_PAGE.getSuggestionByPosition(0);
                suggestion.click();
                
                expect(helpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual(wayPoints[0]);
                expect(helpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual(wayPoints[1]);
                expect(helpers.FORM_PAGE.getWayPointByPosition(2).getAttribute('value')).toEqual(wayPoints[3]);

                element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_CLEAR)).first().click();

                expect(helpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual('');
                expect(helpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual('');

                var thirdWayPoint = element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_WAY_POINT + 2));

                expect(thirdWayPoint.isPresent()).toBeFalsy();

            });

        });

    });

    it('should allow to remove add way points', function () {

        element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_ADD_WAY_POINT)).first().click();


        helpers.FORM_PAGE.getWayPointByPosition(0).sendKeys(wayPoints[0]);
        suggestion = helpers.FORM_PAGE.getSuggestionByPosition(0);
        suggestion.click();

        helpers.FORM_PAGE.getWayPointByPosition(1).sendKeys(wayPoints[1]);
        suggestion = helpers.FORM_PAGE.getSuggestionByPosition(0);
        suggestion.click();

        helpers.FORM_PAGE.getWayPointByPosition(2).sendKeys(wayPoints[3]);
        suggestion = helpers.FORM_PAGE.getSuggestionByPosition(0);
        suggestion.click();
        
        browser.getCurrentUrl().then(function(url) {

            expect(helpers.doesUrlContains(url, helpers.FORM_PAGE.getPage())).toEqual(true);
            expect(helpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
            expect(helpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[1]))).toEqual(true);
            expect(helpers.doesUrlContains(url, "w2=" + encodeURIComponent(wayPoints[3]))).toEqual(true);
        });

        element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_REMOVE_WAY_POINT)).last().click();

        browser.getCurrentUrl().then(function(url) {

            expect(helpers.doesUrlContains(url, helpers.FORM_PAGE.getPage())).toEqual(true);
            expect(helpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
            expect(helpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[3]))).toEqual(true);

            var thirdWayPoint = element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_WAY_POINT + 2));

            expect(thirdWayPoint.isPresent()).toBeFalsy();
        });

    });

    describe('when opened with params in url', function () {

        it('should pre fill form information', function () {

            var wayPoints = [
                'Warsaw|52.23558,21.01027',
                'Berlin|52.51607,13.37699'
            ];

            var text;

            var url = helpers.FORM_PAGE.getPage() + "?w0=" + encodeURIComponent(wayPoints[0]) + "&w1=" + encodeURIComponent(wayPoints[1]);

            browser.get(url);

            text = wayPoints[0].split("|")[0];
            expect(helpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual(text);

            text = wayPoints[1].split("|")[0];
            expect(helpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual(text);

        });

        describe('with way point added', function () {

            it('should pre fill form information including way point', function () {

                var wayPoints = [
                    'Warsaw|52.23558,21.01027',
                    'Szczecin|53.42521,14.55549',
                    'Berlin|52.51607,13.37699'
                ];

                var text;

                var url = helpers.FORM_PAGE.getPage() +
                    "?w0=" + encodeURIComponent(wayPoints[0]) +
                    "&w1=" + encodeURIComponent(wayPoints[1]) +
                    "&w2=" + encodeURIComponent(wayPoints[2]);

                browser.get(url);

                text = wayPoints[0].split("|")[0];
                expect(helpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual(text);

                text = wayPoints[1].split("|")[0];
                expect(helpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual(text);

                text = wayPoints[2].split("|")[0];
                expect(helpers.FORM_PAGE.getWayPointByPosition(2).getAttribute('value')).toEqual(text);
            });

        });

    });

});


