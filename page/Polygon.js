// Add this to your existing code
let polygonMode = false;
let polygonPoints = []; // Array to store clicked points for the polygon
let polygonLayer = null; // Reference to the polygon layer
// Function to handle polygon button click
function togglePolygonMode() {
    const polygonButton = document.getElementById('polygon-button');
    if (!polygonMode) {
        // Enter polygon mode
        polygonMode = true;
        polygonButton.innerText = 'Finish'; // Change button text to "Finish"
        polygonPoints = []; // Reset the points for the polygon
        map.on('click', onMapPolygonClick); // Enable map click to add points
    } else {
        // Finish the polygon
        if (polygonPoints.length > 2) { // A valid polygon needs at least 3 points
            drawPolygon();
        }
        polygonMode = false;
        polygonButton.innerText = 'Polygon'; // Change button text back to "Polygon"
        map.off('click', onMapPolygonClick); // Disable map click for polygon
    }
}
// Function to handle map clicks for polygon points
function onMapPolygonClick(e) {
    // Add clicked point to the array
    polygonPoints.push([e.latlng.lat, e.latlng.lng]);
    // Optionally, show markers for clicked points (temporary visual aid)
    L.circleMarker(e.latlng, {
        radius: 4,
        fillColor: 'orange',
        color: 'orange',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);
}
// Function to draw the polygon
function drawPolygon() {
    if (polygonLayer) {
        map.removeLayer(polygonLayer); // Remove the previous polygon if any
    }
    // Draw the polygon using the collected points
    polygonLayer = L.polygon(polygonPoints, {
        color: 'green',
        fillColor: '#3388ff',
        fillOpacity: 0.5
    }).addTo(map);
    // Reset the points array after the polygon is drawn
    polygonPoints = [];
}

// Add the button click event handler
polygonButton.addEventListener('click', togglePolygonMode);


