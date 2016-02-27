angular.module('navigationApp.directives').directive('searchField', ['searchService',  function(searchService) {

    'use strict';

    var suggestions = [],
        serviceHandler;

    var link = function (scope, element, attrs, controller) {

        var getSuggestions = function (searchValue){

            scope.suggestions = [];

            if (serviceHandler) {
                serviceHandler.cancel();
            }

            serviceHandler = searchService.getSuggestions(searchValue, null);

            serviceHandler.promise.then(function (httpResponse) {

                if (httpResponse && httpResponse.status === 200 && httpResponse.data) {
                    scope.suggestions = httpResponse.data.suggestions;
                    console.log('res: ', scope.suggestions);
                }
            })

        };

        element.bind('keyup', function() {

            getSuggestions(element.val());
        });

        scope.$watch(scope.suggestions, function (suggestions) {

            console.log('suggestions');
            console.log(scope.suggestions);
        });
    };

    var controller = function () {

    };

    //var getSuggestions = function () {
    //
    //    //if (suggestions) {
    //    //    console.log(suggestions);
    //    //}
    //
    //    suggestions = searchService.getSuggestions($scope.searchValue, null);
    //
    //    suggestions.then(function (httpResponse) {
    //
    //        console.log(arguments);
    //
    //        if (httpResponse && httpResponse.status === 200 && httpResponse.data) {
    //            console.log(httpResponse.data.suggestions);
    //        }
    //    })
    //};

    //var getSuggestions = function (searchValue){
    //
    //    suggestions = [];
    //
    //    if (serviceHandler) {
    //        serviceHandler.cancel();
    //    }
    //
    //    serviceHandler = searchService.getSuggestions(searchValue, null);
    //
    //    serviceHandler.promise.then(function (httpResponse) {
    //
    //        if (httpResponse && httpResponse.status === 200 && httpResponse.data) {
    //            suggestions = httpResponse.data.suggestions;
    //            console.log(suggestions);
    //        }
    //    })
    //
    //};

    var scope = {
        currentPosition: '=currentPosition',
        suggestions: '=suggestions'
    };

    return {
        restrict: 'A',
        templateUrl: '/scripts/directives/suggestions.html',
        scope: scope,
        link: link,
        controller: controller
    };

}]);