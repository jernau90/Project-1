        // Initialize the map centered over the UK
        const map = L.map('map').setView([54.5, -3.5], 6);

        // Add OpenStreetMap tiles to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        let currentLatLng = null;
        let selectedDot = null;

        // Right-click handler: Shows the context menu
        function onMapRightClick(e) {
            currentLatLng = e.latlng;
            const contextMenu = document.getElementById('context-menu');
            contextMenu.style.display = 'block';
            contextMenu.style.left = `${e.originalEvent.pageX - 200}px`;
            contextMenu.style.top = `${e.originalEvent.pageY - 100}px`;
        }

        // Map click handler: Hides the context menu
        function onMapClick() {
            document.getElementById('context-menu').style.display = 'none';
        }

        // Dot click handler: Handles selection of a dot and changes its color
        function onDotClick(e) {
            console.log("Dot clicked!", e);
            const dot = e.target;

            // Reset previously selected dot color
            if (selectedDot) {
                selectedDot.setStyle({ color: 'red' });
            }

            // Highlight the clicked dot
            selectedDot = dot;
            selectedDot.setStyle({ color: 'green' });
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

        // Attach map and context menu events
        map.on('contextmenu', onMapRightClick);  // Right-click event
        map.on('click', onMapClick);  // Regular left-click event
        document.getElementById('create-dot').addEventListener('click', onContextMenuOptionClick);  // Context menu option
