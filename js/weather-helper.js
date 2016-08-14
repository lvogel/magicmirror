//
// weather-helper.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

var weather_location;

function weather_getLocation() {
    if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // location successfully fetched
            weather_location = position.coords;
        }, function (error) {
            // error handling
            weather_location = null;
        });
    } else {
        weather_location = null; // instead of "undefined"
    }
}

new Helper('weather', weather_getLocation, 1800000).register();
