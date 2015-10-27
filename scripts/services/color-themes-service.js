angular.module('navigationApp.services').factory('colorThemesService', [function () {

    'use strict';

    var POSITIVE_THEME = 0,
        NEGATIVE_THEME = 1;

    var positive = ['blue', 'green', 'gray', 'navy'],
        negative = ['red', 'yellow', 'orange', 'pink'];

    var positiveCounter = 0,
        negativeCounter = 0;

    var themes = [positive, negative],
        counters = [positiveCounter, negativeCounter];

    var getColor = function (theme) {

        if (!theme) {
            theme = POSITIVE_THEME;
        }

        if (counters[theme] === themes[theme].length) {
            counters[theme] = 0;
        }

        return themes[theme][counters[theme]++];
    };

    return {
        getColor: getColor,

        NEGATIVE_THEME: NEGATIVE_THEME,
        POSITIVE_THEME: POSITIVE_THEME
    };
}]);
