//
// widget-controller.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

/**
 * The controller that is in charge of widget positions, their functionality
 * and refresh rates.
 * @constructor
 */
function WidgetController() {
    /**
     * Indicates whether the controller has been initialized yet.
     * @private
     */
    var _initialized = false;
    
    /**
     * Stores the plugins that the controller manages.
     * @private
     */
    var plugin_list = [];
    
    /**
     * Initializes the controller. By doing so, it also adds all the widgets to the screen and refreshes them.
     * @param {Object[]} list - A list of plugins that should be included from the beginning.
     * @param {string} list[].name - The name of the respective plugin. Its source file must be stored in /js/[name].js.
     * @param {boolean} list[].uses_css - If your plugin needs its own css styles, set this to true. Its styles file must be stored in /css/[name].css.
     */
    this.init = function(list) {
        //TODO: Name verification
        _initialized = true;
        
        if (list) {
            // Usage of document fragments improves performance of the DOM
            var frag = document.createDocumentFragment();
            var node_js;
            var node_css;
            
            for (var i = 0; i < list.length; i++) {
                if (!(list[i].name))
                    continue;
                
                plugin_list.push(list[i]);
                var node_js = document.createElement('script');
                node_js.src = './js/' + list[i].name + '.js';
        
                if (list[i].uses_css) {
                    var node_css = document.createElement('link');
                    node_css.rel = 'stylesheet';
                    node_css.href = './css/' + list[i].name + '.css';
            
                    frag.appendChild(node_css);
                }
                frag.appendChild(node_js);
            }
            
            document.querySelector('head').appendChild(frag);
        }
    }
    
    /**
     * Adds a single widget to the Widget Controller's list. The Widget Controller will now watch the widget and manage it.
     * @param {string} name - The name of the plugin. Its source file mut be stored in /js/[name].js.
     * @param {boolean} uses_css - If your plugin needs its own css styles, set this to true. Its styles file must be stored in /css/[name].css.
     */
    this.add = function (name, uses_css) {
        //TODO: Implement verification of [name]
        plugin_list.push(name);
        var frag = document.createDocumentFragment();

        var node_js = document.createElement('script');
        node_js.scr = './js/' + name + '.js';
        
        if (uses_css) {
            var node_css = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './css/' + name + '.css';
            
            frag.appendChild(node_css);
        }
        
        frag.appendChild(node_js);
        document.querySelector('head').appendChild(frag);
    }
}