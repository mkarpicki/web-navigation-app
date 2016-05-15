angular.module('navigationApp.controllers', []);
angular.module('navigationApp.services', []);
angular.module('navigationApp.directives', []);
angular.module('navigationApp.filters', []);


angular.module('navigationApp', [
    'ngRoute',
    'navigationApp.filters',
    'navigationApp.controllers',
    'navigationApp.services',
    'navigationApp.directives'
]);
//]).config( function () {});
