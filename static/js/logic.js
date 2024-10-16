// Initialize the map
const map = L.map('map').setView([37.09, -95.71], 4); 

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Fetch the GeoJSON data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {
        data.features.forEach(earthquake => {
            const coords = earthquake.geometry.coordinates;
            const magnitude = earthquake.properties.mag;
            const depth = coords[2];
            const [lng, lat] = coords;

            // Determine marker size and color based on magnitude and depth
            const markerSize = magnitude * 5; // Scale for visualization
            const color = depth > 100 ? 'red' : depth > 50 ? 'orange' : 'green'; // Color by depth

            // Create a circle marker
            const marker = L.circleMarker([lat, lng], {
                radius: markerSize,
                fillColor: color,
                color: color,
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            }).addTo(map);

            // Add a popup with additional information
            marker.bindPopup(`
                <strong>Magnitude:</strong> ${magnitude}<br>
                <strong>Depth:</strong> ${depth} km<br>
                <strong>Location:</strong> ${earthquake.properties.place}
            `);
        });

        // Create a legend
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = function() {
            const div = L.DomUtil.create('div', 'legend');
            div.innerHTML += '<strong>Depth (km)</strong><br>';
            div.innerHTML += '<i style="background: red"></i> > 100<br>';
            div.innerHTML += '<i style="background: orange"></i> 50 - 100<br>';
            div.innerHTML += '<i style="background: green"></i> < 50<br>';
            div.innerHTML += '<br><strong>Magnitude</strong><br>';
            div.innerHTML += '<i style="width: 18px; height: 18px; background: black; display: inline-block;"></i> 1<br>';
            div.innerHTML += '<i style="width: 30px; height: 30px; background: black; display: inline-block;"></i> 2<br>';
            div.innerHTML += '<i style="width: 40px; height: 40px; background: black; display: inline-block;"></i> 3<br>';
            div.innerHTML += '<i style="width: 50px; height: 50px; background: black; display: inline-block;"></i> 4<br>';
            div.innerHTML += '<i style="width: 60px; height: 60px; background: black; display: inline-block;"></i> 5<br>';
            return div;
        };

        legend.addTo(map);
    })
    .catch(error => console.error('Error fetching earthquake data:', error));
