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

        // Right-click handler: Shows the context menu
        function onMapRightClick(e) {
            currentLatLng = e.latlng;
            const contextMenu = document.getElementById('context-menu');
            contextMenu.style.display = 'block';
            conectionModeFlag = false;
            document.getElementById('connection-indicator').style.display = 'none'
            document.getElementById('connection-button').style.display = 'none'
            if (selectedDot) {
                selectedDot.setStyle({ color: 'red' });
            }
            if (selectedLine) {
                selectedLine.setStyle({ color: 'blue' });
            }
            contextMenu.style.left = `${e.originalEvent.pageX - 200}px`;
            contextMenu.style.top = `${e.originalEvent.pageY - 100}px`;
            document.getElementById('dot-form').style.display = 'none'
            document.getElementById('line-form').style.display = 'none'
            document.getElementById('line-name').value = ''; // Clear line name
            document.getElementById('line-type').value = ''; // Clear line type;
            document.getElementById('dot-name').value = ''; // Clear dot name
            document.getElementById('dot-type').value = ''; // Clear dot type;
            document.getElementById('dot id').value = ''; // Clear dot ID;
        }

        // Map click handler: Hides the context menu
        function onMapClick() {
            document.getElementById('context-menu').style.display = 'none';
        }

        // Dot click handler: Handles selection of a dot and changes its color
        function onDotClick(e) {
            const dot = e.target;
            if(conectionModeFlag){createConnection(selectedDot, dot)}else{
            if (selectedLine) {
                selectedLine.setStyle({ color: 'blue' });
            }        
            selectedLine = null;
            // Reset previously selected dot color
            if (selectedDot) {
                selectedDot.setStyle({ color: 'red' });
            }
            // Highlight the clicked dot
            selectedDot = dot;
            selectedDot.setStyle({ color: 'green' });
            document.getElementById('connection-button').style.display = 'block';}

            // Populate form with selected dot's name and type
            document.getElementById('dot-name').value = selectedDot.options.dotName || '';
            document.getElementById('dot-type').value = selectedDot.options.dotType || '';
            document.getElementById('dot id').value = selectedDot.options.id|| '';
            document.getElementById('dot-form').style.display = 'block';
            document.getElementById('line-form').style.display = 'none';
        }

        // Dot click handler: Handles selection of a dot and changes its color
        function onLineClick(e) {
            if (selectedLine) {
                selectedLine.setStyle({ colour: 'blue' });
            } 
            // Reset previously selected dot color
            if (selectedDot) {
                selectedDot.setStyle({ color: 'red' });
            }
           selectedDot = null;
            const line = e.target;
            selectedLine = line;
            selectedLine.setStyle({ color: 'green' }); 

            document.getElementById('line-form').style.display = 'block';
            document.getElementById('dot-form').style.display = 'none';

            // Populate form with selected lines's name and type
            document.getElementById('line-name').value = selectedLine.options.lineName || '';
            document.getElementById('line-type').value = selectedLine.options.lineType || '';
            document.getElementById('start-id').value = selectedLine.options.start|| '';
            document.getElementById('end-id').value = selectedLine.options.end|| '';}
        

        function enterConnectionMode() {
                conectionModeFlag = true;
                document.getElementById('connection-indicator').style.display = 'block'
        }           

        function createConnection(dot1, dot2) {
    const polyline = L.polyline([dot1.getLatLng(), dot2.getLatLng()], {
        color: 'blue',
        weight: 3,
        opacity: 0.7,
        Linename: '',
        Linetype: '',
        start: dot1.options.id,
        end: dot2.options.id
    }).addTo(connections);

        conectionModeFlag = false;
        document.getElementById('connection-indicator').style.display = 'none'

        polyline.on('click', onLineClick);
}

        function removeConnections(dot) {
                connections.eachLayer(function(layer) {
                if (layer instanceof L.Polyline) {
                    if (layer.options.start === dot.options.id || layer.options.end === dot.options.id) {
                connections.removeLayer(layer); // Remove the connection
                    }
                    };
                })
        }

        // Context menu click handler: Creates a new dot on the map
        function onContextMenuOptionClick(e) {
            if (e.target.id === 'create-dot') {
                if (currentLatLng) {
                 dotCounter++; // Increment the dot counter
                    const dotId = dotCounter; // Assign a new dot ID
                    const newDot = L.circleMarker(currentLatLng, {
                        radius: 8,
                        fillColor: 'red',
                        color: 'red',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8,
                        dotName: '',
                        dotType: '',
                        id: dotId
                    }).addTo(map); // Add directly to the map

                // Automatically select the new dot
                    selectedDot = newDot;
                    selectedDot.setStyle({ color: 'green' });
                   document.getElementById('connection-button').style.display = 'block';
                   document.getElementById('dot-form').style.display = 'block';

                    // Attach click event listener to the new dot
                    newDot.on('click', onDotClick);

                    currentLatLng = null; // Reset currentLatLng
                }
            }
            document.getElementById('context-menu').style.display = 'none';
        }

        // Event handler for updating dot properties from form input
        document.getElementById('dot-name').addEventListener('input', function() {
                if (selectedDot) {
                selectedDot.options.dotName = this.value;
            }
        });

        document.getElementById('dot-type').addEventListener('input', function() {
                if (selectedDot) {
                selectedDot.options.dotType = this.value;
            }
        });

        // Event handler for updating dot properties from form input
        document.getElementById('line-name').addEventListener('input', function() {
                if (selectedLine) {
                selectedLine.options.lineName = this.value;
            }
        });

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


document.getElementById('delete-dot').addEventListener('click', function() {
    if (selectedDot) {
        removeConnections(selectedDot);
        map.removeLayer(selectedDot);  // Remove the selected dot from the map
        selectedDot = null;  // Clear the selectedDot variable

        // Hide the form, delete button, and connection button
        document.getElementById('dot-form').style.display = 'none';
        document.getElementById('dot-name').value = ''; // Clear dot name
        document.getElementById('dot-type').value = ''; // Clear dot type
        document.getElementById('connection-button').style.display = 'none'; // Hide the connection button
    }
});
