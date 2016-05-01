///**
// * Created by mariuszkarpicki on 01/05/16.
// */
//
//describe('togglePanels', function () {
//
//    "use strict";
//
//    var $window,
//        $scope,
//        $compile;
//
//    beforeEach(module("navigationApp.directives"));
//    beforeEach(inject(function (_$rootScope_, _$compile_, _$window_) {
//
//        $compile = _$compile_;
//        $scope = _$rootScope_.$new();
//        $window = _$window_;
//
//    }));
//
//    describe('when initialized', function () {
//
//        it('should set toggle value based on scope param', inject(function () {
//
//            var element = angular.element('<button data-toggle-panels data-toggled="function(){ return true; }"></button>');
//            $compile(element)($scope);
//
//            //expect($scope.toggled).toEqual(true);
//
//        }));
//
//    });
//
//});