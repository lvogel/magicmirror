//
// main.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

/**
 * @file Setup of the Widget Controller and Swiss Knife-like functions.
 * @author Lukas Vogel
 */

document.addEventListener('DOMContentLoaded', function() {
    // load Widget Controller
    var script = document.createElement('script');
    script.src = './js/widget-controller.js';
    
    // since the script is loaded asynchronously we have to wait for it
    script.onload = function() {
        var Controller = window.Controller = new WidgetController();
        Controller.init();
    };
    
    $('head').appendChild(script);
});

/**
 * This function is a shortcut to the document.querySelector[All] function in
 * native EcmaScript. It provides a way of using jQuery's most popular feature,
 * DOM node lookup, without actually requiring jQuery.
 * @param {String} selector - The CSS like lookup selector.
 * @param {Node|document} context - The context within which the query should
 * be performed. This can be either a document object or a single DOM node.
 * @returns {Node|NodeList} A NodeList or a the single node that was found.
 */
function $(selector, context) {
    context = context || document;
    var result = context.querySelectorAll(selector);

    // I don't want to write [0] all the time.
    if (result.length > 1)
        return result;
    else
        return result[0];
}
