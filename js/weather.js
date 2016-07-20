//
// weather.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

function fetchWeatherData() {
    var api_key = '424a922dab68fc46fbd86e31ae94846d'; // for easy future change
    var city_id = '2657970'; // Winterthur. Change later, maybe?
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        /*
         * readyState == 4 -> data fully loaded
         * status == 200 -> HTTP: 200 OK
        */
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
        // error handling, maybe?
    };

    // My API key is 424a922dab68fc46fbd86e31ae94846d
    req.open('GET', 'http://api.openweathermap.org/data/2.5/weather?id=' + city_id + 
        '&appid=' + api_key + '&units=metric&lang=de');
    req.send();
}

new Widget('weather', fetchWeatherData, [9, 10, 11], 60000).register();
