//
// poem-helper.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

/**
 * @file Implementation of the helper that supports the poem widget.
 * @author Lukas Vogel
 */

/**
 * Contains the last fetched Poem Of The Day from the server. Includes HTML
 * break tags instead of ECMAScript newlines. Should only be set by
 * {@linkcode poem_fetchPoemOfTheDay}
 * @type {String}
 */
var poem_potd = '';
var poem_auth = '';

/**
 * Fetches the poem of the day from gedichte.xbib.de and stores it in
 * {@linkcode poem_potd}.
 */
function poem_fetchPoemOfTheDay() {
    loadAsync('http://gedichte.xbib.de/gedicht_des_tages.html', function(data) {
        // parse raw HTML to a document object model representation
        var doc = new DOMParser().parseFromString(data, 'text/html');

        // the poem of the day is always stored in '<p class=stext>'
        poem_potd = $('p.stext', doc).innerHTML;
        // the author is always stored in '<p class=s7>'
        poem_auth = $('p.s7 b', doc).innerHTML;
    }, function (code) {
            console.error('Could not complete HTTP Request: ' + code);
    });
}

new Helper('poem', poem_fetchPoemOfTheDay, 3600000).register();
