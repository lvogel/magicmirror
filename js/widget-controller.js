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
        var div_row;
        var div_cell;
        for (var i = 0; i < 4; i++) {
            div_row = document.createElement('div');
            div_row.classList.add('row');
            for (var j = 0; j < 3; j++) {
                div_cell = document.createElement('div');
                div_cell.classList.add('cell');
                div_row.appendChild(div_cell);
            }
            docFrag.appendChild(div_row);
        }

        $('body').appendChild(docFrag);

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
                        if (typeof data[i] != "string")
                            continue; // we can't read a file name from a number

                        node_js = document.createElement('script');
                        node_js.src = './js/' + data[i] + '.js';
                
                        frag.appendChild(node_js);
                    }
                    $('head').appendChild(frag);
                }
                
                _initialized = true;
            }
        };
        
        req.open('GET', 'plugins.json', true);
        req.send(); 

        this.registerWidget = function (widget) {
            var addedSuccessfully = false;
            var desPos = widget.desiredPositions;
            for (var i = 0; i < desPos.length; i++) {
                if (!plugin_list[desPos[i]]) {
                    plugin_list[desPos[i]] = widget;
                    widget.position = desPos[i];
                    addedSuccessfully = true;

                    break;
                }
            }

            if(!addedSuccessfully)
                return false;

            var node = $('body .row .cell')[widget.position];
            node.classList.add(widget.name);

            widget.id = window.setInterval(function () {
                widget.draw(node);
            }, widget.refreshRate);
            return this;    // for chaining
        };
    };

    this.loadDependencies = function (widgetId, dependencies) {
        if (dependencies.html && typeof dependencies.html == "string" &&
            dependencies.html.indexOf('..') == -1) {
            // dependencies.html is a valid string and does not access
            // a parent directory
            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState == 4 && req.status == 200) {
                    $('body .row .cell')[widgetId].innerHTML = req.responseText;
                }
            };
            req.open('GET', './html/' + dependencies.html, false);
            req.send();
        }

        if (dependencies.css && typeof dependencies.css == "string" &&
            dependencies.css.indexOf('..') == -1) {
            var link = document.createElement('link');
            link.href = './css/' + plugin_list[widgetId].name + '.css';
            link.rel = 'stylesheet';
            link.scoped = 'scoped'; // maybe this will get implemented sooner or later

            $('head').appendChild(link);
        }
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
        return this;    // for chaining
    };

    this.loadDependencies = function(dependencies) {
        if (!window.Controller) {
            if (console.error)
                console.error("Widget Controller not set up");
            return false;
        }

        window.Controller.loadDependencies(this.position, dependencies);
        this.draw();
    };
}

