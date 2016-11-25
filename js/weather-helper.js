//
// weather-helper.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

var weather_location;

/**
 * Tries to use the HTML5 GeoLocation API to locate the user. The weather
 * widget then tries to load the weather according to the user's position.
 * Will set the {@linkcode weather_location} global variable.
 */
function weather_getLocation() {
    if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // location successfully fetched
            weather_location = position.coords;
            // override the Controller and manually refresh
            weather_fetchData($('.weather'));
        }, function (error) {
            // error handling
            weather_location = null;
        });
    } else {
        weather_location = null; // instead of "undefined"
    }
}

new Helper('weather', weather_getLocation, 1800000).register();
