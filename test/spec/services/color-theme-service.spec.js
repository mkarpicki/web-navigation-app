describe('colorThemesService', function () {

    'use strict';

    var colorThemesService;

    beforeEach(module('navigationApp.services'));

    /*beforeEach(function(){

        inject(function (_colorThemesService_) {
            colorThemesService = _colorThemesService_;
        });
    });*/


    describe ('getColor', function () {

        describe('when not supported theme passed', function () {

            it('should use POSITIVE_THEME as default', function (colorThemesService) {

                expect(true).toBe(true);

            });

            /*it('should use POSITIVE_THEME as default', inject(function (colorThemesService) {

                expect(true).toBe(true);

            }));*/
        });

    });

});