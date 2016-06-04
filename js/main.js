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
        var Controller = new WidgetController();
        Controller.init([{
            name: 'blabla',
            uses_css: false
        }]);
    }
    document.querySelector('head').appendChild(script);

});