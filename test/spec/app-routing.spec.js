describe('app-routing', function(){

    'use strict';

    var $route,
        $location,
        $scope,
        $httpBackend;

    beforeEach(module('navigationApp'));

    //beforeEach(function () {
    //    module('myApp');
    //});

    beforeEach(inject(function (_$httpBackend_, _$route_, _$location_, $rootScope) {

        $httpBackend = _$httpBackend_;
        $route = _$route_;
        $location = _$location_;
        $scope = $rootScope.$new();
    }));

    describe('when requested main page ("/")', function () {

        it('should load the form.html template', function(){

            $httpBackend.whenGET('templates/form.html').respond('...');

            $scope.$apply(function() {
                $location.path('/');
            });

            expect($route.current.templateUrl).toEqual('templates/form.html');
            expect($route.current.controller).toEqual('FormController');
        });

    });

    describe('when requested search page ("/search")', function () {

        it('should load the search-results.html template', function(){

            $httpBackend.whenGET('templates/search-results.html').respond('...');

            $scope.$apply(function() {
                $location.path('/search');
            });

            expect($route.current.templateUrl).toEqual('templates/search-results.html');
            expect($route.current.controller).toEqual('SearchController');
        });

    });

    describe('when requested route page and route index in path ("/route/:index")', function () {

        it('should load the route.html template', function(){

            $httpBackend.whenGET('templates/route.html').respond('...');

            $scope.$apply(function() {
                $location.path('/route/666');
            });

            expect($route.current.templateUrl).toEqual('templates/route.html');
            expect($route.current.controller).toEqual('RouteController');
        });

        describe('when requested route page and route index in path not delivered', function () {

            it('should load the form.html template', function(){

                $httpBackend.whenGET('templates/form.html').respond('...');

                $scope.$apply(function() {
                    $location.path('/route');
                });

                expect($route.current.templateUrl).toEqual('templates/form.html');
                expect($route.current.controller).toEqual('FormController');
            });

        });

    });

    describe('when requested any not supported page page and route index in path ("/anything-else")', function () {

        it('should load the form.html template', function(){

            $httpBackend.whenGET('templates/form.html').respond('...');

            $scope.$apply(function() {
                $location.path('/anything-else');
            });

            expect($route.current.templateUrl).toEqual('templates/form.html');
            expect($route.current.controller).toEqual('FormController');
        });

    });


});