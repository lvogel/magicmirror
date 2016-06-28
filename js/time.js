//
// time.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

new Widget('time', function(node) {
    var date = new Date();
    var hr = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
    var min = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
    var timeString = hr + ":" + min;

    node.innerHTML = "<div class='time-clock'>" + timeString + "</div>" +
        "<div class='time-date'>" + date.toLocaleDateString() + "</div>";
}, [1,0,2], 10000).register().applyStyles();
