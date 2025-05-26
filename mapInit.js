// Initialize map
const map = L.map("map").setView([41.2, -4.2], 8);

// Add OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
  maxZoom: 19,
}).addTo(map);

// Function to get color based on distance
function getColor(distance) {
  if (distance > 18) return "#e74c3c"; // Red for long days
  if (distance >= 10) return "#f39c12"; // Orange for medium days
  if (distance > 0) return "#27ae60"; // Green for short days
  return "#3498db"; // Blue for start/end
}

// Function to get marker icon
function getMarkerIcon(point) {
  const color =
    point.type === "start" || point.type === "end"
      ? "#3498db"
      : getColor(point.distance);

  return L.divIcon({
    html: `<div style="
                    background: ${color};
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 12px;
                ">${point.day}</div>`,
    className: "custom-marker",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

// Add markers and create route line
const routeCoords = [];

routeData.forEach((point, index) => {
  // Add coordinates to route line
  routeCoords.push([point.lat, point.lng]);

  // Create popup content
  const popupContent = `
                <div class="popup-title">${point.name}</div>
                <div class="popup-distance">Day ${point.day}: ${
    point.distance
  }km</div>
                <div class="popup-accommodation">${
                  point.accommodation || "Starting point"
                }</div>
            `;

  // Add marker
  L.marker([point.lat, point.lng], {
    icon: getMarkerIcon(point),
  })
    .addTo(map)
    .bindPopup(popupContent);

  // Draw line segment to next point
  if (index < routeData.length - 1) {
    const nextPoint = routeData[index + 1];
    const color = getColor(nextPoint.distance);

    L.polyline(
      [
        [point.lat, point.lng],
        [nextPoint.lat, nextPoint.lng],
      ],
      {
        color: color,
        weight: 4,
        opacity: 0.8,
      }
    ).addTo(map);
  }
});

// Fit map to show entire route
const group = new L.featureGroup();
routeData.forEach((point) => {
  L.marker([point.lat, point.lng]).addTo(group);
});
map.fitBounds(group.getBounds().pad(0.1));

// Add special markers for start and end
// L.marker([routeData[0].lat, routeData[0].lng], {
//   icon: L.divIcon({
//     html: `<div style="
//                     background: #3498db;
//                     color: white;
//                     padding: 5px 10px;
//                     border-radius: 15px;
//                     font-weight: bold;
//                     border: 2px solid white;
//                     box-shadow: 0 2px 8px rgba(0,0,0,0.3);
//                     white-space: nowrap;
//                 ">🏁 START</div>`,
//     className: "start-marker",
//     iconSize: [80, 30],
//     iconAnchor: [40, 15],
//   }),
// }).addTo(map);

// L.marker(
//   [routeData[routeData.length - 1].lat, routeData[routeData.length - 1].lng],
//   {
//     icon: L.divIcon({
//       html: `<div style="
//                     background: #e74c3c;
//                     color: white;
//                     padding: 5px 10px;
//                     border-radius: 15px;
//                     font-weight: bold;
//                     border: 2px solid white;
//                     box-shadow: 0 2px 8px rgba(0,0,0,0.3);
//                     white-space: nowrap;
//                 ">🎯 FINISH</div>`,
//       className: "end-marker",
//       iconSize: [80, 30],
//       iconAnchor: [40, 15],
//     }),
//   }
// ).addTo(map);
