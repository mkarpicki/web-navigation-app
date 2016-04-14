/**
 * @readme
 * This is only example script with e2e tests supported by protractor 2.5.1
 * http://angular.github.io/protractor/#/tutorial
 * **/

var pageHelpers = require('./page-helpers.js');
var mapHelpers = require('./map-helpers.js');

describe('Map', function() {


    beforeEach(function () {

        browser.get(pageHelpers.FORM_PAGE.getPage());
    });

    describe('when loaded', function () {

        it('should hide menu', function () {

            var menu = mapHelpers.getMenu();

            expect(menu.isDisplayed()).toBeFalsy();

        });
    });


    describe('when long press on map', function () {

        it('should show menu under pressed position', function () {

        });

    });

});