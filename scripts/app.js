angular.module('navigationApp.controllers', []);
angular.module('navigationApp.services', []);
angular.module('navigationApp.directives', []);


angular.module('navigationApp', [
    'ngRoute',
    'navigationApp.controllers',
    'navigationApp.services',
    'navigationApp.directives'
]).config( function () {});
