describe('backButton', function () {

    "use strict";

    var $window,
        $scope,
        $compile;

    beforeEach(module("navigationApp.directives"));
    beforeEach(inject(function (_$rootScope_, _$compile_, _$window_) {

        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $window = _$window_;

    }));

    describe('when clicked', function () {

        it('should use history to navigate back', inject(function () {

            $window.history.back = jasmine.createSpy('$window.history.back');

            var element = angular.element('<button data-back-button>back</button>');
            $compile(element)($scope);

            //element.isolateScope().showModal = jasmine.createSpy('showModal').and.callThrough();
            element.triggerHandler('click');

            expect($window.history.back).toHaveBeenCalled();

        }));

    });

});