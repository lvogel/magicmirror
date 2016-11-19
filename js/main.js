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
    
    // add the script to the DOM to load it
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

/**
 * This function replaces existing code in many different files by providing a
 * framework that allows AJAX requests to files or URLs by using the GET
 * protocol.
 * @param {String} url - The URL that should be queried.
 * @param {AsyncSuccessCallback} successCallback - The callback handling successful outcomes.
 * @param {AsyncErrorCallback} errorCallback - The callback handling unsuccessful outcomes.
 */
function loadAsync(url, successCallback, errorCallback) {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            // Download finished. Determine whether it was successful.
            if (req.status == 200) {
                successCallback(req.responseText);
            } else {
                errorCallback(req.status, req.responseText);
            }
        }
    };

    req.open('GET', url, true);
    req.send();
}

 /**
 * A callback that will be run as soon as the AJAX request has completed
 * and if the HTTP status code equals to 200 (OK). 
 * @callback AsyncSuccessCallback
 * @param {String} responseText - The data that was retrieved from the URL.
 */
 
 /**
  * A callback that will be run as soon as the AJAX request has completed
  * and if an error occured (status code does not equal to 200 (OK)).
  * @callback AsyncErrorCallback
  * @param {Number} statusCode - The HTTP status code that the server returned.
  * @param {String} responseText - The data that was retrieved from the URL.
  */
