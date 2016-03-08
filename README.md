## Using private APIs on Tangram

This guide provides a case scenario of how to use [Tangram maps engine](https://github.com/tangrams/tangram) with other 3er party APIs.

It's writed for an audience with some technically knowladge about Java Script, [OpenStreetMap](http://leafletjs.com/) data and [our vector tiles](https://mapzen.com/projects/vector-tiles). It is best if you have some previus experience editing [Tangram's](https://github.com/tangrams/tangram) [```.yaml``` scene files](https://mapzen.com/documentation/tangram/Scene-file/). In case you don't, don't worry! A good place to start is by looking arround the examples on [TangramPlay](https://mapzen.com/tangram/play/) and reading [Tangram Documentation](https://mapzen.com/documentation/tangram/) specially following this nice [walkthrought of how to make a Tangram map](https://mapzen.com/documentation/tangram/walkthrough/#put-your-tangram-map-on-the-web). 

Also feel free to clone this repository in your computer, run it as a local server and make it your own. Tweaking and modifying is the best way to learn. How?

```bash
git clone https://github.com/tangrams/OWM.git
python -m SimpleHTTPServer 8000
```

If that doesn’t work, try:

```bash
python -m http.server 8000
```

To view the content on your browser, navigate to: [http://localhost:8000](http://localhost:8000)

***Note:*** Please have in mind that this example use one free API Key for [OpenWeatherMap service](http://openweathermap.org/api), if you get far away using it, there is the chance you run out of calls to the servers. In that case is probably time to get your own free API key.
 
### Before starting 

Take a moment to look the files inside this repository and how they relate to each other.

You will note:

- There is a ```main.js``` file that loads [Leaflet](http://leafletjs.com/) map and a [Tangram Layer](https://github.com/tangrams/tangram) on top of it. Also this file makes API calls to [OpenWeatherMap server](http://openweathermap.org/api) asking for weather station data every time the user finish moving the map. The responces to this calls are transformed into a [GeoJSON](http://geojson.org/) to be pass to [Tangram engine](https://github.com/tangrams/tangram) for rendered and display. 

- The YAML file (```scene.yaml```) is a scene file that will tell Tangram.js how to style the map and make sense of the weather station data.

- the HTML (```index.html```) is the glue that holds all together. Contains a ```<div>``` holder for the map, a minimal amount of CSS styling together with the calls to the Java Script files needed for this project.

The rest of the files on this repository are not strictly necesary for this example.

- The ```README.md``` is the guide you are reading.
- The ```LICENSE``` file is the [MIT License](https://opensource.org/licenses/MIT) we add to all our work here at [Mapzen](https://mapzen.com/).

### Inside ```index.html```

Let's jump an look inside the glue that holds all together to be serve to browsers, the ```index.html``` file.

Although it was almost self explanatory let's do a brief recap of some of their important components:

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

This is our tool box. The set of libraries (hosted somewhere else) that we are going to use to compose our map.

In order, Which are they?

- [Leaflet](http://leafletjs.com/) this leading open-source JavaScript library for interactive maps is probably one of our best friends. It was a big community arround it. Is easy to use, well documented and incredible flexible. Note how we are adding  both ```leaflet.js``` and ```leaflet.css``` of the version ```v1.0.0-beta.2```.

- [Michael Lawrence Evans's](https://github.com/mlevans) [Leaflet Hash plugin](https://github.com/mlevans/leaflet-hash) adds dynamic URL hashes to Leaflet maps. In other words will let us easily link users to specific map views.

- [Tangram](https://mapzen.com/projects/tangram) ```0.5``` version. Our beloved and flexible browser-based mapping engine, designed for real-time rendering of 2D and 3D maps from vector tiles [Read more here](https://mapzen.com/documentation/tangram/).

- [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is a more powerful and flexible comming version of [```XMLRequest```](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest). Because is not supported by all browsers yet  we are using [Github's polyfill](https://github.com/github/fetch) of it. Hopefully in a near future this will not be necesary.

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

The main concern here is to use all the space on your browser to display the map. Note that the map is going to be placed on the ```<div>``` element with the ```id``` name ```map```.

#### The beating heart

```html
    <div id="map"></div>
    <script src="main.js"></script>
```

As we said previusly the [Leaflet](http://leafletjs.com/) map with the [Tangram](https://mapzen.com/projects/tangram) layer is going to be loaded inside the ```<div>``` element with the ```map``` id. Where and when that happens inmediatly after the ```<div>``` is created the ```main.js``` script is loaded. Soon we will see what this  Java Script do.

#### Some Mapzen's standar features

The rest of the HTML code in ```index.html``` are a bunch of standar lines we add to all our demos.

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
The second block adds our fansy UI bug at the top of the map for easy share and a handy [Mapzen's Search](https://mapzen.com/projects/search?lng=-73.99240&lat=40.75530&zoom=12) pluggin to make the map easy to navigate.

### What's ```main.js``` doing?

Here we are! We had arrived to the guts of the demo. Let's take it slowly and look into each one of the routines in the order they are trigger.

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

This functions creates a [Leaflet](http://leafletjs.com/) instance in ```map``` with some basic interactivity set up (learn more about [Leaflet setup here](http://leafletjs.com/reference.html)) to den create leaflet [Tangram](https://mapzen.com/projects/tangram) Layer call ```layer```. This [Tangram](https://mapzen.com/projects/tangram) instance is not particular or special in any kind, we are just defining the proper attribution to: [OpenWeatherMap](http://openweathermap.org/) | [Tangram](https://mapzen.com/projects/tangram) | [OSM](http://www.openstreetmap.org/) and [Mapzen](https://mapzen.com/).

What will make this [Tangram](https://mapzen.com/projects/tangram) instance special is the ```scene.yaml``` file. This is a very powerfull scene definition of the map. Will literary tell Tangram what data to load and how to interpret it. It's very very flexible and powerfull that's why we are saving that for the last... the big finnale. What's important to have in mind now is that all the setup loaded from the ```scene.yaml``` will be parse and stored into the ```layer.scene``` which you can see we will keep a handy link to it in ```window.scene```. 

The final lines of this functions set a default position for the [Leaflet](http://leafletjs.com/) map (```[39.825, -98.170], 5``` A.K.A: United States of America seen from zoom level 5) together with an instance of [Michael Lawrence Evans's](https://github.com/mlevans) [Leaflet Hash plugin](https://github.com/mlevans/leaflet-hash) hooked to the [Leaflet](http://leafletjs.com/) ```map``` that will watch for hash path on your browser.

By the end of the function we set an event listener to when the page finish loading. This will initialize the function responsable for the interaction.

#### Starting the party

So as we were saying the when the page finish loading and all the content and the [Leaflet](http://leafletjs.com/) ```map``` and [Tangram](https://mapzen.com/projects/tangram) ```layer``` are initialize the event ```load``` will be trigger and the following function will be excecute.

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

- First we will listen the event ```moveend``` on [Leaflet](http://leafletjs.com/) ```map```. This event is trigger every time the user stop moving the map arround. Usually after dragging. There is a  small little trick there. we are using the ```debounce``` function for the callback. You will find the ```debounce``` function code by the end of the ```main.js``` file. Is a small function that prevents firing a function to many times. In this case will trigger ```update()``` only after a second. Why we are doing this? Well [OpenWeatherMaps](http://openweathermap.org/) is actually a payed service and their free API keys have a limit of 60 per minute. The ```debounce``` will prevent to trigger the call in the case the user is triggering the ```moveend``` event constantly.

- ```layer.addTo(map)``` is an important line. That's the actual marrige between [Leaflet](http://leafletjs.com/) ```map``` and [Tangram](https://mapzen.com/projects/tangram) ```layer```. This line will add the [Tangram](https://mapzen.com/projects/tangram) ```layer``` into [Leaflet](http://leafletjs.com/) ```map``` instance. Now they will roll together.

#### Updating content on Tangram

Wellcome to what's probably the most crucial point of this tutorial. The following block will update the information comming from [OpenWeatherMap](http://openweathermap.org/) and pass it to [Tangram](https://mapzen.com/projects/tangram). If you have deal with API in the past you know that is not always so easy at may sound. Esentially we have to format the data between this to ends of the equation. Let's begin for looking to this block.

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

Well let's review this in steps.

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

We start by asking [Leaflet](http://leafletjs.com/) ```map``` for the visible bounding box and using the coorners coordinates to construct an Http Request to [OpenWeatherMap](http://openweathermap.org/) server. To format it I'm following [this example of a call for the weather stations in an are](http://openweathermap.org/api_station). See that also I'm adding the current ```map``` zoom and the mandatory API KEY. 

A note about [OpenWeatherMap](http://openweathermap.org/) API KEY: is not a completely open service, so in this example we are using owr oun free key, which is very likely will run out of calls. To solve that you probably want to take your [free key here](http://openweathermap.org/appid)

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

For this we are using a function call ```MakePOIs()``` (that you can also find at the end of the ```main.js```) to format every weather station information into a [GeoJSON](http://geojson.org/) [point](http://geojson.org/geojson-spec.html#point) (aka: POI).

5) Feed [Tangram](https://mapzen.com/projects/tangram) the new GeoJSON data

```js
        // Pass the POIs as a GeoJSON FeaturesCollection to tangram
        scene.setDataSource('stations', {type: 'GeoJSON', data: {
            'type': 'FeatureCollection',
            'features': features
        }});
```

Once the data is formated as a GeoJSON collection of [```Points``` Features](http://geojson.org/geojson-spec.html#point). Is pass to [Tangram](https://mapzen.com/projects/tangram) by seting a new data source using [```setDataSource()``` method](https://github.com/tangrams/tangram-docs/blob/gh-pages/pages/Javascript-API.md#setdatasource_string_-name-_object_-config) . is very good at reading GeoJSON format and will be hable to display this data according the ```scene.yaml``` file.

#### Some notes about the GeoJSON format process

Before jumping in into the next station of this adventure (the ```scene.yaml``` file) is important we are familiar with the data we are passing to Tangram. Let's take a look to the function that format each eather station data.

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

This will construct an JS object that follows the [GeoJSON Object format](http://geojson.org/geojson-spec.html#geojson-objects) that will look something like this:

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

In the ```geometry``` section we specify the longitud and latitud coordinates and the type of the geometry. In this case, a [```Point```](http://geojson.org/geojson-spec.html#point).
Then in the ```properties``` we are storing some data about the station like: ```name```, ```humidity```, ```temp``` (temperature), ```pressure```, ```w_deg``` (wind degree) and ```w_speed``` (wind speed). But also, and very important to remember,  we define the ```kind``` of this point as a ```station```. 

Why the ```kind``` is so important?

Well [Tangram](https://mapzen.com/projects/tangram) knows how to read [GeoJSON](http://geojson.org/) files. Right? But we need to tell them which ```kind``` of features we want to display. In order to that by default we need to group the ```feature``` we want to visualize into ```layers```.

Let's jump to the ```scene.yaml``` and our last stop into this adventure.

### What's ```scene.yaml``` telling Tangram to do?

Here we are in the ```scene.yaml```! We made it! but... seams this journey is just beginning. I know the ```scene.yaml``` seams to have lot of cryptic lines. Let's go step by step and you will see that actually everything makes more sense.

#### Sources

```yaml
sources:
    osm:
        type: TopoJSON
        url:  https://vector.mapzen.com/osm/all/{z}/{x}/{y}.topojson?api_key=[API_KEY] 
```

In this first block we define our [OpenStreetMap](http://www.openstreetmap.org/) vector data source call ```osm```. As you can see this data actually is comming form our servers, is our speciall tiled blend of [OpenStreetMap](http://www.openstreetmap.org/) data. [Here is a nice documentation](https://mapzen.com/documentation/vector-tiles/) about it if you want to learn more of it.

This data comming in [```TopoJSON```](https://en.wikipedia.org/wiki/GeoJSON#TopoJSON) another open GEO standar. The url is formated to load all the tiles in ```x```, ```y``` and ```z```. and also note that we are adding an api_key at the end. Our API keys are totally free and unlimited. Wonderfull right? Takes yours [here](https://mapzen.com/developers/sign_in) and replace the ```[API_KEY]``` holder with yours.

This will be enought to make the map.

But... Wait a minute! Where is the OpenWeaderMap data that we parse and format in JavaScript? 
Nice observation! Well we don't really need it here. Because is not a file there is not point to load it, we are passing it directly from the ```main.js``` in each ```update()``` call. If you look up you will notice that we are setting that data source under the name ```stations``` and it contain a ```FeatureCollection``` of ```Points``` each one with the ```kind``` set in ```station```.

#### Layers

Inmediatly after defining the source we will make some rules to split the content of each tile in different ```layers```. 

Most of the ```layers``` are preatty standar. You already have seen different rules similar to this ones:

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

In few words we are drawing ```earth``` as ```poligons``` in a dark gray color, ```water``` as ```poligons``` in a light gray, different types of ```roads``` as ```lines``` with different configuration of ```order```, ```width``` and ```color```.

We are going to draw ```landuse``` specially with a stutle stripe pattern defined in the ```style``` call ```area```.

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

Which as you mix some functions from other styles like libraries, defines a glsl function call ```stripes``` and use it as a ```filter```. The nice detail about this effect is that vary the lenght of the stripe pattern depending the zoom level so you will see it more clearly while you zoom in. This animation transition is very visible between zoom 6 and 9.

Up to here is a regular map. We are doing nothing with to visualize the weather station data. Let's start for analizing the layer for the weather ```stations```:

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
                # Suspend label collitions and repetition checking
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

We start by seting the name of this layer to match the ```kind``` we want to filter from the data source ```stations```. Tangram does this automatically, but there are ways to force to pick up a specific kind if you prefere. For more information about this see [Styles Overview](https://mapzen.com/documentation/tangram/Styles-Overview/) and [layers](https://mapzen.com/documentation/tangram/layers/).

Then we specify that for this data we want to render two things: ```text``` label and a ```wind``` arrow.

#### Drawing text

Inside the ```text``` node which calls the native ```text``` render style we are going to fix the ```text_source``` to a JavaScript function. This function is going to populate the strings for each one of the displayed ```Points``` present on the GeoJSON file we constructed. The function in it self doesn't do to much, just add's the degree simbol ```°``` at the end of each temperature number. The rest of the rules are to set the style, like the ```font``` and ```offset```. We are turning the collition and repetition checking off. We actually want to see all the entries and we don't worry if the labels get overlaped.

##### Visualizing data

To display the wind we are going to take a more advance and less standar aproach. After all, we made it up to here and I don't want you to go home with enought to think about. 

We are going to make a special drawing ```style``` call ```wind``` wich we will se in detail soon. What is important to take about this section is that we are going to use the data in a way that allow us to make sense of it visually.  

- First we are going to set the size of what will be our arrow to match the speed of the wind.

```yaml
    size: function() { return 20. + Math.pow(feature.w_speed, 0.5) * 20.; }
```

We do this with another JavaScript function the will return a size between 20 and 40 pixesl depending on the value of ```feature.w_speed```. ```feature``` relates to the GeoJSON Point structure we define in ```makePOIs()``` inside ```main.js```. 
The use of ```Math.pow()``` is a way to make the transition of size non linear and visually more pleasent.

- Second we will **encode** some of the rest of the weather station data into the color of the geometry. More precisly the ```temp``` (temperature) will be store in the **RED** channel, the ```humidity``` in **GREEN**, and the ```w_deg``` (wind degree) into the **BLUE**.

```yaml
    color: |
            function() {
                return [ 127+parseFloat(feature.temp), feature.humidity, (feature.w_deg/360)*255 ];
            }
```

Because each color channel have a range between 0 and 255 we are encoding each value differently.

1) The temperature in Celsius can go in negative numbers easily so we shift all the range a half the range so temperatures can go from -127 to 127. Note that in the channel will be pass always as a positive number. 0 celsius will be 127, 1 celsius will be 128 while -1 celsius will be 126. Hope this makes sense to the reader.

2) The humidity doesn't need so much treat as directly pass to the green channel.

3) The wind degree probably represent the most complicated conversion. Because the range goes from 0 to 360, we need to normalize that range by divide it by the total (360) so we end up with a number from 0 to 1. Then we scale that range to the standar 0 to 255.

That's it! Our data is in the way to the GPU and into the fragment shader where we will draw something nice with it.

#### Using GLSL to visualize data

As you probably know, one of the most flexible features of Tangram is be hable to inject blocks of GLSL Shader code into the pipeline of a style. You can learn more about it here in the [Shaders overview](https://mapzen.com/documentation/tangram/Shaders-Overview/) of Tangram Documentations. If you are totaly new to GLSL Shaders we higly recomend you to check [The Book of Shaders](http://thebookofshaders.com/).

So let's make some sense of this data and draw an arrow visualizing the flow of the wind and the temperature of it. To recap from last section the color was encoded into the RED, GREEN and BLUE channels on the CPU. Each channel with a range between 0 and 255, but inside the shader this color will be transform to a range from 0 to 1  per channel in the ```vec3``` name ```color```. This color comes with the geometry that was constructed in the previus section.

Our first job to do here is to **decode** the values to something we can work with. The one that needs more retouch is the temperature witch we need to move it back to something that holds negative and positive numbers. We practically didn't encode the humidty so it makes more sense to do nothing with it so we can leave it normalized. With the direction of the wind

```glsl
    float temp = .5+color.r*.5;
    float humidity = color.g;
    float w_deg = color.b*PI;
```

Not all the stations have a wind degree value, those cases return a perfect 0. Very unlikly for a wind to blow in perfect North direction so probably we can filter those out.

```glsl
    // Ignore wind blowing at 0.0 degrees. Probably is an error
    if (w_deg != 0.0)
```

The rest of the code is a nice little arrow I'm drawing using some [distance fields functions](http://thebookofshaders.com/07/)

Check an [example of it here](http://editor.thebookofshaders.com/?log=160307211846)

With some little ajustments our arrows will be pointing in the right direction and correctly colored. The final style block look like this:

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


