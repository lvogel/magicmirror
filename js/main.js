//
// main.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

document.addEventListener('DOMContentLoaded', function() {
    // load Widget Controller
    var script = document.createElement('script');
    script.src = './js/widget-controller.js';
    
    // since the script is loaded asynchronously we have to wait for it
    script.onload = function() {
        var Controller = window.Controller = new WidgetController();
        Controller.init();
    };
    document.querySelector('head').appendChild(script);

});

/**
 * This function is a shortcut to the document.querySelector[All] function in
 * native EcmaScript. It provides a way of using jQuery's most popular feature,
 * DOM node lookup, without actually requiring jQuery.
 * @param {String[]} selector – The CSS like lookup selector.
 */
function $(selector) {
    var result = document.querySelectorAll(selector);

    // I don't want to write [0] all the time.
    if (result.length > 1)
        return result;
    else
        return result[0];
}
