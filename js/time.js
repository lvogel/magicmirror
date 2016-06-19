//
// time.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

if (window.Controller) {
    var id = Controller.registerWidget('time', '<div class="time"></div>');
    Controller.setCallback(function(drawHeight, drawWidth) {
        var time = new Date();
        document.querySelector('.time').innerHTML = time.getHours() + ":" + time.getMinutes();
    }, id);
    Controller.setRefreshRate(1, id);
}
