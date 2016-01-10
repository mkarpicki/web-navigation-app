
/**
 * @readme
 * This is only example script with e2e tests supported by protractor 2.5.1
 * Probably will split it to some files with utils , sub tests per page etc if will grow up and I will support it
 * http://angular.github.io/protractor/#/tutorial
 * **/
var SELECTORS = {
    INPUT_FROM: '#from',
    INPUT_TO: '#to',
    INPUT_WAY_POINT: '#waypoint-',
    BTN_ADD_WAY_POINT: 'button[data-ng-click="addWayPoint();"]',
    BTN_GET_ROUTE: 'button[data-ng-click="getRoute();"]'
};

var getHost = function() {
    return 'http://0.0.0.0:3000';
};

var urlChanged = function(url) {
    return function () {
        return browser.getCurrentUrl().then(function(actualUrl) {
            return url != actualUrl;
        });
    };
};

describe('Navigation App', function () {

    var fromPosition,
        toPosition,
        wayPoints = [];

    beforeEach(function () {

        fromPosition = '52.52096291446619,13.411852988615038';
        toPosition = '52.515792286169,13.457085761442187';

        wayPoints.push('52.5231951048162,13.430666774511337');
        wayPoints.push('52.5182695619384,13.434885218739595');

    });

    describe('Main page (form page)', function() {

        beforeEach(function() {

            browser.get(getHost());
        });

        it('should redirect to search results page after entering start and destination positions', function() {

            element.all(by.css(SELECTORS.INPUT_FROM)).sendKeys(fromPosition);
            element.all(by.css(SELECTORS.INPUT_TO)).sendKeys(toPosition);
            element.all(by.css(SELECTORS.BTN_GET_ROUTE)).first().click();

            browser.getCurrentUrl().then(function(url) {
                expect(url).toEqual(getHost() + "/search?w0=" + fromPosition + "&w1=" + toPosition);
            });

            //var currentUrl;
            //browser.getCurrentUrl().then(function(url) {
            //    currentUrl = url;
            //}).then(function() {
            //        browser.wait(function() {
            //            return browser.getCurrentUrl().then(function (url) {
            //                return url !== currentUrl;
            //            });
            //        });
            //    }
            //).then(function () {
            //        // continue testing
            //        console.log('me');
            //    });

        });

        describe('and middle way points are added', function () {

            it('should redirect to search results page with middle way points', function () {

                var expectedUrl = getHost() + "/search?w0=" + fromPosition + "&w1=" + wayPoints[0] + "&w2=" + wayPoints[1] + "&w3=" + toPosition;

                element.all(by.css(SELECTORS.INPUT_FROM)).sendKeys(fromPosition);

                element.all(by.css(SELECTORS.BTN_ADD_WAY_POINT)).first().click();
                element.all(by.css(SELECTORS.INPUT_WAY_POINT + 0)).sendKeys(wayPoints[0]);

                element.all(by.css(SELECTORS.BTN_ADD_WAY_POINT)).first().click();
                element.all(by.css(SELECTORS.INPUT_WAY_POINT + 1)).sendKeys(wayPoints[1]);

                element.all(by.css(SELECTORS.INPUT_TO)).sendKeys(toPosition);
                element.all(by.css(SELECTORS.BTN_GET_ROUTE)).first().click();

                browser.getCurrentUrl().then(function(url) {

                    expect(url).toEqual(expectedUrl);
                });

            });

        });
    });
});

