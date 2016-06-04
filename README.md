# Magic Mirror
This is the code for the final paper in my school. It is intended to be displayed on a screen hidden behind a mirror. When active, the screen lights up and projects text onto the mirror's surface, hence the adjective "magic".

## API for plugins
All widgets are dynamically managed by the Widget Controller. To display your own widget on the screen, you can create a plugin. Its JavaScript code must be stored in `/js/[plugin name].js` and its CSS styles in `/css/[plugin name].css`. Then add the name of your plugin to the json file `/plugins.json`. The Widget Controller will then pick your plugin up and display it onscreen.
