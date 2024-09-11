        // Initialize the map centered over the UK
        const map = L.map('map').setView([54.5, -3.5], 6);

        // Add OpenStreetMap tiles to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        let currentLatLng = null;
        let selectedDot = null;
        let conectionModeFlag = false

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
            contextMenu.style.left = `${e.originalEvent.pageX - 200}px`;
            contextMenu.style.top = `${e.originalEvent.pageY - 100}px`;
        }

        // Map click handler: Hides the context menu
        function onMapClick() {
            document.getElementById('context-menu').style.display = 'none';
        }

        // Dot click handler: Handles selection of a dot and changes its color
        function onDotClick(e) {
            const dot = e.target;
            if(conectionModeFlag){createConnection(selectedDot.getLatLng(), dot.getLatLng())}else{
                    
           
            // Reset previously selected dot color
            if (selectedDot) {
                selectedDot.setStyle({ color: 'red' });
            }
            // Highlight the clicked dot
            selectedDot = dot;
            selectedDot.setStyle({ color: 'green' });
            document.getElementById('connection-button').style.display = 'block';}    
        }

        function enterConnectionMode() {
                conectionModeFlag = true;
                document.getElementById('connection-indicator').style.display = 'block'
        }           

        function createConnection(latlng1, latlng2) {
            L.polyline([latlng1, latlng2], {
                color: 'blue',
                weight: 3,
                opacity: 0.7
            }).addTo(map);
        }

        // Context menu click handler: Creates a new dot on the map
        function onContextMenuOptionClick(e) {
            if (e.target.id === 'create-dot') {
                if (currentLatLng) {
                    const newDot = L.circleMarker(currentLatLng, {
                        radius: 8,
                        fillColor: 'red',
                        color: 'red',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(map); // Add directly to the map

                    // Attach click event listener to the new dot
                    newDot.on('click', onDotClick);
                    console.log("New dot created at", currentLatLng); // Debug message

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

        // Attach map and context menu events
        map.on('contextmenu', onMapRightClick);  // Right-click event
        map.on('click', onMapClick);  // Regular left-click event
        document.getElementById('connection-button').addEventListener('click', enterConnectionMode);
        document.getElementById('create-dot').addEventListener('click', onContextMenuOptionClick);  // Context menu option
