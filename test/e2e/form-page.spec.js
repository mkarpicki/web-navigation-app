
/**
 * @readme
 * This is only example script with e2e tests supported by protractor 2.5.1
 * http://angular.github.io/protractor/#/tutorial
 * **/

var pageHelpers = require('./page-helpers.js');
var mapHelpers = require('./map-helpers.js');

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

        browser.get(pageHelpers.FORM_PAGE.getPage());
    });

    describe('get route button', function () {

        it('should redirect to search results page after entering start and destination positions', function() {

            pageHelpers.FORM_PAGE.getWayPointByPosition(0).sendKeys(wayPoints[0]);
            suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
            suggestion.click();

            pageHelpers.FORM_PAGE.getWayPointByPosition(1).sendKeys(wayPoints[3]);
            suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
            suggestion.click();

            pageHelpers.FORM_PAGE.getCalculateRouteButton().click();

            browser.getCurrentUrl().then(function(url) {
                expect(pageHelpers.doesUrlContains(url, pageHelpers.SEARCH_RESULTS_PAGE.getPage())).toEqual(true);
                expect(pageHelpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
                expect(pageHelpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[3]))).toEqual(true);
            });

            mapHelpers.countWayPoints().then(function (results) {
                expect(results).toEqual(2);
            });

            mapHelpers.countRoutes().then(function (results) {
                expect(results > 0).toBeTruthy();
            });

        });

        describe('and middle way points are added', function () {

            it('should redirect to search results page with middle way points', function () {

                pageHelpers.FORM_PAGE.getAddWayPointButton().click();

                pageHelpers.FORM_PAGE.getWayPointByPosition(0).sendKeys(wayPoints[0]);
                suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
                suggestion.click();

                pageHelpers.FORM_PAGE.getWayPointByPosition(1).sendKeys(wayPoints[1]);
                suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
                suggestion.click();

                pageHelpers.FORM_PAGE.getWayPointByPosition(2).sendKeys(wayPoints[3]);
                suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
                suggestion.click();

                pageHelpers.FORM_PAGE.getCalculateRouteButton().click();

                browser.getCurrentUrl().then(function(url) {

                    expect(pageHelpers.doesUrlContains(url, pageHelpers.SEARCH_RESULTS_PAGE.getPage())).toEqual(true);
                    expect(pageHelpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
                    expect(pageHelpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[1]))).toEqual(true);
                    expect(pageHelpers.doesUrlContains(url, "w2=" + encodeURIComponent(wayPoints[3]))).toEqual(true);
                });

                mapHelpers.countWayPoints().then(function (results) {
                    expect(results).toEqual(3);
                });

                mapHelpers.countRoutes().then(function (results) {
                    expect(results > 0).toBeTruthy();
                });

            });

        });

    });

    describe('clear button', function () {

        it('should provide clear functionality that rests form', function () {

            pageHelpers.FORM_PAGE.getWayPointByPosition(0).sendKeys(wayPoints[0]);
            suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
            suggestion.click();

            pageHelpers.FORM_PAGE.getWayPointByPosition(1).sendKeys(wayPoints[3]);
            suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
            suggestion.click();
            
            expect(pageHelpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual(wayPoints[0]);
            expect(pageHelpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual(wayPoints[3]);

            pageHelpers.FORM_PAGE.getClearButton().click();

            expect(pageHelpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual('');
            expect(pageHelpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual('');

        });

        describe('and middle way points are added', function () {

            it('should provide clear functionality that rests form (incl. way points)', function () {

                pageHelpers.FORM_PAGE.getAddWayPointButton().click();

                pageHelpers.FORM_PAGE.getWayPointByPosition(0).sendKeys(wayPoints[0]);
                suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
                suggestion.click();

                pageHelpers.FORM_PAGE.getWayPointByPosition(1).sendKeys(wayPoints[1]);
                suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
                suggestion.click();

                pageHelpers.FORM_PAGE.getWayPointByPosition(2).sendKeys(wayPoints[3]);
                suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
                suggestion.click();
                
                expect(pageHelpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual(wayPoints[0]);
                expect(pageHelpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual(wayPoints[1]);
                expect(pageHelpers.FORM_PAGE.getWayPointByPosition(2).getAttribute('value')).toEqual(wayPoints[3]);

                expect(pageHelpers.FORM_PAGE.getWayPoints().count()).toEqual(3);

                pageHelpers.FORM_PAGE.getClearButton().click();

                expect(pageHelpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual('');
                expect(pageHelpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual('');

                expect(pageHelpers.FORM_PAGE.getWayPoints().count()).toEqual(2);

            });

        });

    });

    it('should allow shuffle way points', function () {

        wayPoints[0] = "Warsaw";
        wayPoints[1] = "Poznan";
        wayPoints[2] = "Szczecin";
        wayPoints[3] = "Berlin";

        mapHelpers.countWayPoints().then(function (results) {
            expect(results).toEqual(0);
        });

        mapHelpers.countRoutes().then(function (results) {
            expect(results).toEqual(0);
        });

        pageHelpers.FORM_PAGE.getAddWayPointButton().click();

        pageHelpers.FORM_PAGE.getWayPointByPosition(0).sendKeys(wayPoints[0]);
        suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
        suggestion.click();

        pageHelpers.FORM_PAGE.getWayPointByPosition(1).sendKeys(wayPoints[1]);
        suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
        suggestion.click();

        pageHelpers.FORM_PAGE.getWayPointByPosition(2).sendKeys(wayPoints[3]);
        suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
        suggestion.click();

        browser.getCurrentUrl().then(function(url) {

            expect(pageHelpers.doesUrlContains(url, pageHelpers.FORM_PAGE.getPage())).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[1]))).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w2=" + encodeURIComponent(wayPoints[3]))).toEqual(true);
        });
        //.getAttribute('value')).toEqual(text)

        mapHelpers.countWayPoints().then(function (results) {
            expect(results).toEqual(3);
        });

        var searchValue0 = pageHelpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value'),
            searchValue1 = pageHelpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value'),
            searchValue2 = pageHelpers.FORM_PAGE.getWayPointByPosition(2).getAttribute('value');

        pageHelpers.FORM_PAGE.getMoveDownWayPointButtonByPosition(0).click();

        browser.getCurrentUrl().then(function(url) {

            expect(pageHelpers.doesUrlContains(url, pageHelpers.FORM_PAGE.getPage())).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[1]))).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w2=" + encodeURIComponent(wayPoints[3]))).toEqual(true);
        });

        expect(pageHelpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual(searchValue1);
        expect(pageHelpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual(searchValue0);
        expect(pageHelpers.FORM_PAGE.getWayPointByPosition(2).getAttribute('value')).toEqual(searchValue2);

        mapHelpers.countWayPoints().then(function (results) {
            expect(results).toEqual(3);
        });

        pageHelpers.FORM_PAGE.getMoveUpWayPointButtonByPosition(1).click();

        browser.getCurrentUrl().then(function(url) {

            expect(pageHelpers.doesUrlContains(url, pageHelpers.FORM_PAGE.getPage())).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[1]))).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[3]))).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w2=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
        });

        expect(pageHelpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual(searchValue1);
        expect(pageHelpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual(searchValue2);
        expect(pageHelpers.FORM_PAGE.getWayPointByPosition(2).getAttribute('value')).toEqual(searchValue0);

        mapHelpers.countWayPoints().then(function (results) {
            expect(results).toEqual(3);
        });


    });

    it('should allow to remove add way points', function () {

        mapHelpers.countWayPoints().then(function (results) {
            expect(results).toEqual(0);
        });

        mapHelpers.countRoutes().then(function (results) {
            expect(results).toEqual(0);
        });

        pageHelpers.FORM_PAGE.getAddWayPointButton().click();

        pageHelpers.FORM_PAGE.getWayPointByPosition(0).sendKeys(wayPoints[0]);
        suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
        suggestion.click();

        pageHelpers.FORM_PAGE.getWayPointByPosition(1).sendKeys(wayPoints[1]);
        suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
        suggestion.click();

        pageHelpers.FORM_PAGE.getWayPointByPosition(2).sendKeys(wayPoints[3]);
        suggestion = pageHelpers.FORM_PAGE.getSuggestionByPosition(0);
        suggestion.click();
        
        browser.getCurrentUrl().then(function(url) {

            expect(pageHelpers.doesUrlContains(url, pageHelpers.FORM_PAGE.getPage())).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[1]))).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w2=" + encodeURIComponent(wayPoints[3]))).toEqual(true);
        });

        mapHelpers.countWayPoints().then(function (results) {
            expect(results).toEqual(3);
        });

        pageHelpers.FORM_PAGE.getRemoveWayPointButton().click();

        browser.getCurrentUrl().then(function(url) {

            expect(pageHelpers.doesUrlContains(url, pageHelpers.FORM_PAGE.getPage())).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w0=" + encodeURIComponent(wayPoints[0]))).toEqual(true);
            expect(pageHelpers.doesUrlContains(url, "w1=" + encodeURIComponent(wayPoints[3]))).toEqual(true);

            expect(pageHelpers.FORM_PAGE.getWayPoints().count()).toEqual(2);

        });

        mapHelpers.countWayPoints().then(function (results) {
            expect(results).toEqual(2);
        });

    });

    describe('when opened with params in url', function () {

        it('should pre fill form information', function () {

            var wayPoints = [
                'Warsaw|52.23558,21.01027',
                'Berlin|52.51607,13.37699'
            ];

            var text;

            var url = pageHelpers.FORM_PAGE.getPage() + "?w0=" + encodeURIComponent(wayPoints[0]) + "&w1=" + encodeURIComponent(wayPoints[1]);

            browser.get(url);

            text = wayPoints[0].split("|")[0];
            expect(pageHelpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual(text);

            text = wayPoints[1].split("|")[0];
            expect(pageHelpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual(text);

            mapHelpers.countWayPoints().then(function (results) {
                expect(results).toEqual(2);
            });

        });

        describe('with way point added', function () {

            it('should pre fill form information including way point', function () {

                var wayPoints = [
                    'Warsaw|52.23558,21.01027',
                    'Szczecin|53.42521,14.55549',
                    'Berlin|52.51607,13.37699'
                ];

                var text;

                var url = pageHelpers.FORM_PAGE.getPage() +
                    "?w0=" + encodeURIComponent(wayPoints[0]) +
                    "&w1=" + encodeURIComponent(wayPoints[1]) +
                    "&w2=" + encodeURIComponent(wayPoints[2]);

                browser.get(url);

                text = wayPoints[0].split("|")[0];
                expect(pageHelpers.FORM_PAGE.getWayPointByPosition(0).getAttribute('value')).toEqual(text);

                text = wayPoints[1].split("|")[0];
                expect(pageHelpers.FORM_PAGE.getWayPointByPosition(1).getAttribute('value')).toEqual(text);

                text = wayPoints[2].split("|")[0];
                expect(pageHelpers.FORM_PAGE.getWayPointByPosition(2).getAttribute('value')).toEqual(text);

                mapHelpers.countWayPoints().then(function (results) {
                    expect(results).toEqual(3);
                });

            });

        });

    });

});


