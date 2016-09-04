//
// quote.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

/**
 * @file Contains the implementation of a quote widget that will fetch today's
 * motivational quote from a website and then display it to motivate the user
 * to conquer his day successfully.
 * @author Lukas Vogel
 */

/**
 * Contains the last fetched data (in object form) from the REST API of the
 * quote server.
 * @type {Object}
 */
var quote_lastFetchedData;

/**
 * Fetches a new quote from the servers at quotes.rest and stores it in a global
 * variable that can be accessed by the quote widget (and others, of course).
 * @throws Will log an error to the console if the HTTP request could not be
 * completed.
 */
function quote_fetchData(nodes) {
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
                quote_updateDOM(nodes[0]);
            } else {
                console.error('Could not complete HTTP Request: ', req.status);
            }
        }
    };

    req.open('GET', 'http://quotes.rest/qod.json', true);
    req.send();
}

function quote_updateDOM(node) {
    node.innerHTML = quote_lastFetchedData.contents.quotes[0].quote; 
}

new Widget('quote', quote_fetchData, [[0,3]], 3600000).register();
