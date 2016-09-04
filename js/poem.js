//
// poem.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

function poem_updateDOM(node) {
    if (window.poem_potd) {
        node.innerHTML = poem_potd;
    }
}

new Widget('poem', poem_updateDOM, [4, 5, 6], 10000).register().loadDependencies({
    helper: 'poem-helper.js'
});
