## Using private APIs on Tangram

This is guide provides a case scenario of how to use [Mapzen's Tangram map engine](https://github.com/tangrams/tangram) with other 3er parties APIs to display data on a map.

It's writed for an audience with a medium technically knowladge about [Mapzen's vector tiles](https://mapzen.com/projects/vector-tiles) and  [Tangram's Java Script](https://github.com/tangrams/tangram). We will be asuming you already have some basic experience setting up your own [Tangram client](https://mapzen.com/documentation/tangram/) and familiar editing [```.yaml``` scene files](https://mapzen.com/documentation/tangram/Scene-file/).

Feel free to clone this repository in your computer and run a local server for it:

```bash
git clone https://github.com/tangrams/OWM.git
python -m SimpleHTTPServer 8000
```   
 
If that doesn’t work, try:

```bash
python -m http.server 8000
```

To view the content navigate to: [http://localhost:8000](http://localhost:8000)

Take a moment to look the folders inside this folder and how they relate to each other.

You will note that:

- There is a ```main.js``` file that will load [Leaflet](http://leafletjs.com/) map and on top of it a [Tangram Layer](https://github.com/tangrams/tangram). Also this files is going to make request to the [OpenWeatherMap's API](http://openweathermap.org/api) every time the user move the map. The respond of this call is transformed into a GeoJSON to finnally pass it to Tangram how will visualize it. 

- The YAML file (```scene.yaml```) is a scene file that will tell Tangram.js how to style the map and more importantly in this case how to make sense of the data that is passed along.

- the HTML (```index.html```) is the glue that holds all together. Contains a minimal amount of CSS styling together to the calls to the Java Script files needed for this project.

### Let look inside the ```index.html```

The HTML have some basic styling (under the ```<style>``` tag) and is also responsable for 

### What's going on in ```main.js```


### What the ```scene.yaml``` is telling Tangram to do

