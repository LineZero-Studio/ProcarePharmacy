let activeMarker;

$(".locationpage").on("click", function (evt) {
  const location = evt.currentTarget.dataset.location;
  window.location.replace(`${window.location.origin}/location/${location}`);
});

// Function to display markers of displayed locations
function setLocationMarkers() {
  // Clear existing markers
  markers.forEach((marker) => marker.setMap(null));
  markers = [];

  // Create markers for all locations.
  locations.forEach((location) => {
    let marker = new google.maps.Marker({
      map,
      icon: allMapMarkerPath,
      title: location.name,
      position: {
        lat: Number(location.lat),
        lng: Number(location.lng),
      },
    });

    // Add a click listener for each marker, and set up the info window.
    marker.addListener("click", ({ domEvent, latLng }) => {
      let previousIndex = markers.indexOf(activeMarker);
      let currentIndex = markers.indexOf(marker);

      clearActiveMarker();

      // Set new active marker
      marker.setIcon(allMapMarkerPath);
      activeMarker = marker;

      // Create info window for marker
      const contentString =
        '<div id="info-window">' +
        `<div id="info-window-background" style="background-image:url('` +
        locations[currentIndex].exterior +
        `');"></div>` +
        createCloseLocationWindowButton() +
        '<div id="info-window-text">' +
        '<h3 id="info-window-location-name">' +
        locations[currentIndex].loclabel +
        "</h3>" +
        '<p id="info-window-location-address">' +
        locations[currentIndex].address +
        "</p>" +
        "</div>" +
        "</div>";

      const infoWindow = new google.maps.InfoWindow({
        content: contentString,
        ariaLabel: location.name,
      });
      infoWindows.push(infoWindow);

      // Open info window
      infoWindow.open({
        anchor: marker,
        map,
      });
    });

    markers.push(marker);
  });
}

// Function to clear the active marker with an InfoWindow currently open if there is one
function clearActiveMarker() {
  if (activeMarker) {
    activeMarker.setIcon(allMapMarkerPath);
    infoWindows.forEach((iwindow) => {
      iwindow.close();
    });
    infoWindows = [];
  }
}

// Function to make sure every location fits on the map
function createMapBounds() {
  const bounds = new google.maps.LatLngBounds();
  bounds.extend(map.getCenter());
  locations.forEach((location) => {
    bounds.extend(new google.maps.LatLng(location.lat, location.lng));
  });

  map.fitBounds(bounds);
}

document.addEventListener("DOMContentLoaded", async () => {
  const maxCharacters = 40, // whatever max character you like to display
    targets = document.getElementsByClassName("location-adress-item-mobile");

  Array.from(targets).forEach((target) => {
    const text = target.textContent,
      truncate = text.substring(0, maxCharacters);
    target.textContent = `${truncate}...`;
  });

  await initMap();
});
