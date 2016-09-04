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
     * Stores the helpers that the controller manages.
     * @private
     */
    var helper_list = [];
    
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
            if (req.readyState == 4) {
                if (req.status == 200) {
                    // data fully and successfully loaded
                    var data = req.responseText;

                    try {
                        data = JSON.parse(data);
                    }
                    catch(e) {
                        console.error(e);
                    }
                    
                    // If the JSON parsing failed it doesn't matter because the
                    // following steps will just be skipped.
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
                } else {
                    console.error('Could not complete HTTP Request: ' + req.status);
                }

            // It doesn't matter whether the XMLRequest succeeded or not,
            // since the Controller won't try again to load the data
            // the initialization has finished.
            _initialized = true;
            }
        };
        
        req.open('GET', 'plugins.json', true);
        req.send(); 
    };

    /**
     * Register a widget with the controller so that the Controller object keeps track of refresh rates.
     * The Controller will also position the widget on screen, depending on its preferences stored in
     * {@linkcode Widget.desiredPositions}
     * @param {Object} widget - The widget that should be managed.
     * @returns {Boolean|Object} If something during the registration process fails, 
     * false will be returned. Otherwise, the Controller returns itself to enable
     * chaining.
     */
    this.registerWidget = function (widget) {
        var addedSuccessfully = false;
        var desPos = widget.desiredPositions;

        if (!(desPos instanceof Array))
            return false;

        // Validate desPos
        if (desPos.every(function (el) {
            return !isNaN(el);          // every element of desPos is a number
        })) {
            for (var i = 0; i < desPos.length; i++) {
                if (!plugin_list[desPos[i]]) {
                    plugin_list[desPos[i]] = widget;
                    widget.position = desPos[i];
                    addedSuccessfully = true;
    
                    break;
                }
            }
        } else if (desPos.every(function (el) {
            // every element of desPos is an array that contains at least two
            // other position values
            return el instanceof Array && el.length >= 2; 
        })) {
            outer: for (var i = 0; i < desPos.length; i++) {
                for (var j = 0; j < desPos[i].length; j++) {
                    if (plugin_list[desPos[i][j]]) {
                        continue outer;
                    }
                }

                // We found a match!)
                for (var k = 0; k < desPos[i].length; k++) {
                    plugin_list[desPos[k]] = widget;
                }

                widget.position = desPos[i];
                addedSuccessfully = true;
            }
        }

        if(!addedSuccessfully)
            return false;

        var node;
        if (widget.position instanceof Array) {
            nodes = Array.prototype.filter.call($('body .row .cell'),
                function (el, index) {
                    return widget.position.includes(index);
            });
            Array.prototype.forEach.call(nodes, function(node) {
                node.classList.add(widget.name);
            });
        } else {
            node = $('body .row .cell')[widget.position];
            node.classList.add(widget.name);
        }

        widget.id = window.setInterval(function () {
            widget.draw(node);
        }, widget.refreshRate);

        return this;    // for chaining
    };

    /**
     * Register a helper with the controller so that the Controller object keeps track of refresh rates.
     * The Helper will <b>not</b> be positioned on screen.
     * @param {Object} helper - The helper that should be managed.
     * @returns {Object} The Controller object to enable chaining.
     */
    this.registerHelper = function (helper) {

        helper.id = window.setInterval(function() {
            helper.run();
        }, helper.refreshRate);

        helper.run();

        return this;
    };

    this.loadDependencies = function (widgetId, dependencies) {
        if (dependencies.helper && typeof dependencies.helper == "string" &&
            dependencies.helper.indexOf('..') == -1) {
            var script = document.createElement('script');
            script.src = './js/' + dependencies.helper;

            $('head').appendChild(script);
        }

        if (dependencies.html && typeof dependencies.html == "string" &&
            dependencies.html.indexOf('..') == -1) {
            // dependencies.html is a valid string and does not access
            // a parent directory
            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        $('body .row .cell')[widgetId].innerHTML = req.responseText;
                    } else {
                        console.error('Could not complete HTTP Request: ' + req.status);
                    }
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

/**
 * An instance of a Helper object that – unlike a widget – doesn't appear
 * onscreen, but also runs periodically. Helpers should <b>not</b> modify DOM
 * contents. Instead, they should provide data to their respective widgets so
 * that they can display it properly.
 * @constructor
 */
function Helper(associatedWidget, callBack, refreshRate) {
    /** The widget that the helper goes with. Currently unused. */
    this.associatedWidget = associatedWidget;
    /** The function that should be called when refreshing the helper. */
    this.run = callBack;
    /** Delay in milliseconds between to consecutive runs of the helper.  */
    this.refreshRate = refreshRate;

    /**
     * Start the registration process with the Controller. The benefit of doing
     * it manually is that it automatically checks for errors with the Controller.
     * @returns {Boolean|Object} Returns false, if an error occured. Returns the
     * helper itself to enable chaining.
     */
    this.register = function() {
        if (!window.Controller) {
            if (console.error)
                console.error("Widget Controller not set up");
            return false;
        }

        window.Controller.registerHelper(this);
        return this;    // for chaining
    };
}
