angular.module('navigationApp.directives', []).directive('map', function() {

    var link = function (scope, element, attrs) {

        scope.$watch(attrs.centerPosition, function (value) {
            //console.log('m:' + value);
        });

    };

    var scope = {
        centerPosition: '=centerPosition'

    };

    var mapDirective = {
        restrict: 'A',
        scope: scope,
        link: link
    };

    return mapDirective;

});