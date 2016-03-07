## Using private APIs on Tangram

This is guide provides a case scenario of how to use [Tangram maps engine](https://github.com/tangrams/tangram) with other 3er party APIs.

It's writed for an audience with some technically knowladge about Java Script, [OpenStreetMap](http://leafletjs.com/), [our vector tiles](https://mapzen.com/projects/vector-tiles). We will also be asuming you already have some basic experience editing [Tangram's](https://github.com/tangrams/tangram) [```.yaml``` scene files](https://mapzen.com/documentation/tangram/Scene-file/). In case you don't, don't worry! The best place to start is looking arround the examples on [TangramPlay](https://mapzen.com/tangram/play/) and on [Tangram Documentation](https://mapzen.com/documentation/tangram/) following this nice [walkthrought of how to make a Tangram map](https://mapzen.com/documentation/tangram/walkthrough/#put-your-tangram-map-on-the-web). 

Also feel free to clone this repository in your computer, run it as a local server and make it your own. Tweaking and modifying is the best way to learn. How?

```bash
git clone https://github.com/tangrams/OWM.git
python -m SimpleHTTPServer 8000
```

If that doesn’t work, try:

```bash
python -m http.server 8000
```

To view the content on your browser navigate to: [http://localhost:8000](http://localhost:8000)

This example use a [OpenWeatherMap's API](http://openweathermap.org/api) with a free API Key. In case you get far away there is the chance you run out of calls to the servers. In that case is probably time to get your own free API key.
 
### Before starting 

Take a moment to look the folders inside this folder and how they relate to each other.

You will note:

- There is a ```main.js``` file that loads [Leaflet](http://leafletjs.com/) map and on top of it a [Tangram Layer](https://github.com/tangrams/tangram). Also this files is going to make the API calls to [OpenWeatherMap's API](http://openweathermap.org/api) every time the user move the map requesting information about the stations inside the map viewport area. The responces to this calls are transformed into a [GeoJSON](http://geojson.org/) to finnally pass it to [Tangram](https://github.com/tangrams/tangram) for rendered and display. 

- The YAML file (```scene.yaml```) is a scene file that will tell Tangram.js how to style the map and more importantly in this case how to make sense of the data that is passed along.

- the HTML (```index.html```) is the glue that holds all together. Contains a minimal amount of CSS styling together to the calls to the Java Script files needed for this project.

The rest of the files on this repository are not part of the example. 

- The ```README.md``` is the guide you are reading.
- The ```LICENSE``` file is just the [MIT License](https://opensource.org/licenses/MIT) we add to all our work here at [Mapzen](https://mapzen.com/) as part of our OpenSource & OpenData commitment.

### From the begining. Looking inside ```index.html```

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




