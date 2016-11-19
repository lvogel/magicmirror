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
function quote_fetchData(node) {
    loadAsync('http://quotes.rest/qod.json', function(data) {
        // parse response text to JSON, which is more useful
        try {
            data = JSON.parse(data);
        }
        catch(e) {
            console.error(e);
            return;
        }

        if (data == quote_lastFetchedData)
            return;

        if (!data.contents.quotes[0].quote)
            // useless or invalid data
            return false;

        quote_lastFetchedData = data;
        quote_updateDOM(node);

        }, function (code) {
             if (code == 429) {
                // API quota exceeded. No more requests possible.
                // happens if browser refreshes >10x/hour
                console.warn('Could not load quote of the day: API limit exceeded');
                return false;
            } else {
                console.error('Could not complete HTTP Request: ', code);
            }
        }
    );
}

function quote_updateDOM(node) {
    node.innerHTML = '&ldquo;' + quote_lastFetchedData.contents.quotes[0].quote + '&rdquo;'; 
}

new Widget('quote', quote_fetchData, [11, 8], 3600000).register().loadDependencies({
    css: 'quote.css'
});
