//
// poem.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

/**
 * @file Implementation of a poem widget that displays the poem of the day.
 * @author Lukas Vogel
 */

/**
 * Update a given DOM node so that it displays the poem of the day.
 * @param {Node} node - The DOM node whose innerHTML will be overwritten.
 */
function poem_updateDOM(node) {
    // by checking for window.poem_potd we can dodge nasty error messages in
    // the console
    if (window.poem_potd) {
        node.innerHTML = poem_potd;
    }
}

new Widget('poem', poem_updateDOM, [4, 5, 6], 10000).register().loadDependencies({
    helper: 'poem-helper.js'
});
