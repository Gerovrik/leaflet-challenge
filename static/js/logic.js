// Ask user  magintued multipiler - helps suit the indvidual user
var UserInput = window.prompt("Enter magintued multiplier - Refresh to change : ");
//queryURL stored
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create map object center at San Antonio
var myMap = L.map("mapid", {
    center: [29.424349, -98.491142],
    zoom: 5
});

// added dark layer to map
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "dark-v10",
    accessToken: API_KEY
}).addTo(myMap);

  
//geojason data input
d3.json(queryUrl, function(data) {
    function styleSetup(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: depthColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Depth Colors 
    function depthColor(depth) {
        return depth > 90 ? "#e84030" :
               depth > 70 ? "#F07A40" :
               depth > 50 ? "#F07707" :
               depth > 30 ? "#F0C206" :
               depth > 10 ? "#D3F024" :
                            "#87ec51" ;

    }
    
    function getRadius(mag) {
        if (mag === 0) {
            return 1;
        }
        return mag * UserInput;
    }
        //popups
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h2>${feature.properties.place}</h2>
        <hr><p>Magnitude: ${feature.properties.mag}<br>${new Date(feature.properties.time)}</p>`); 
    }

    // Make a geojson layer
    geojson = L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleSetup,
        onEachFeature: onEachFeature
      
    }).addTo(myMap);

    // Make a legend
    var legend = L.control({position: "bottomright"});
    
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend"),
            depthLevel = ['-10', '10', '30', '50', '70', '90'];
            depthColorLables = ["#87ec51","#D3F024", "#F0C206", "#F07707", "#F07A40", "#e84030"];
            div.innerHTML += "<h4>Depths</h4>";
    
        //Making lables
        for (var i = 0; i < depthLevel.length; i++) {
            div.innerHTML +=
                "<i style='background: " + depthColorLables[i] + "'></i> " +
                depthLevel[i] + (depthLevel[i + 1] ? "&ndash;" + depthLevel[i + 1] + "<br>" : "+");
        }
        return div;
    };

    legend.addTo(myMap)
});