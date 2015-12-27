describe('colorThemesService', function () {

    'use strict';

    beforeEach(module('navigationApp.services'));


    describe ('getColor', function () {

        describe('when not supported theme passed', function () {

            it('should use POSITIVE_THEME as default', inject(function (colorThemesService) {

                expect(colorThemesService.getColor(undefined)).toBe('blue');
                expect(colorThemesService.getColor(undefined)).toBe('green');
                expect(colorThemesService.getColor(undefined)).toBe('gray');
                expect(colorThemesService.getColor(undefined)).toBe('navy');

            }));
        });

        describe('when POSITIVE theme passed', function () {

            it('should use POSITIVE_THEME as default', inject(function (colorThemesService) {

                expect(colorThemesService.getColor(colorThemesService.POSITIVE_THEME)).toBe('blue');
                expect(colorThemesService.getColor(colorThemesService.POSITIVE_THEME)).toBe('green');
                expect(colorThemesService.getColor(colorThemesService.POSITIVE_THEME)).toBe('gray');
                expect(colorThemesService.getColor(colorThemesService.POSITIVE_THEME)).toBe('navy');

            }));
        });

        describe('when NEGAVITE theme passed', function () {

            it('should use POSITIVE_THEME as default', inject(function (colorThemesService) {

                expect(colorThemesService.getColor(colorThemesService.NEGATIVE_THEME)).toBe('red');
                expect(colorThemesService.getColor(colorThemesService.NEGATIVE_THEME)).toBe('yellow');
                expect(colorThemesService.getColor(colorThemesService.NEGATIVE_THEME)).toBe('orange');
                expect(colorThemesService.getColor(colorThemesService.NEGATIVE_THEME)).toBe('pink');

            }));
        });

    });

});