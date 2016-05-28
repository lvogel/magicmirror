//
// widget-controller.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

function WidgetController() {
    var _initialized = false;
    var plugin_list = [];
    
    var that = this;            // workaround
    
    this.init = function(list) {
        //TODO: Name verification
        _initialized = true;
        
        if (list) {
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