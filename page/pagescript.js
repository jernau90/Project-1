// Initialize the map centered over the UK
const map = L.map('map').setView([54.5, -3.5], 6);
// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


let currentLatLng = null;
let selectedDot = null;
let selectedLine = null;
let conectionModeFlag = false;
let dotCounter = 0; // Counter for dot IDs
let connections = L.layerGroup().addTo(map);


// Event handler for updating dot name from form input
document.getElementById('dot-name').addEventListener('input', function() {
        if (selectedDot) {
                selectedDot.options.dotName = this.value;
        }
});

// Event handler for updating dot type from form input
document.getElementById('dot-type').addEventListener('input', function() {
        if (selectedDot) {
                selectedDot.options.dotType = this.value;
        }
});


// Event handler for updating line name from form input
document.getElementById('line-name').addEventListener('input', function() {
        if (selectedLine) {
                selectedLine.options.lineName = this.value;
        }
});

// Event handler for updating line type from form input
document.getElementById('line-type').addEventListener('input', function() {
        if (selectedLine) {
                selectedLine.options.lineType = this.value;
        }
});

// Attach map and context menu events
map.on('contextmenu', onMapRightClick);  // Right-click event
map.on('click', onMapClick);  // Regular left-click event
document.getElementById('connection-button').addEventListener('click', enterConnectionMode);
document.getElementById('create-dot').addEventListener('click', onContextMenuOptionClick);  // Context menu option

// Event handler for deleting a dot
document.getElementById('delete-dot').addEventListener('click', function() {
    if (selectedDot) {
        removeConnections(selectedDot);
        map.removeLayer(selectedDot);  // Remove the selected dot from the map
        selectedDot = null;  // Clear the selectedDot variable

        // Hide the form, delete button, and connection button
        document.getElementById('dot-form').style.display = 'none';
        document.getElementById('dot-name').value = ''; // Clear dot name
        document.getElementById('dot-type').value = ''; // Clear dot type
    }
});

// Event handler for deleting a line
document.getElementById('delete-line').addEventListener('click', function() {
    if (selectedLine) {
        map.removeLayer(selectedLine);  // Remove the selected dot from the map
        selectedLine = null;  // Clear the selectedDot variable

        // Hide the form, delete button, and connection button
        document.getElementById('line-form').style.display = 'none';
        document.getElementById('line-name').value = ''; // Clear dot name
        document.getElementById('line-type').value = ''; // Clear dot type
    }
});
