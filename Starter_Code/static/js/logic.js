// Establish dataset url
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Create base map and layer to hold earthquake markers
function createMap(earthquakes) {

    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let baseMaps = {
        "Street Map": streetmap
      };

    let overlayMaps = {
        "All Earthquakes (past 7 days)": earthquakes
      };

    let map = L.map("map", {
        center: [39.83, -98.58],
        zoom: 5,
        layers: [streetmap, earthquakes]
      })
      
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    L.control.Legend({
        position: 'bottomright',
        title: 'Earthquake Depth',
        legends: [{
            label: '< 10',
            type: 'circle',
            radius: '100',
            color: '#33ff99'
        }]
    }).addTo(map);
}

// Determine marker size
function markerSize(magnitude) {
    return magnitude * 15000;
  }

// Determine marker color
function chooseColor(depth) {
    switch (true) {
        case Number(depth) < 10: return '#33ff99'
        case Number(depth) < 30: return '#33ff33'
        case Number(depth) < 50: return '#99ff33'
        case Number(depth)< 70: return '#ffff33'
        case Number(depth) < 90: return '#ff9933'
        case Number(depth) >= 90: return '#ff3333'
        default: return 'gray'
    }
}

// Create earthquake markers
function createMarkers(response) {
    let recordedEarthquakes = response.features;
    let earthquakeMarkers = []

    for (let index = 0; index < recordedEarthquakes.length; index++) {
        let earthquake = recordedEarthquakes[index]

        let earthquakeMarker = L.circle([earthquake.geometry.coordinates[1],earthquake.geometry.coordinates[0]], {
            fillOpacity: 0.25,
            //Color is based on earthquake depth
            color: chooseColor(earthquake.geometry.coordinates[2]),
            fillColor: chooseColor(earthquake.geometry.coordinates[2]),
            //Radius is based on earthquake magnitude
            radius: markerSize(earthquake.properties.mag)
        })
        //Create popup that includes location, depth, and magnitude
        .bindPopup(`<h2>Location: ${earthquake.properties.place}</h2> <hr> 
                    <h3>Depth: ${earthquake.geometry.coordinates[2]} <br>
                        Magnitude: ${earthquake.properties.mag}</h3>`)

        earthquakeMarkers.push(earthquakeMarker)
    }

    createMap(L.layerGroup(earthquakeMarkers))
}

// Get data from url and call createMarkers
d3.json(url).then(createMarkers)

