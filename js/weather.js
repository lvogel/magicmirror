//
// weather.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

// Bad practise ahead
var weather_lastFetchedData;

function weather_fetchData() {
    var api_key = '424a922dab68fc46fbd86e31ae94846d'; // for easy future change
    var city_id = '2657970'; // Winterthur. Change to your city's code if you wish.

    // If the helper supplied specific location data. Instead, fall back
    // to Winterthur (default)
    var url;
    
    if (window.weather_location) {
        url = 'http://api.openweathermap.org/data/2.5/weather?lat = ' +
            weather_location.latitude + '&lon=' + weather_location.longitude +
            '&appid=' + api_key + '&units=metric&lang=de';
    } else {
        url = 'http://api.openweathermap.org/data/2.5/weather?id=' + 
            city_id + '&appid=' + api_key + '&units=metric&lang=de';
    }

    loadAsync(url, function (data) {
        // data successfully loaded, now parse to an object
        try {
            // make sure the application will continue to run
            // even if the JSON file is corrupt
            data = JSON.parse(data);
        }
        catch(e) {
            console.error(e);
            return;
        }

        if (data == weather_lastFetchedData)
            return;
        else weather_lastFetchedData = data;

        weather_updateDOM();
    }, function (code) {
        console.error('Could not complete HTTP Request: ' + code);
    });
}

function weather_updateDOM() {
    $('.weather .number').innerHTML = Math.round(weather_lastFetchedData.main.temp);
    $('.weather .cond').innerHTML = weather_lastFetchedData.weather[0].description.toLowerCase();
    $('.weather .location').innerHTML = weather_lastFetchedData.name || "";
}

new Widget('weather', weather_fetchData, [9, 10, 11], 60000).register().loadDependencies({
    helper: 'weather-helper.js',
    html: 'weather.shtml',
    css: 'weather.css'
});
