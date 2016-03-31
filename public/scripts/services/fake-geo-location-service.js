angular.module('navigationApp.services').factory('geoLocationService', ['$interval', '$rootScope',  'events', function ($interval, $rootScope, events) {

    'use strict';

    var watchPosition = function () {

        initGeoLocation();

    };

    var onGeoLocationSuccess = function (position) {

        $rootScope.$broadcast(events.POSITION_EVENT, {
            eventType: events.POSITION_EVENT_TYPES.CHANGE,
            param: position
        });

    };

    var onGeoLocationError = function (error) {

        $rootScope.$broadcast(events.POSITION_EVENT, {
            eventType: events.POSITION_EVENT_TYPES.ERROR,
            param: error
        });

    };

    var initGeoLocation = function (geoLocationObject) {

        //liebig str -> simon-dach-str
        //var steps = ["52.5218782,13.4509329","52.5261927,13.4480166","52.5263643,13.4479094","52.5265253,13.4485209","52.5275552,13.4522867","52.5282526,13.4552157","52.528435,13.4560204","52.528553,13.4567499","52.5287461,13.4577048","52.5293791,13.4605157","52.5295186,13.4612024","52.5298512,13.4625435","52.5302374,13.4639597","52.5322223,13.4727895","52.5329304,13.4760725","52.532984,13.4764588","52.5330698,13.477596","52.5334346,13.4837544","52.5334883,13.4849453","52.5340784,13.4947085","52.534132,13.4964788","52.5341642,13.4985816","52.5342071,13.4997296","52.5349581,13.5113168","52.5352371,13.5158765","52.5353336,13.5172176","52.534765,13.5176575","52.5344002,13.5179472","52.5339282,13.5182905","52.5335848,13.5185051","52.5333488,13.5186338","52.5327909,13.5187948","52.5323081,13.5188699","52.5313318,13.5189557","52.5302052,13.5190845","52.5293577,13.5190952","52.5289822,13.5191274","52.5286603,13.5191917","52.5279415,13.5192668","52.5266111,13.5193312","52.5260854,13.5193312","52.525624,13.5193956","52.5250769,13.5195029","52.5243366,13.5195565","52.5235212,13.5195243","52.5223303,13.519417","52.5194013,13.5192239","52.5165689,13.5190094","52.5145197,13.5188806","52.5118911,13.5188055","52.5109148,13.5187948","52.5103033,13.5187626","52.510035,13.5187626","52.509799,13.5187948","52.5095308,13.5187948","52.5091445,13.518827","52.5088656,13.5188699","52.5079536,13.5192239","52.507385,13.5193527","52.5057864,13.5196638","52.5050139,13.5199535","52.5045633,13.5201895","52.5037372,13.520565","52.5027609,13.5208547","52.502321,13.5210371","52.5013661,13.5213482","52.5010443,13.5214877","52.5004649,13.5216594","52.5001323,13.5217988","52.4999285,13.5219276","52.4998856,13.5213375","52.50054,13.5211337","52.5009692,13.5210049","52.5010443,13.5214877","52.5010765,13.5217452","52.5018704,13.5214555","52.5025678,13.5211337","52.5030613,13.52096"];

        //entry to stargard thru chopina -> wyszynskiego str.
        var steps = ["53.3458509,14.9674579","53.3455431,14.9696124","53.3452749,14.9714148","53.3446956,14.9754381","53.3430648,14.9902439","53.3428609,14.9919069","53.3428288,14.9923146","53.3428288,14.9925828","53.3429253,14.9933016","53.342818,14.9933875","53.3427429,14.9935162","53.3426893,14.9936771","53.3426893,14.9939346","53.3427429,14.9941492","53.3428288,14.994278","53.3429146,14.9943423","53.3430004,14.9943638","53.3430648,14.9943531","53.3431613,14.9942887","53.3434618,14.9950933","53.3446312,14.9983764","53.3450067,14.9993527","53.345114,14.9999535","53.3450711,15.0002003","53.3450847,15.0006153","53.3450925,15.0008547","53.3452857,15.0013697","53.3452749,15.001595","53.3450282,15.0019169","53.3444059,15.0025499","53.3435047,15.0035262","53.3439553,15.0046849","53.3441591,15.0048244","53.3444059,15.005511","53.3447492,15.0063586","53.3455539,15.0085795","53.3440948,15.0101352","53.3439553,15.0102746","53.3439553,15.0102746","53.3432472,15.0110042","53.3424854,15.0113904","53.3421743,15.0113797","53.3417773,15.0113046","53.3407366,15.0110257","53.3403504,15.0146949","53.3395945,15.0213632"];

        var count = 0;

        $interval(function () {

            var lat = steps[count].split(',')[0];
            var lng = steps[count].split(',')[1];

            onGeoLocationSuccess({
                coords: {
                    latitude: lat,
                    longitude: lng
                }
            });
            count++;
        }, 1000, steps.length - 1, false);
    };

    return {
        watchPosition: watchPosition
    };
}]);