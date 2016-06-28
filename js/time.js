//
// time.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

new Widget('time', function(node) {
    node.innerHTML = new Date().getTime();
}, [1, 2, 3], 10000).register();
