describe('map directive', function () {

    "use strict";

    var mapApiService,
        routingService,
        events,

        $scope,
        $compile,
        $document,
        $window;

    beforeEach(module("navigationApp.directives"));

    //beforeEach(inject(function (_$rootScope_, _$compile_, _$document_, _$window_, _mapApiService_, _routingService_, _events_) {
    //beforeEach(inject(function (_$compile_, _mapApiService_) {
    beforeEach(inject(function (_$rootScope_, _$compile_) {

        //mapApiService = {
        //    init: function () {}
        //};

        //mapApiService = _mapApiService_;
        //routingService = _routingService_;
        //events = _events_;

        $compile = _$compile_;
        //$document = _$document_;
        //$scope = _$rootScope_.$new();
        //$window = _$window_;

    }));

    describe('after initialization', function () {

        it('should attach itself to element', function () {

            //var element = angular.element('<div data-map>');
            //
            //$compile(element)();

        });

    });

});