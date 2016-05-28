//
// main.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

var plugin_list = ['widget-controller'];

document.addEventListener('DOMContentLoaded', function() {
    var head_frag = document.createDocumentFragment();
    var node;
    
    for (var i = 0; i < plugin_list.length; i++) {
        node = document.createElement('script');
        node.src = './js/' + plugin_list[i] + '.js';
        head_frag.appendChild(node);
    }
    document.querySelector('head').appendChild(head_frag);
});