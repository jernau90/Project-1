// Right-click handler: Shows the context menu
function onMapRightClick(e) {
  currentLatLng = e.latlng;
  const contextMenu = document.getElementById('context-menu');
  contextMenu.style.display = 'block';
  conectionModeFlag = false;
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
  if(conectionModeFlag){createConnection(selectedDot, dot)                   
  }else{
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
  // Populate form with selected dot's name and type
  document.getElementById('dot-name').value = selectedDot.options.dotName || '';
  document.getElementById('dot-type').value = selectedDot.options.dotType || '';
  document.getElementById('dot id').value = selectedDot.options.id|| '';
  document.getElementById('dot-form').style.display = 'block';
  document.getElementById('line-form').style.display = 'none';
  }
}


// Line click handler: Handles selection of a line and changes its color
function onLineClick(e) {
  if (selectedLine) {
      selectedLine.setStyle({ color: 'blue' });
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
  document.getElementById('end-id').value = selectedLine.options.end|| '';
  document.getElementById('distance').value = (selectedLine.options.distance / 1000).toFixed(2) + ' km';
}

//enter connection mode
function enterConnectionMode() {
  conectionModeFlag = true;
  document.getElementById('connection-indicator').style.display = 'block'
}           


//create a connection between two dots
function createConnection(dot1, dot2) {
//const newdistance = dot1.getLatLng().distanceTo(dot2.getLatLng());
const newdistance = calculateRoadDistance(latLng1, latLng2)
const polyline = L.polyline([dot1.getLatLng(), dot2.getLatLng()], {
// Update the connection form with the calculated distance (converted to kilometers)
  color: 'blue',
  weight: 3,
  opacity: 0.7,
  Linename: '',
  Linetype: '',
  start: dot1.options.id,
  end: dot2.options.id,
  distance: newdistance
}).addTo(connections);
conectionModeFlag = false;
document.getElementById('connection-indicator').style.display = 'none'
selectedDot.setStyle({ color: 'red' });
selectedDot = null;
selectedLine = polyline;
selectedLine.setStyle({ color: 'green' }); 
document.getElementById('line-form').style.display = 'block';
document.getElementById('dot-form').style.display = 'none';
polyline.on('click', onLineClick);
// Update the connection form with the calculated distance (converted to kilometers)
document.getElementById('distance').value = (selectedLine.options.distance / 1000).toFixed(2) + ' km';
}


//removes the connections associated with a dot that is deleted
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

// Function to calculate road distance using OpenRouteService
function calculateRoadDistance(latlng1, latlng2) {
    const apiKey = '5b3ce3597851110001cf6248aa66421c31a54497aa7c03e8a9e8f207';
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${latlng1.lng},${latlng1.lat}&end=${latlng2.lng},${latlng2.lat}`;

    // Make the API request
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const distance = data.routes[0].summary.distance; // Distance in meters
            document.getElementById('distance-box').value = (distance / 1000).toFixed(2) + ' km (road)';
        })
        .catch(error => console.error('Error fetching road distance:', error));
}
