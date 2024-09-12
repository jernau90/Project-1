let polygon = null;
let vertices = [];  // Store polygon vertices
let markers = [];   // Store the markers for dragging vertices
let polygonMode = false;
let polygonButton = document.getElementById("polygon-button");

// Toggle polygon mode
polygonButton.addEventListener("click", togglePolygonMode);

function togglePolygonMode() {
    if (!polygonMode) {
        polygonMode = true;
        polygonButton.innerText = "Finish Polygon";
    } else {
        finishPolygon();
    }
}

// Handle map clicks to add polygon vertices
map.on("click", function(e) {
    if (!polygonMode) return;

    const latlng = e.latlng;
    vertices.push(latlng);

    // Draw or update the polygon
    if (polygon) {
        polygon.setLatLngs(vertices);
    } else {
        polygon = L.polygon(vertices).addTo(map);
    }
});

// Finish polygon creation
function finishPolygon() {
    polygonMode = false;
    polygonButton.innerText = "Polygon Mode";

    if (!polygon) return;  // No polygon to finish

    // Add draggable markers at each vertex
    addVertexMarkers();
}

// Add draggable markers for each polygon vertex
function addVertexMarkers() {
    markers.forEach(marker => map.removeLayer(marker));  // Remove any existing markers
    markers = [];  // Clear the markers array

    // Add a draggable marker for each vertex
    vertices.forEach((latlng, index) => {
        const marker = L.marker(latlng, { draggable: true }).addTo(map);
        markers.push(marker);

        // On drag, update the polygon shape
        marker.on("drag", function(e) {
            const newLatLng = e.target.getLatLng();
            vertices[index] = newLatLng;  // Update the vertex position
            polygon.setLatLngs(vertices);  // Update the polygon shape
        });

        // On drag end, update the final coordinates
        marker.on("dragend", function() {
            console.log("Vertex dragged to:", vertices[index]);
        });
    });
}

// Optional: Add a clear button to reset the polygon
document.getElementById('clear-button').addEventListener('click', function() {
    if (polygon) {
        map.removeLayer(polygon);  // Remove the polygon
        markers.forEach(marker => map.removeLayer(marker));  // Remove the vertex markers
        vertices = [];  // Clear vertices
        markers = [];   // Clear markers
        polygon = null; // Reset the polygon
    }
});

