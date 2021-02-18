/**
 * @todo - probably I should be rendered from some backend to be different depending on environment (r&d, qa, prod etc.)
 * @todo - if will use it, change to api-key and updated HERE services
 */
angular.module('navigationApp').value('config', {

    APP_ID : 'liPUlG1X9d2MjU26rjk4',
    APP_CODE : '',

    AVOID_AREA_IN_METERS: 120,

    NUMBER_OF_METERS_FROM_WAY_POINT_TO_MARK_AS_VISITED: 10,
    NUMBER_OF_METERS_FROM_ROUTE_TO_RECALCULATE: 10,
    NUMBER_OF_METERS_OF_POSITION_CHANGED_TO_REACT: 5,

    NUMBER_OF_SEARCH_SUGGESTIONS: 5,

    PLACES_API_HOST: 'https://places.api.here.com',
    ROUTING_API_HOST: 'https://route.api.here.com'
});
