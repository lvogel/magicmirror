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
    }
    document.querySelector('head').appendChild(script);

});