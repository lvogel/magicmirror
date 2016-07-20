//
// weather.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

// Bad practise ahead
var weather_lastFetchedData;

function weather_fetchData(node) {
    var api_key = '424a922dab68fc46fbd86e31ae94846d'; // for easy future change
    var city_id = '2657970'; // Winterthur. Change later, maybe?
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        /*
         * readyState == 4 -> data fully loaded
         * status == 200 -> HTTP: 200 OK
         */
        if (req.readyState == 4 && req.status == 200) {
            // data successfully loaded, now parse to an object
            var data = JSON.parse(req.responseText);

            if (data == weather_lastFetchedData)
                return;
            else weather_lastFetchedData = data;

            weather_updateDOM(node);
        }
        // error handling, maybe?
    };

    // My API key is 424a922dab68fc46fbd86e31ae94846d
    req.open('GET', 'http://api.openweathermap.org/data/2.5/weather?id=' + 
        city_id + '&appid=' + api_key + '&units=metric&lang=de');
    req.send();
}

function weather_updateDOM(node) {
    node.innerHTML = 
        '<div class="temp">' + weather_lastFetchedData.main.temp + '</div>' +
        '<div class="cond">' + weather_lastFetchedData.weather[0].description + '</div>';
}

new Widget('weather', weather_fetchData, [9, 10, 11], 60000).register().applyStyles();
