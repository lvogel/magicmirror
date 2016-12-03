//
// widget-controller.js
// Magic Mirror
// (c) 2016 by Lukas Vogel
//

/**
 * @file Contains the three classes and their constructors that are at the heart
 * of the Magic Mirror: The Widget Controller, Widget and Helper classes which
 * are best explained on their own pages.
 * @author Lukas Vogel
 * @see WidgetController
 * @see Widget
 * @see Helper
 */

/**
 * The controller that is in charge of widget positions, their functionality
 * and refresh rates.
 * @constructor
 */
function WidgetController() {
    /**
     * Stores the plugins that the controller manages.
     * @private
     */
    var widget_list = [];

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

        // build the grid that will contain the widgets
        var docFrag = document.createDocumentFragment();
        var div_row;
        var div_cell;

        // creates a 3x4 grid
        for (var i = 0; i < 3; i++) {
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

        loadAsync('plugins.json', function (data) {
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
        }, function (statusCode) {
            console.error('Could not complete HTTP Request: ' + code);
        });
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

        if (!(desPos instanceof Array) || !widget_list.every(function(el) {
            return el.name != widget.name;
        }))
            return false;

        // Validate desPos
        if (desPos.every(function (el) {
            return !isNaN(el);          // every element of desPos is a number
        })) {
            for (var i = 0; i < desPos.length; i++) {
                if (!widget_list[desPos[i]]) {
                    widget_list[desPos[i]] = widget;
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
                    if (widget_list[desPos[i][j]]) {
                        continue outer;
                    }
                }

                // We found a match!)
                for (var k = 0; k < desPos[i].length; k++) {
                    widget_list[desPos[i][k]] = widget;
                }

                widget.position = desPos[i];
                addedSuccessfully = true;
            }
        }

        if(!addedSuccessfully)
            return false;

        var nodes;
        if (widget.position instanceof Array) {
            nodes = Array.prototype.filter.call($('body .row .cell'),
                function (el, index) {
                    return widget.position.includes(index);
            });
            Array.prototype.forEach.call(nodes, function(node) {
                node.classList.add(widget.name);
            });
        } else {
            nodes = $('body .row .cell')[widget.position];
            nodes.classList.add(widget.name);
        }

        widget.id = window.setInterval(function () {
            widget.draw(nodes);
        }, widget.refreshRate);

        // Draw once, try even if the widget has not yet been fully loaded.
        try {
            widget.draw(nodes);
        }
        catch(e) {
            // Do nothing, obviously. Yep.
        }
        
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

    /**
     * Load data that is strictly needed for the widget's code execution. By
     * passing HTML, CSS or JavaScript file names as parameters
     * you can make the Controller do the work for you.
     * @param {Number} widgetId - The assigned position of the widget on screen.
     * @param {Object.<string,string>} dependencies - An object with properties 
     * "html", "css" or "helper" that refer to filenames in the specific folders.
     */
    this.loadDependencies = function (widgetId, dependencies) {
        if (dependencies.helper && typeof dependencies.helper == "string" &&
            dependencies.helper.indexOf('../') == -1) {
            var script = document.createElement('script');
            script.src = './js/' + dependencies.helper;

            $('head').appendChild(script);
        }

        if (dependencies.html && typeof dependencies.html == "string" &&
            dependencies.html.indexOf('../') == -1) {
            // dependencies.html is a valid string and does not access
            // a parent directory

            // the following request can *not* be replaced by loadAsync() since
            // it is *synchronous*
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
            dependencies.css.indexOf('../') == -1) {
            var link = document.createElement('link');
            link.href = './css/' + widget_list[widgetId].name + '.css';
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
 * @param {String} name - The name of the widget that must be unique. Otherwise,
 * registering with the Controller will fail.
 * @param {WidgetCallback} callBack - The callback that will be invoked as soon
 * as the widget should be refreshed.
 * @param {Number|Number[]} desiredPositions - The single or multiple positions
 * in a virtual 3x4 grid that the widget wishes to occupy. Positions are numbered
 * from top left (0) to bottom right (11)
 * @param {Number} refreshRate - The amount of milliseconds that passes between
 * two consecutive refreshes of the widget.
 * @throws {TypeError} If any of the required arguments are not given or invalid.
 */
function Widget(name, callBack, desiredPositions, refreshRate) {
    /**
     * A callback that will be run whenever the widget should be refreshed,
     * usually after the timer has fired.
     * @callback WidgetCallback
     * @param {Node|NodeList} nodes - The single or multiple DOM node(s) that
     * are assigned to the widget.
     */

    if (typeof name !== 'string' ||
        typeof callBack !== 'function' ||
        (typeof desiredPositions !== 'number' &&
        !(desiredPositions instanceof Array)) ||
        typeof refreshRate !== 'number') {
        throw new TypeError('Invalid constructor argument(s)');
    }

    /**
     * The name that the widget receives. It is shared with its helpers.
     * @type {String}
     */
    this.name = name;
    /**
     * The callback that is responsible for drawing the widget.
     * @type {WidgetCallback}
     */
    this.draw = callBack;
    /**
     * The desired position(s) that the widget would like to occupy in the grid.
     * @see {Widget}
     */
    this.desiredPositions = desiredPositions;
    /**
     * The delay (in milliseconds) between two consecutive draw calls.
     * @type {Number}
     */
    this.refreshRate = refreshRate;
    /**
     * The position that the widget will be assigned to depending on its
     * preferences during the registration process. Should only be set by the
     * {@linkcode WidgetController}.
     * @type {Number}
     */
    this.position = null;

    /**
     * Start the registration process with the Controller. The benefit over doing
     * it manually is that it automatically checks for errors with the Controller.
     * @returns {Boolean|Object} Returns false, if an error occured. Returns the
     * widget itself to enable chaining.
     */
    this.register = function() {
        if (!window.Controller) {
            if (console.error)
                console.error('Widget Controller not set up');
            return false;
        }

        if (!window.Controller.registerWidget(this)) {
            return false;
        }
        
        return this;    // for chaining
    };

    /**
     * Ask the WidgetController to load all of the widget's dependencies. These
     * can include: CSS and SHTML files and JavaScript helpers. After the
     * dependencies have been loaded, the widget is asked to re-draw its contents.
     * @param {Object.<string,string>} dependencies - The dependencies that the
     * widget requires. Widgets can require up to one file per category. The
     * files must be positioned in the correct directories for this to work.
     * Paths to other folders will be ignored.
     * @returns {Boolean} Returns false, if something failed.
     */
    this.loadDependencies = function(dependencies) {
        if (!window.Controller) {
            if (console.error)
                console.error('Widget Controller not set up');
            return false;
        }

        if (!(this.position instanceof Array))
            window.Controller.loadDependencies(this.position, dependencies);
        else
            window.Controller.loadDependencies(this.position[0], dependencies);
        this.draw();
    };
}

/**
 * An instance of a Helper object that – unlike a widget – doesn't appear
 * onscreen, but also runs periodically. Helpers should <b>not</b> modify DOM
 * contents. Instead, they should provide data to their respective widgets so
 * that they can display it properly.
 * @constructor
 * @param {String} associatedWidget - The name of the widget that the helper goes with.
 * @param {HelperCallback} callBack - The method that will be invoked on run.
 * @param {Number} refreshRate - Delay in milliseconds between consecutive helper runs.
 * @throws {TypeError} If any of the required arguments are not given or invalid.
 */
function Helper(associatedWidget, callBack, refreshRate) {
    /**
     * A callback that will be invoked when the helper should run.
     * @callback HelperCallback
     */

    // If any of the given parameters are invalid, abort.
    if (typeof associatedWidget !== 'string' || 
        typeof callBack !== 'function' ||
        isNaN(refreshRate) ||
        refreshRate <= 0) {
        throw new TypeError('Invalid constructor argument(s)');
    }

    /**
     * The widget that the helper goes with. Currently unused.
     * @type {String}
     */
    this.associatedWidget = associatedWidget;
    /** 
     * The function that should be called when refreshing the helper.
     * @type {HelperCallback}
     */
    this.run = callBack;
    /**
     * Delay in milliseconds between to consecutive runs of the helper.
     * @type {Number}
     */
    this.refreshRate = refreshRate;

    /**
     * Start the registration process with the Controller. The benefit over doing
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
