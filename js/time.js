//
// time.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

/**
 * @file Contains the implementation of a time widget.
 * @author Lukas Vogel
 */

/**
 * Gets the current time from the browser and updates the DOM.
 * @param {Node} - The DOM node that contains the widget's code.
 */
function time_update(node) {
    var date = new Date();

    // fix for single-digit hours or minutes. 8:3 -> 08:03
    var hr = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
    var min = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
    var timeString = hr + ":" + min;

    $('.time-clock').innerHTML = timeString;
    $('.time-date').innerHTML = date.toLocaleDateString();
}

new Widget('time', time_update, [1,0,2], 10000).register().loadDependencies({
    html: 'time.shtml',
    css: 'time.css'
});
