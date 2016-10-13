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
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                var doc = new DOMParser().parseFromString(req.responseText, 'text/html');
                // the poem of the day is always stored in this paragraph
                poem_potd = $('p.stext', doc).innerHTML;
                poem_auth = $('p.s7 b', doc).innerHTML;
            } else {
                console.error('Could not complete HTTP Request: ' + req.status);
            }
        }
    };

    req.open('GET', 'http://gedichte.xbib.de/gedicht_des_tages.html', true);
    req.send();
}

new Helper('poem', poem_fetchPoemOfTheDay, 3600000).register();
