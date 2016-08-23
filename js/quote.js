//
// quote.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

var quote_lastFetchedData;

function quote_fetchData() {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status  == 200) {
                var data;

                try {
                    data = JSON.parse(req.responseText);
                }
                catch(e) {
                    console.error(e);
                    return;
                }

                if (data == quote_lastFetchedData)
                    return;

                // TODO: sanity check JSON data

                quote_lastFetchedData = data;
                quote_updateDOM();
            } else {
                console.error('Could not complete HTTP Request: ', req.status);
            }
        }
    };

    req.open('GET', 'http://quotes.rest/qod.json', true);
    req.send();
}

function quote_updateDOM() {
    $('.quote').innerHTML = quote_lastFetchedData.contents.quotes[0].quote; 
}

new Widget('quote', quote_fetchData, [7, 6, 8], 3600000).register();
