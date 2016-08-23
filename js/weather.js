//
// weather.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

// Bad practise ahead
var weather_lastFetchedData;

function weather_fetchData() {
    var api_key = '424a922dab68fc46fbd86e31ae94846d'; // for easy future change
    var city_id = '2657970'; // Winterthur. Change later, maybe?
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        /*
         * readyState == 4 -> data fully loaded
         * status == 200 -> HTTP: 200 OK
         */
        if (req.readyState == 4) {
            if (req.status == 200) {
                // data successfully loaded, now parse to an object
                var data;
                
                try {
                    // make sure the application will continue to run
                    // even if the JSON file is corrupt
                    data = JSON.parse(req.responseText);
                }
                catch(e) {
                    console.error(e);
                    return;
                }

                if (data == weather_lastFetchedData)
                    return;
                else weather_lastFetchedData = data;

                weather_updateDOM();
            } else {
                console.error('Could not complete HTTP Request: ' + req.status);
            }
        }
    };

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

    req.open('GET', url, true);
    req.send();
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
