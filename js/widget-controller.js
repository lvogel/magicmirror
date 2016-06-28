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
     */
    this.init = function() {
        var docFrag = document.createDocumentFragment();
        for (var i = 0; i < 12; i++) {
            docFrag.appendChild(document.createElement('div'));
        }

        document.body.appendChild(docFrag);

        //TODO: Name verification
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                // data fully and successfully loaded
                var data = req.responseText;
                data = JSON.parse(data);
                
                if (data && data instanceof Array) {
                    // Usage of document fragments improves performance of the DOM
                    var frag = document.createDocumentFragment();
                    var node_js;
                    
                    for (var i = 0; i < data.length; i++) {
                        if (!(data[i].name))
                            continue;

                        node_js = document.createElement('script');
                        node_js.src = './js/' + data[i].name + '.js';
                
                        frag.appendChild(node_js);
                    }
                    document.querySelector('head').appendChild(frag);
                }
                
                _initialized = true;
            }
        };
        
        this.registerWidget = function (widget) {
            var addedSuccessfully = false;
            for (var i = 0; i < widget.desiredPositions.length; i++) {
                if (!plugin_list[i]) {
                    plugin_list[i] = widget;
                    widget.position = i;
                    addedSuccessfully = true;
                }
            }

            if(!addedSuccessfully)
                return false;

            var node = document.querySelectorAll('body > div')[widget.position];
            node.classList.add(widget.name);
            widget.id = window.setInterval(function () {
                widget.draw(node);
            }, widget.refreshRate);
            widget.draw(node);
            return this;
        };
        
        req.open('GET', 'plugins.json', true);
        req.send();
    };

    this.applyStyleToWidget = function (widgetId) {
        var link = document.createElement('link');
        link.href = './css/' + plugin_list[widgetId].name + '.css';
        link.rel = 'stylesheet';
        link.scoped = 'scoped'; // maybe this will get implemented sooner or later

        document.querySelector('head').appendChild(link);
    };
}

/**
 * An instance of a Widget object that is limited to its own part of the screen
 * and gets refreshed as often as specified.
 * @constructor
 */
function Widget(name, callBack, desiredPositions, refreshRate) {
    this.name = name;
    this.draw = callBack;
    this.desiredPositions = desiredPositions;
    this.refreshRate = refreshRate;
    this.position = null;

    this.register = function() {
        if (!window.Controller) {
            if (console.error)
                console.error("Widget Controller not set up");
            return false;
        }

        window.Controller.registerWidget(this);
        return this;
    };

    this.applyStyles = function() {
        if (!window.Controller) {
            if (console.error)
                console.error("Widget Controller not set up");
            return false;
        }

        window.Controller.applyStyleToWidget(this.position);
    };
}

