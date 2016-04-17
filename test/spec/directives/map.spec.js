//describe('map directive', function () {
//
//    "use strict";
//
//    var mapApiService,
//        routingService,
//        events,
//
//        $scope,
//        $compile,
//        $rootScope,
//        $document,
//        $window;
//
//    beforeEach(module("navigationApp.directives"));
//
//    //beforeEach(inject(function (_$rootScope_, _$compile_, _$document_, _$window_, _mapApiService_, _routingService_, _events_) {
//    //beforeEach(inject(function (_$compile_, _mapApiService_) {
//    beforeEach(inject(function (_$rootScope_, _$compile_) {
//
//        //mapApiService = {
//        //    init: function () {}
//        //};
//
//        //console.log(_mapApiService_);
//
//        //mapApiService = _mapApiService_;
//        //routingService = _routingService_;
//        //events = _events_;
//
//        $rootScope = _$rootScope_;
//        $compile = _$compile_;
//        //$document = _$document_;
//        //$scope = _$rootScope_.$new();
//        //$window = _$window_;
//
//    }));
//
//    describe('after initialization', function () {
//
//        it('should attach itself to element', inject(function ($rootScope, $compile) {
//
//            //mapsjs = _mapsjs_;
//            //map = new mapsjs.Map();
//            //mapsjs.Map.and.returnValue(map);
//            //
//            //elm = angular.element('<div data-here-map ' +
//            //'data-here-default-latitude="52" ' +
//            //'data-here-default-longitude="13" ' +
//            //'data-here-default-zoom-level="3" ' +
//            //'data-here-default-type="\'satellite\'" ' +
//            //'><div class="map-jsla"></div></div>');
//            //
//            //scope = $rootScope.$new();
//            //
//            //element = $compile(elm)(scope);
//            //
//            //scope.$digest();
//
//            //var element = angular.element('<div data-map>');
//            //
//            //var scope = $rootScope.$new();
//            //
//            //$compile(element)(scope, mapApiService);
//            //
//            //scope.$digest();
//
//        }));
//
//    });
//
//});



//describe('map', function () {
//
//    "use strict";
//
//    var mapApiService,
//        $scope,
//        $rootScope,
//        $compile;
//
//    beforeEach(module("navigationApp.directives"));
//
//    beforeEach(module(function ($provide) {
//
//        mapApiService = {};
//
//        $provide.provider('mapApiService', mapApiService);
//    }));
//
//    beforeEach(inject(function (_$rootScope_, _$compile_, $injector) {
//
//        $compile = _$compile_;
//        $rootScope = $injector.get('$rootScope');
//        $scope = _$rootScope_.$new();
//
//    }));
//
//    describe("initialization", function () {
//
//        it("should ", inject(function () {
//
//            var element = angular.element('<div data-map></div>');
//            $compile(element)($scope);
//
//        }));
//    });
//
//});