/**
 * @todo maybe use dieeferent way to define me :]
 * @todo - probably I should be rendered from some backend to be different depending on environment (r&d, qa, prod etc.)
 */
angular.module('navigationApp.services').factory('config', ['$window', function ($window) {

    'use strict';

    var appId = '6HRrANORgYjdfDFtrTID',
        appCode = 'D4Mlaon1qumiQ9goQ4k9lQ';

    return {
        APP_ID: appId,
        APP_CODE: appCode
    };
}]);
