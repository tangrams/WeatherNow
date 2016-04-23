## Using 3er Party APIs on Tangram

This guide provides an example of how to use the [Tangram maps engine](https://github.com/tangrams/tangram) with other 3rd party APIs.

It's written for an audience with some technical knowledge about JavaScript, [OpenStreetMap](http://leafletjs.com/) data and [Mapzen vector tiles](https://mapzen.com/projects/vector-tiles). It is best if you have some previous experience editing [Tangram's](https://github.com/tangrams/tangram) [```.yaml``` scene files](https://mapzen.com/documentation/tangram/Scene-file/). In case you don't, don't worry! A good place to start is explore the examples using [TangramPlay](https://mapzen.com/tangram/play/), our online editor, and reading [Tangram Documentation](https://mapzen.com/documentation/tangram/), specially following this nice [walkthrough of how to make a Tangram map](https://mapzen.com/documentation/tangram/walkthrough/#put-your-tangram-map-on-the-web). 

Also feel free to clone this repository in your computer, run it as a local server and make it your own. Tweaking and modifying is the best way to learn. How? Type this on your command line:

```bash
git clone https://github.com/tangrams/OWM.git
python -m SimpleHTTPServer 8000
```

If that doesn’t work, try:

```bash
python -m http.server 8000
```

To view the content on your browser, navigate to: [http://localhost:8000](http://localhost:8000)

***Note:*** Please keep in mind that this example use one free API Key for [OpenWeatherMap service](http://openweathermap.org/api). If you get carried away using it, there is the chance you will run out of calls to the servers. In that case it is probably time to get your own free API key.
 
### Before starting 

Take a moment to look the files inside this repository and see how they relate to each other.

You will note:

- There is a **JS file** (```main.js```) file that loads [Leaflet](http://leafletjs.com/) map and a [Tangram Layer](https://github.com/tangrams/tangram) on top of it. This file also makes API calls to [OpenWeatherMap server](http://openweathermap.org/api), asking for weather station data every time the user finishes moving the map. The responses to this calls are transformed into [GeoJSON](http://geojson.org/) to be passed to [Tangram engine](https://github.com/tangrams/tangram) for rendering and display. 

- The **YAML file** (```scene.yaml```) is a scene file that will tell Tangram.js how to style the map and make sense of the weather station data.

- the **HTML file** (```index.html```) is the glue that holds it all together. It contains a ```<div>``` holder for the map, a minimal amount of CSS styling, together with the calls to the JavaScript files needed for this project.

The rest of the files on this repository are not strictly necessary for this example.

- The ```README.md``` is the guide you are reading.
- The ```LICENSE``` file is the [MIT License](https://opensource.org/licenses/MIT) we add to all our work here at [Mapzen](https://mapzen.com/).

### Inside ```index.html```

Let's jump inside and take a look at the glue that holds everything together to be served to browsers, the ```index.html``` file.

Although it was almost self-explanatory, let's do a brief recap of some of its important components:

#### Dependencies

```html
    <!-- 3rd party libraries -->
        <!-- Leaflet -->
        <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v1.0.0-beta.2/leaflet.css" />
        <script type="text/javascript" src="http://cdn.leafletjs.com/leaflet/v1.0.0-beta.2/leaflet.js"></script>

        <!-- Leaflet URL hash -->
        <script type="text/javascript" src="https://rawgit.com/mlevans/leaflet-hash/master/leaflet-hash.js"></script>

        <!-- Tangram -->
        <script type="text/javascript" src="https://mapzen.com/tangram/0.5/tangram.min.js"></script>

        <!-- Fetch -->
        <script type="text/javascript" src="https://rawgit.com/github/fetch/master/fetch.js"></script>
    <!-- End of 3rd party libraries -->
```

This is our tool box, the set of libraries (hosted somewhere else) that we are going to use to compose our map.

Which are they? What they do?

- [**Leaflet**](http://leafletjs.com/): this leading open-source JavaScript library for interactive maps is probably one of our best friends. There is a big community around it. Is easy to use, well documented and incredible flexible. Note how we are adding  both ```leaflet.js``` and ```leaflet.css``` of the version ```v1.0.0-beta.2```.

- [Michael Lawrence Evans's](https://github.com/mlevans) [**Leaflet Hash plugin**](https://github.com/mlevans/leaflet-hash) adds dynamic URL hashes to Leaflet maps. In other words it will let us easily let users link to specific map views.

- [**Tangram**](https://mapzen.com/projects/tangram) ```0.5``` version: Our beloved and flexible browser-based mapping engine, designed for real-time rendering of 2D and 3D maps from vector tiles. [Learn more here](https://mapzen.com/documentation/tangram/).

- [**Fetch**](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is a more powerful and flexible coming version of [```XMLRequest```](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest). Because is not supported by all browsers yet, we are using [Github's polyfill](https://github.com/github/fetch) of it. Hopefully in a near future this will not be necessary.

#### Styling

```html
        <style>
            body {
                margin: 0px;
                border: 0px;
                padding: 0px;
                overflow: hidden;
            }

            #map {
                position: absolute;
                height: 100%;
                width: 100%;
                margin: 0px;
                padding: 0px;
                z-index: 0;
            }
        </style>
```

The main idea here is to use all the space on your browser to display the map. 

**Note**: the map is going to be placed on the ```<div>``` element with the ```id``` name ```map```.

#### The beating heart

```html
    <div id="map"></div>
    <script src="main.js"></script>
```

As we noted previously, the [Leaflet](http://leafletjs.com/) map with the [Tangram](https://mapzen.com/projects/tangram) layer is going to be loaded inside the ```<div>``` element with the ```map``` id. Where and when does that happens? Immediately after the ```<div>``` is created the ```main.js``` script is loaded. Soon we will see what this JavaScript do.

#### Mapzen's standard features

The rest of the HTML code in ```index.html``` are a bunch of standard lines we add to all our demos.

```html
    <!-- Adding a script block to post message to the parent container (think iframed demos) -->
    <script type="text/javascript">
        window.addEventListener("hashchange",function(){parent.postMessage(window.location.hash, "*")});
    </script>

    <!-- Mapzen map UI -->
    <script src='https://mapzen.com/common/ui/mapzen-ui.min.js'></script>
    <script>
        MPZN.bug({
            name: 'Tangram',
            tweet: 'Check this tutorial about Tangram & 3er Party API cc @mapzen!',
            repo: 'https://github.com/tangrams/OWM'
        });
    </script>
```

This lines keeps our maps looking good and healthy when they are loaded as ```<iframe>``` on other pages and blogs.
The second block adds our fancy UI bug at the top of the map to make sharing easy, and adds the handy [Mapzen's Search](https://mapzen.com/projects/search?lng=-73.99240&lat=40.75530&zoom=12) plugin to make the map easy to navigate.

### What's ```main.js``` doing?

Here we are! We have made it to the guts of the demo. Let's take it slowly and look into each one of the routines in the order they are triggered.

#### Creating a map

```js
// Init tangram
map = (function () {
    'use strict';
    
    // Create a Leaflet Map
    var map = L.map('map',{
        trackResize: true,
        keyboard: false,
        dragging: (window.self !== window.top && L.Browser.touch) ? false : true,
        tap: (window.self !== window.top && L.Browser.touch) ? false : true,
    });

    // Create a Tangram Layer
    var layer = Tangram.leafletLayer({
        scene: 'scene.yaml',
        attribution: '<a href="http://openweathermap.org/" target="_blank">OpenWeatherMap</a> | <a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
    });

    window.layer = layer;
    var scene = layer.scene;
    window.scene = scene;

    map.setView([39.825, -98.170], 5); // Default map location
    var hash = new L.Hash(map);

    /***** Once the page is loaded is time to initialize the routines that handles the interaction *****/
    window.addEventListener('load', function () {
        init();
    });

    return map;
}());
```

These functions create a [Leaflet](http://leafletjs.com/) instance in ```map``` with some basic interactivity (learn more about [Leaflet setup here](http://leafletjs.com/reference.html)). It creates a leaflet [Tangram](https://mapzen.com/projects/tangram) layer called ```layer```. This [Tangram](https://mapzen.com/projects/tangram) instance is not particular or special in any way, we are just defining the proper attribution to: [OpenWeatherMap](http://openweathermap.org/) | [Tangram](https://mapzen.com/projects/tangram) | [OSM](http://www.openstreetmap.org/) and [Mapzen](https://mapzen.com/).

What will make this [Tangram](https://mapzen.com/projects/tangram) instance special is the ```scene.yaml``` file. This is a very powerful scene definition of the map. It will tell Tangram what data to load and how to interpret it. It's very very flexible and powerful which is why we are saving that for last... the big finale. What's important to have in mind now is that all the setup instructions loaded from the ```scene.yaml``` will be parsed and stored into the ```layer.scene``` which you can see we keep a handy link to in ```window.scene```. 

The final lines of this functions set a default position for the [Leaflet](http://leafletjs.com/) map (```[39.825, -98.170], 5``` A.K.A: United States of America seen from zoom level 5) together with an instance of [Michael Lawrence Evans's](https://github.com/mlevans) [Leaflet Hash plugin](https://github.com/mlevans/leaflet-hash) hooked to the [Leaflet](http://leafletjs.com/) ```map``` that will watch for the hash path on your browser.

By the end of the function we set an event listener for the page to finish loading. This will initialize the function responsible for the interaction.

#### Starting the party

So as we were saying, when the page finishes loading and all the content and the [Leaflet](http://leafletjs.com/) ```map``` and [Tangram](https://mapzen.com/projects/tangram) ```layer``` are initialized the event, ```load``` will be triggered and the following function will be executed.

```js
function init() {

    // Listen to when the user stop moving (`moveend`) the leaflet map
    // Note: a debounce function is use to prevent multiple calls to OpenWeatherMaps api
    map.on('moveend', debounce(function() {
        // Update the displayed information
        update();
    }, 1000));

    // Add Tangram `layer` to Leaflet `map`
    layer.addTo(map);
}
```

Two things are happening here:

- First we will listen the event ```moveend``` on [Leaflet](http://leafletjs.com/) ```map```. This event is triggered every time the user stops moving the map around (usually after dragging). There is a little trick there: we are using the ```debounce``` function for the callback. You will find the ```debounce``` function code at the end of the ```main.js``` file. Is a small function that prevents firing a function too many times. In this case will trigger ```update()``` only after one second. Why we are doing this? Well [OpenWeatherMaps](http://openweathermap.org/) is actually a paid service and their free API keys have a limit of 60 requests per minute. The ```debounce``` will prevent triggering the call if the user is constantnly moving the map around (thus triggering the ```moveend``` event constantly).

- ```layer.addTo(map)``` is an important line. That's the actual marriage between [Leaflet](http://leafletjs.com/) ```map``` and [Tangram](https://mapzen.com/projects/tangram) ```layer```. This line will add the [Tangram](https://mapzen.com/projects/tangram) ```layer``` into the [Leaflet](http://leafletjs.com/) ```map``` instance. Now they will roll together.

#### Updating content on Tangram

Welcome to what's probably the most crucial point of this tutorial. The following block will update the information coming from [OpenWeatherMap](http://openweathermap.org/) and pass it to [Tangram](https://mapzen.com/projects/tangram). If you have dealt with APIs in the past, you know that is not always as easy as it may sound. Essentially we have to format the data between the two ends of the equation. Let's begin by looking tthis block.

```js
function update() {

    // Get the current boundaries of the displayed area on the map
    var bbox = map.getBounds();

    // Make the URL for OpenWeatherMaps API, asking for all stations inside that area (bounding box)
    var url = 'http://api.openweathermap.org/data/2.5/box/station?cluster=true&cnt=200&format=json&bbox=';
    url += bbox.getNorthWest().lng + ',' +bbox.getNorthWest().lat + ',' + bbox.getSouthEast().lng + ',' + bbox.getSouthEast().lat + ',';
    url += map.getZoom();
    url += '&appid=6b75c0fa496c2aaf62eb52f8bcce7cd8';

    // Make the request and wait for the reply
    fetch(url)
        .then(function (response) {
            // If we get a positive response...
            if (response.status !== 200) {
                console.log('Error getting data from OpenWeatherMaps. Status code: ' + response.status);
                return;
            }
            // ... parse it to JSON
            return response.json();
        })
        .then(function(json) {
            // Check that there are stations in that area
            if (json.cnt === 0) {
                console.log('No stations in this region');
                return;
            }

            // Make a GeoJSON POI for every station
            var features = [];
            for (var i in json.list) {
                features.push(makePOIs(json.list[i]));
            }

            // Pass the POIs as a GeoJSON FeaturesCollection to tangram
            scene.setDataSource('stations', {type: 'GeoJSON', data: {
                'type': 'FeatureCollection',
                'features': features
            }});
        })
        .catch(function(error) {
            console.log('Error parsing the JSON from OpenWeatherMaps.', error)
        })
}
```

That was a lot! Let's review this in steps.

1) Constructing the call to [OpenWeatherMap](http://openweathermap.org/)

```js
    // Get the current boundaries of the displayed area on the map
    var bbox = map.getBounds();

    // Make the URL for OpenWeatherMaps API, asking for all stations inside that area (bounding box)
    var url = 'http://api.openweathermap.org/data/2.5/box/station?cluster=true&cnt=200&format=json&bbox=';
    url += bbox.getNorthWest().lng + ',' +bbox.getNorthWest().lat + ',' + bbox.getSouthEast().lng + ',' + bbox.getSouthEast().lat + ',';
    url += map.getZoom();
    url += '&appid=[API_KEY]';
```

We start by asking [Leaflet](http://leafletjs.com/) ```map``` for the visible bounding box and using the corners coordinates, we construct an HTTP Request to the [OpenWeatherMap](http://openweathermap.org/) server. To format it I'm following [this example of a call for the weather stations in an are](http://openweathermap.org/api_station). See that also I'm adding the current ```map``` zoom and the mandatory API KEY. 

A note about [OpenWeatherMap](http://openweathermap.org/) API KEY: in this example we are using our own free key, which very likely will run out of calls. To solve that you probably want to take your [free key here](http://openweathermap.org/appid)

2) Do the call 

```js
// Make the request and wait for the reply
    fetch(url)
```

3) turn the reply into JSON

```js
    .then(function (response) {
        // If we get a positive response...
        if (response.status !== 200) {
            console.log('Error getting data from OpenWeatherMaps. Status code: ' + response.status);
            return;
        }
        // ... parse it to JSON
        return response.json();
    })
```

4) Turn the JSON into GeoJSON

```js
        // Check that there are stations in that area
        if (json.cnt === 0) {
            console.log('No stations in this region');
            return;
        }

        // Make a GeoJSON POI for every station
        var features = [];
        for (var i in json.list) {
            features.push(makePOIs(json.list[i]));
        }
```

For this we are using a function call ```MakePOIs()``` (whcih you can also find at the end of the ```main.js```) to format every weather station information into a [GeoJSON](http://geojson.org/) [point](http://geojson.org/geojson-spec.html#point) (aka: POI).

5) Feed [Tangram](https://mapzen.com/projects/tangram) the new GeoJSON data

```js
        // Pass the POIs as a GeoJSON FeaturesCollection to tangram
        scene.setDataSource('stations', {type: 'GeoJSON', data: {
            'type': 'FeatureCollection',
            'features': features
        }});
```

Once the data is formatted as a GeoJSON collection of [```Points``` Features](http://geojson.org/geojson-spec.html#point), it is passed to [Tangram](https://mapzen.com/projects/tangram) by setting a new data source using [```setDataSource()``` method](https://github.com/tangrams/tangram-docs/blob/gh-pages/pages/Javascript-API.md#setdatasource_string_-name-_object_-config). It is very good at reading the GeoJSON format and will be able to display this data according the ```scene.yaml``` file.

#### Some notes about the GeoJSON format process

Before jumping to the next station of this adventure (the ```scene.yaml``` file), it is important we become familiar with the data we are passing to Tangram. Let's take a look to the function that formats each weather station data.

```js
function makePOIs(station) {
    if (!station.wind) {
        station.wind = {speed: 0, deg: 0};
    }
    return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [station.coord.lon, station.coord.lat]
            },
            properties: {
                name: station.name,
                temp: station.main ? station.main.temp || 0.0 : 0.0,
                pressure: station.main ? station.main.pressure || 0.0 : 0.0,
                humidity: station.main ? station.main.humidity || 0.0 : 0.0,
                w_speed: station.main ? station.wind.speed || 0.0 : 0.0,
                w_deg: station.wind ? station.wind.deg || 0.0 : 0.0, 
                kind: 'station'
            }
        };
}
```

This will construct an JS object that follows the [GeoJSON Object format](http://geojson.org/geojson-spec.html#geojson-objects) and will look something like this:

```JSON
{
    geometry: {
        coordinates: [ -177.3813, 28.2015],
        type: "Point"
    },
    properties: {
        humidity: 54,
        kind: "station",
        name: "PMDY",
        pressure: 1018,
        temp: 14,
        w_deg: 280,
        w_speed: 7.2
    },
    type: "Feature"
}
```

In the ```geometry``` section we specify the longitude and latitude coordinates and the type of the geometry (in this case, a [```Point```](http://geojson.org/geojson-spec.html#point)).
Then in the ```properties``` we are storing data about the station: ```name```, ```humidity```, ```temp``` (temperature), ```pressure```, ```w_deg``` (wind degree) and ```w_speed``` (wind speed). But also, and this is very important to remember,  we define the ```kind``` of this point as a ```station```. 

Why is the ```kind``` is so important?

Well [Tangram](https://mapzen.com/projects/tangram) knows how to read [GeoJSON](http://geojson.org/) files, right? But we need to tell them which ```kind``` of features we want to display. In order to do that, by default we need to group the ```feature``` we want to visualize into ```layers```.

Let's jump to the ```scene.yaml```, our last stop in this adventure.

### What's the ```scene.yaml``` telling Tangram to do?

Here we are in the ```scene.yaml```! We made it! but... it seem this journey is just beginning. I know the ```scene.yaml``` looks like it has a lot of cryptic lines. Let's go step by step and you will see that everything actually makes sense.

#### Sources

```yaml
sources:
    osm:
        type: TopoJSON
        url:  https://vector.mapzen.com/osm/all/{z}/{x}/{y}.topojson?api_key=[API_KEY] 
```

In this first block, we define our [OpenStreetMap](http://www.openstreetmap.org/) vector data source, called ```osm```. As you can see this data actually is coming from our servers, our special tiled blend of [OpenStreetMap](http://www.openstreetmap.org/) data. [Here is some nice documentation](https://mapzen.com/documentation/vector-tiles/) if you want to learn more about it.

The format of the data coming in, [```TopoJSON```](https://en.wikipedia.org/wiki/GeoJSON#TopoJSON), is another open GEO standard. The url is formatted to load all the tiles in ```x```, ```y``` and ```z```.  Also note that we are adding an api_key at the end. Our API keys are totally free and unlimited. Wonderfull right? Get yours [here](https://mapzen.com/developers/sign_in) and replace the ```[API_KEY]``` holder with yours.

This will be enough to make the map.

But... Wait a minute! Where is the OpenWeaderMap data that we parsed and formated in JavaScript? 
Nice observation! Well we don't really need it here. Because is not a file there is no point to load it -- we are passing it directly from the ```main.js``` in each ```update()``` call. If you look up you will notice that we are setting that data source under the name ```stations``` and it contain a ```FeatureCollection``` of ```Points``` each one with the ```kind``` set in ```station```.

#### Layers

Immediately after defining the source, we will make some rules to split the content of each tile in different ```layers```. 

Most of the ```layers``` are pretty standard. You already have seen other rules similar to these:

```yaml
layers:
    earth:
        data: { source: osm }
        draw:
            polygons:
                order: 1
                color: [0.293, 0.300, 0.297]
    water:
        data: { source: osm }
        draw:
            polygons:
                order: 2
                color: [0.688, 0.695, 0.695]
    roads:
        data: { source: osm, layer: roads }
        filter: { $zoom: {min: 7}, not: { highway: service, kind: rail } }
        draw:
            lines:
                order: 7
                color: [.7,.7,.7]
                width: [[6,0px], [7,.25px], [10, .5px], [15, .75px], [17, 5m]]
        highway:
            filter: { kind: highway }
            draw:
                lines:
                    order: 8
                    color: [.8,.8,.8]#[1.000,0.897,0.058]
                    width: [[1,0px], [6,.25px], [11, 2px], [14, 3px], [16, 4px], [17, 10m]]
            link:
                filter: { is_link: yes } # on- and off-ramps, etc
                draw:
                    lines:
                        color: [.7,.7,.7]#[1.000,0.933,0.710]
                        width: [[10,0px], [14, 3px], [16, 5px], [18, 10m]]
                tunnel-link:
                    filter: {is_tunnel: yes, $zoom: {min: 13} }
                    draw:
                        lines:
                            color: [.5,.5,.5]#[0.805,0.748,0.557]
            tunnel:
                filter: {is_tunnel: yes, $zoom: {min: 13} }
                draw:
                    lines:
                        order: 5
                        color: [.5,.5,.5]#[0.805,0.748,0.557]
        major_road:
            filter: { kind: major_road }
            draw:
                lines:
                    color: [[13, [.6,.6,.6]], [17, white]]
                    width: [[1,0px], [6,.5px], [11,1px], [14, 2px], [16, 2.5px], [19, 8m]]
                    primary:
                        filter: { highway: primary }
                        draw:
                            lines:
                                width: [[1,0px], [6,.5px], [11,1px], [11, 1.5px], [13, 2.5px], [16, 2.5px], [19, 8m]]
                    secondary:
                        filter: { highway: secondary }
                        draw:
                            lines:
                                width: [[1,0px], [6,.5px], [11,1px], [13, 1.5px], [14, 2.5px], [16, 2.5px], [19, 8m]]
                    tertiary:
                        filter: { highway: tertiary }
                        draw:
                            lines:
                                width: [[1,0px], [6,.5px], [11,1px], [13, .75px], [14, 2.5px], [16, 2.5px], [19, 8m]]
        path:
            filter: { kind: path }
            draw:
                lines:
                    color: [0.8, 0.8, 0.8]
                    width: [[14,.1px],[16,.5px], [17, 2m]]
    landuse:
        data: { source: osm }
        draw:
            area:
                order: 3
                color: [0.443, 0.434, 0.434]
```

In a few words, we are drawing ```earth``` as ```polygons``` in a dark gray color, ```water``` as ```polygons``` in a light gray, different types of ```roads``` as ```lines``` with different configuration of ```order```, ```width``` and ```color```.

We are going to draw ```landuse``` specially with a subtle stripe pattern defined in the ```style``` call ```area```.

```yaml
styles:
    ...
    area:
        base: polygons
        mix: [geometry-matrices, functions-map, functions-aastep, space-tile]
        blend: inlay
        shaders: 
            blocks: 
                global: |
                    float stripes(vec2 st, float width){
                        st = rotate2D(0.78539816339)*st;
                        st *= 29.7;
                        return aastep(.5+width*0.5,abs(sin(st.y*3.14159265358)));
                    }
                filter: |
                    vec2 st = getTileCoords();
                    float pct = pow(1.-map(u_map_position.z,6.,20.,0.,1.),5.0);
                    color.a = stripes(st,pct*1.4)*.5;
```

As you mix some functions from other styles like libraries, we define a glsl function call ```stripes``` and use it as a ```filter```. A nice detail about this effect is that it varies the length of the stripe pattern depending the zoom level so you will see it more clearly while you zoom in. This animation transition is very visible between zoom 6 and 9.

Up to this point, it is a regular map. We are doing nothing with to visualize the weather station data. Let's start for analyzing the layer for the weather ```stations```:

```yaml
layers:
    ...
    station:
        data: { source: stations }
        draw:
            text:
                # Print the temperature (°C) instad of the actual name of the station 
                text_source: |
                    function() {
                        return feature.temp + '°';
                    }
                # Suspend label collisions and repetition checking
                collide: false
                repeat_distance: 0px
                # Show over all
                blend: overlay
                blend_order: 0
                offset: [0,-30px]
                font:
                    size: 20px
                    fill: black
                    stroke: { color: white, width: 5 }
            wind:
                blend: overlay
                blend_order: 1
                size: function() { return 20. + Math.pow(feature.w_speed, 0.5) * 20.; }
                color: |
                    function() {
                        return [ 127+parseFloat(feature.temp), feature.humidity, (feature.w_deg/360)*255 ];
                    }
```

We start by setting the name of this layer to match the ```kind``` we want to filter from the data source ```stations```. Tangram does this automatically, but there are ways to force to pick up a specific kind, if you prefer. For more information about this see [Styles Overview](https://mapzen.com/documentation/tangram/Styles-Overview/) and [layers](https://mapzen.com/documentation/tangram/layers/).

We them specify that for this data, we want to render two things: a ```text``` label and a ```wind``` arrow.

#### Drawing text

Inside the ```text``` node which calls the native ```text``` render style, we are going to fix the ```text_source``` to a JavaScript function. This function is going to populate the strings for each one of the displayed ```Points``` present on the GeoJSON file we constructed. The function in itself doesn't do to much, it just adds the degree symbol ```°``` at the end of each temperature number. The rest of the rules are to set the style, like the ```font``` and ```offset```. Note we are turning the collision and repetition checking off. We actually want to see all the entries and we don't worry if the labels get overlapped.

##### Visualizing data

To display the wind, we are going to take a more advance and less standard approach. (After all, we made it up to here and I don't want you to go home with enough to think about.)

We are going to make a special drawing ```style``` call ```wind``` which we will see in detail soon. What is important to note about this section is that we are going to use the data in a way that allow us to make sense of it visually.  

- First we are going to set the size of what will be our arrow to match the speed of the wind.

```yaml
    size: function() { return 20. + Math.pow(feature.w_speed, 0.5) * 20.; }
```

We do this with another JavaScript function that will return a size between 20 and 40 pixels depending on the value of ```feature.w_speed```. ```feature``` relates to the GeoJSON Point structure we defined in ```makePOIs()``` inside ```main.js```. 
The use of ```Math.pow()``` is a way to make the transition of size non-linear and visually more pleasant.

- Second, we will **encode** some of the weather station data into the color of the geometry. More precisely the ```temp``` (temperature) will be store in the **RED** channel, the ```humidity``` in **GREEN**, and the ```w_deg``` (wind degree) into the **BLUE**.

```yaml
    color: |
            function() {
                return [ 127+parseFloat(feature.temp), feature.humidity, (feature.w_deg/360)*255 ];
            }
```

Because each color channel has a range between `0` and `255`, we are encoding each value differently.

1) The temperature in Celsius often drops into negative numbers, so we shift the entire range. Note that the channel will always be passed a positive number. 0 celsius will be 127, 1 celsius will be 128 while -1 celsius will be 126, but this allows temperatures to go from -127C to 127C. Hope this makes sense to the reader.

2) The humidity doesn't need so much treatment and is directly passed to the green channel.

3) The wind degree probably represent the most complicated conversion. Because the range goes from 0 to 360, we need to normalize that range by divide it by the total (360) so we end up with a number from 0 to 1. Then we scale that range to the standard 0 to 255.

That's it! Our data is in the way to the GPU and into the fragment shader where we will draw something nice with it.

#### Using GLSL to visualize data

As you probably know, one of the most flexible features of Tangram is the ability to inject blocks of GLSL Shader code into the pipeline of a style. You can learn more about it here in the [Shaders overview](https://mapzen.com/documentation/tangram/Shaders-Overview/) of Tangram Documentation. If you are totally new to GLSL Shaders, we highly recommend you to check [The Book of Shaders](http://thebookofshaders.com/).

So let's make some sense of this data and draw an arrow visualizing the flow of the wind and the temperature of it. To recap from last section, the color was encoded into the **RED**, **GREEN** and **BLUE** channels on the CPU. Each channel with a range between 0 and 255, but inside the shader this color will be transformed to a range of 0 to 1 per channel in the ```vec3``` name ```color```. This color comes with the geometry that was constructed in the previous section.

Our first job to do here is to **decode** the values to something we can work with. The one that needs adjustment is the temperature -- we need to move it back to something that holds negative and positive numbers. We didn't encode the humidity so it makes sense to do nothing with it -- we can leave it normalized. FOr the direction of the wind:

```glsl
    float temp = .5+color.r*.5;
    float humidity = color.g;
    float w_deg = color.b*PI;
```

Not all the stations have a wind degree value, in those cases return a perfect 0. It is very unlikely for a wind to blow in perfect North direction so probably we can filter those out.

```glsl
    // Ignore wind blowing at 0.0 degrees. Probably is an error
    if (w_deg != 0.0)
```

The rest of the code is a nice little arrow I'm drawing using some [distance fields functions](http://thebookofshaders.com/07/)

Check out an [example of it here](http://editor.thebookofshaders.com/?log=160307211846)

With some minor adjustments, our arrows will be pointing in the right direction and will be correctly colored. The final style block look like this:

```yaml
    wind:
        base: points
        texcoords: true
        animated: true
        mix: [functions-aastep, geometry-matrices]
        shaders: 
            blocks: 
                global: |
                    float shape(vec2 st, int N){
                        st = st *2.-1.;
                        float a = atan(st.x,st.y)+PI;
                        float r = TWO_PI/float(N);
                        return cos(floor(.5+a/r)*r-a)*length(st);
                    }
                color: |
                    
                    float temp = .5+color.r*.5;
                    float humidity = color.g;
                    float w_deg = color.b*PI;

                    // Ignore wind blowing at 0.0 degrees. Probably is an error
                    if (w_deg != 0.0) {
                        vec2 st = v_texcoord.xy;
                        st -= .5;
                        st = rotate2D(w_deg)* st;
                        st *= .62;
                        st += .5;
                        float d = min(shape(st*vec2(1.5,1.)+vec2(-0.250,-0.07),3),shape(st*vec2(2.,1.)+vec2(-0.500,0.100),4));
                        color = mix(vec4(1.,0.,0.,1.),vec4(0.,0.,1.,1.),temp*4.-2.5)*vec4(1.0-step(.2,d));
                    } else {
                        color.a = 0.0;
                    }
```


