describe('map directive', function () {

    "use strict";

    var mapApiService,
        routingService,
        events;

    beforeEach(module("navigationApp.directives"));

    beforeEach(inject(function (_mapApiService_, _routingService_, _events_) {

        mapApiService = _mapApiService_;
        routingService = _routingService_;
        events = _events_;

    }));


});