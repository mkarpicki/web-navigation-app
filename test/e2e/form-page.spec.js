
/**
 * @readme
 * This is only example script with e2e tests supported by protractor 2.5.1
 * http://angular.github.io/protractor/#/tutorial
 * **/

var helpers = require('./helpers.js');

describe('Main page (form page)', function() {

    var fromPosition,
        toPosition,
        wayPoints = [];

    beforeEach(function () {

        fromPosition = '52.52096291446619,13.411852988615038';
        toPosition = '52.515792286169,13.457085761442187';

        wayPoints.push('52.5231951048162,13.430666774511337');
        wayPoints.push('52.5182695619384,13.434885218739595');

    });

    beforeEach(function() {

        browser.get(helpers.getMainPage());
    });

    describe('get route button', function () {

        it('should redirect to search results page after entering start and destination positions', function() {

            element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_FROM)).sendKeys(fromPosition);
            element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_TO)).sendKeys(toPosition);
            element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_GET_ROUTE)).first().click();

            browser.getCurrentUrl().then(function(url) {
                expect(url).toEqual(helpers.getSearchPage() + "?w0=" + fromPosition + "&w1=" + toPosition);
            });

        });

        describe('and middle way points are added', function () {

            it('should redirect to search results page with middle way points', function () {

                var expectedUrl = helpers.getSearchPage() + "?w0=" + fromPosition + "&w1=" + wayPoints[0] + "&w2=" + wayPoints[1] + "&w3=" + toPosition;

                element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_FROM)).sendKeys(fromPosition);

                element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_ADD_WAY_POINT)).first().click();
                element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_WAY_POINT + 0)).sendKeys(wayPoints[0]);

                element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_ADD_WAY_POINT)).first().click();
                element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_WAY_POINT + 1)).sendKeys(wayPoints[1]);

                element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_TO)).sendKeys(toPosition);
                element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_GET_ROUTE)).first().click();

                browser.getCurrentUrl().then(function(url) {

                    expect(url).toEqual(expectedUrl);
                });

            });

        });

    });

    describe('clear button', function () {

        it('should provide clear functionality that rests form', function () {

            element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_FROM)).sendKeys(fromPosition);
            element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_TO)).sendKeys(toPosition);

            expect(element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_FROM)).getAttribute('value')).toEqual(fromPosition);
            expect(element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_TO)).getAttribute('value')).toEqual(toPosition);

            element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_CLEAR)).first().click();

            expect(element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_FROM)).getAttribute('value')).toEqual('');
            expect(element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_TO)).getAttribute('value')).toEqual('');

        });

        describe('and middle way points are added', function () {

            it('should provide clear functionality that rests form (incl. way points)', function () {

                element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_FROM)).sendKeys(fromPosition);
                element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_TO)).sendKeys(toPosition);

                element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_ADD_WAY_POINT)).first().click();
                element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_WAY_POINT + 0)).sendKeys(wayPoints[0]);

                expect(element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_FROM)).getAttribute('value')).toEqual(fromPosition);
                expect(element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_TO)).getAttribute('value')).toEqual(toPosition);
                expect(element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_WAY_POINT + 0)).getAttribute('value')).toEqual(wayPoints[0]);

                element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_CLEAR)).first().click();

                expect(element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_FROM)).getAttribute('value')).toEqual('');
                expect(element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_TO)).getAttribute('value')).toEqual('');

                var wayPoint0 = element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_WAY_POINT + 0));

                expect(wayPoint0.isPresent()).toBeFalsy();

            });

        });

    });

    it('should allow to remove add way points', function () {

        var expectedUrl;

        element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_FROM)).sendKeys(fromPosition);

        element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_ADD_WAY_POINT)).first().click();
        element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_WAY_POINT + 0)).sendKeys(wayPoints[0]);

        element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_ADD_WAY_POINT)).first().click();
        element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_WAY_POINT + 1)).sendKeys(wayPoints[1]);

        element.all(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_TO)).sendKeys(toPosition);

        element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_REMOVE_WAY_POINT)).last().click();

        browser.getCurrentUrl().then(function(url) {

            expectedUrl = helpers.getMainPage() + "?w0=" + fromPosition + "&w1=" + wayPoints[0] + "&w2=" + toPosition;

            expect(url).toEqual(expectedUrl);
        });

        element.all(by.css(helpers.SELECTORS.FORM_PAGE.BTN_REMOVE_WAY_POINT)).last().click();

        browser.getCurrentUrl().then(function(url) {

            expectedUrl = helpers.getMainPage() + "?w0=" + fromPosition + "&w1=" + toPosition;

            expect(url).toEqual(expectedUrl);
        });

    });

    describe('when opened with params in url', function () {

        it('should pre fill form information', function () {

            var url = helpers.getMainPage() + "?w0=" + fromPosition + "&w1=" + toPosition;

            browser.get(url);

            expect(element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_FROM)).getAttribute('value')).toEqual(fromPosition);
            expect(element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_TO)).getAttribute('value')).toEqual(toPosition);

            var wayPoint0 = element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_WAY_POINT + 0));

            expect(wayPoint0.isPresent()).toBeFalsy();

        });

        describe('with way point added', function () {

            it('should pre fill form information including way point', function () {

                var url = helpers.getMainPage() + "?w0=" + fromPosition + "&w1=" + wayPoints[0] + "&w2=" + toPosition;

                browser.get(url);

                expect(element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_FROM)).getAttribute('value')).toEqual(fromPosition);
                expect(element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_TO)).getAttribute('value')).toEqual(toPosition);
                expect(element(by.css(helpers.SELECTORS.FORM_PAGE.INPUT_WAY_POINT + 0)).getAttribute('value')).toEqual(wayPoints[0]);

            });

        });

    });

});


