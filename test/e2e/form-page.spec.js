
/**
 * @readme
 * This is only example script with e2e tests supported by protractor 2.5.1
 * http://angular.github.io/protractor/#/tutorial
 * **/

var helpers = require('./page-helpers.js');

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

                helpers.FORM_PAGE.getAddWayPointButton().click();

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

            helpers.FORM_PAGE.getClearButton().click();

            expect(helpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual('');
            expect(helpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual('');

        });

        describe('and middle way points are added', function () {

            it('should provide clear functionality that rests form (incl. way points)', function () {

                helpers.FORM_PAGE.getAddWayPointButton().click();

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

                expect(helpers.FORM_PAGE.getWayPoints().count()).toEqual(3);

                helpers.FORM_PAGE.getClearButton().click();

                expect(helpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual('');
                expect(helpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual('');

                expect(helpers.FORM_PAGE.getWayPoints().count()).toEqual(2);

            });

        });

    });

    it('should allow shuffle way points', function () {

        wayPoints[0] = "Warsaw";
        wayPoints[1] = "Poznan";
        wayPoints[2] = "Szczecin";
        wayPoints[3] = "Berlin";

        helpers.FORM_PAGE.getAddWayPointButton().click();

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
        //.getAttribute('value')).toEqual(text)

        var searchValue0 = helpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value'),
            searchValue1 = helpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value'),
            searchValue2 = helpers.FORM_PAGE.getWayPointByPosition(2).getAttribute('value');

        helpers.FORM_PAGE.getMoveDownWayPointButtonByPosition(0).click();

        browser.getCurrentUrl().then(function(url) {

            expect(helpers.doesUrlContains(url, helpers.FORM_PAGE.getPage())).toEqual(true);
            expect(helpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[1]))).toEqual(true);
            expect(helpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
            expect(helpers.doesUrlContains(url, "w2=" + encodeURIComponent(wayPoints[3]))).toEqual(true);
        });

        expect(helpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual(searchValue1);
        expect(helpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual(searchValue0);
        expect(helpers.FORM_PAGE.getWayPointByPosition(2).getAttribute('value')).toEqual(searchValue2);

        helpers.FORM_PAGE.getMoveUpWayPointButtonByPosition(1).click();

        browser.getCurrentUrl().then(function(url) {

            expect(helpers.doesUrlContains(url, helpers.FORM_PAGE.getPage())).toEqual(true);
            expect(helpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[1]))).toEqual(true);
            expect(helpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[3]))).toEqual(true);
            expect(helpers.doesUrlContains(url, "w2=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
        });

        expect(helpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual(searchValue1);
        expect(helpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual(searchValue2);
        expect(helpers.FORM_PAGE.getWayPointByPosition(2).getAttribute('value')).toEqual(searchValue0);

    });

    it('should allow to remove add way points', function () {

        helpers.FORM_PAGE.getAddWayPointButton().click();

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

        helpers.FORM_PAGE.getRemoveWayPointButton().click();

        browser.getCurrentUrl().then(function(url) {

            expect(helpers.doesUrlContains(url, helpers.FORM_PAGE.getPage())).toEqual(true);
            expect(helpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
            expect(helpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[3]))).toEqual(true);

            expect(helpers.FORM_PAGE.getWayPoints().count()).toEqual(2);

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


