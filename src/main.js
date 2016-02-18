// ============================================= INIT
// Prepair leafleat and tangram
var stations;

map = (function () {
    'use strict';

    var map_start_location = [0, 0, 3];
    /*** URL parsing ***/
    var url_hash = window.location.hash.slice(1).split('/');
    if (url_hash.length == 3) {
        map_start_location = [url_hash[1],url_hash[2], url_hash[0]];
        map_start_location = map_start_location.map(Number);
    }

    var query = parseQuery(window.location.search.slice(1));

    // Leaflet Map
    var map = L.map('map',{
        trackResize: true,
        keyboard: false,
        dragging: (window.self !== window.top && L.Browser.touch) ? false : true,
        tap: (window.self !== window.top && L.Browser.touch) ? false : true,
    });

    // Tangram Layer
    var layer = Tangram.leafletLayer({
        scene: 'scene.yaml',
        attribution: '<a href="https://twitter.com/patriciogv" target="_blank">@patriciogv</a> | <a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
    });

    window.layer = layer;
    var scene = layer.scene;
    window.scene = scene;

    map.setView(map_start_location.slice(0, 2), map_start_location[2]);
    var hash = new L.Hash(map);

    /***** Render loop *****/
    window.addEventListener('load', function () {
        init();
    });
    return map;
}());

function init() {
    // Scene initialized
    map.on('moveend', (event) => {
        stopMovement();
    });
    layer.addTo(map);
}

var stopMovement = debounce(function() {
    updateStations();
}, 500);

function makePOIS(station) {
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
                    // name: station.name,
                    name: station.main.temp,
                    pressure: station.main.pressure,
                    humidity: station.main.humidity,
                    w_speed: station.wind.speed,
                    w_deg: station.wind.deg, 
                    kind: 'station'
                }
            };
}

function updateStations() {
    var bbox = map.getBounds();
    var url = 'http://api.openweathermap.org/data/2.5/box/station?cluster=no&cnt=200&format=json&bbox=';
    url += bbox.getNorthWest().lng + ',' +bbox.getNorthWest().lat + ',' + bbox.getSouthEast().lng + ',' + bbox.getSouthEast().lat + ',';
    url += map.getZoom();
    url += '&appid=6b75c0fa496c2aaf62eb52f8bcce7cd8'
    stations = JSON.parse(fetchHTTP(url));
    if (stations.cnt === 0) {
        return;
    }

    var features = [];
    for (var i in stations.list) {
        var station = stations.list[i];
        features.push(makePOIS(station));
    }

    // Get the geoJSON to add the orbit to
    scene.setDataSource('stations', {type: 'GeoJSON', data: {
        'type': 'FeatureCollection',
        'features': features
    }});
}


// ============================================= Helpers
function parseQuery (qstr) {
    var query = {};
    var a = qstr.split('&');
    for (var i in a) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1]);
    }
    return query;
}

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function fetchHTTP(url, methood) {
    var request = new XMLHttpRequest(), response;

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            response = request.responseText;
        }
    }
    request.open(methood ? methood : 'GET', url, false);
    request.overrideMimeType("text/plain");
    request.send(null);
    return response;
}