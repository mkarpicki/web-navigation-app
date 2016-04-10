/**
 * @todo - probably I should be rendered from some backend to be different depending on environment (r&d, qa, prod etc.)
 */
angular.module('navigationApp').value('config', {

    APP_ID : '6HRrANORgYjdfDFtrTID',
    APP_CODE : 'D4Mlaon1qumiQ9goQ4k9lQ',

    AVOID_AREA_IN_METERS: 120,

    NUMBER_OF_METERS_FROM_WAY_POINT_TO_MARK_AS_VISITED: 10,
    NUMBER_OF_METERS_FROM_ROUTE_TO_RECALCULATE: 10,
    NUMBER_OF_METERS_OF_POSITION_CHANGED_TO_REACT: 5,

    NUMBER_OF_SEARCH_SUGGESTIONS: 5
});
