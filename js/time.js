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

    $('.time-clock').innerHTML = timeString;
    $('.time-date').innerHTML = date.toLocaleDateString();
}, [1,0,2], 10000).register().loadDependencies({
    html: 'time.shtml',
    css: 'time.css'
});
