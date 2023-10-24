// Start of marker image path
const markerPathStart =
  "https://uploads-ssl.webflow.com/64fa7d1f00d18f244fdb3270/65";
let activeMarker;

$(".locationpage").on("click", function (evt) {
  const location = evt.currentTarget.dataset.location;
  window.location.replace(`${window.location.origin}/location/${location}`);
});

setDisplayedLocationMarkers(false);

// Function to display markers of displayed locations
function setLocationMarkers() {
  // Clear existing markers
  markers.forEach((marker) => marker.setMap(null));
  markers = [];

  // Create markers for all locations.
  locations.forEach((location) => {
    let iconElem = markerPathStart + markerExtensions[i];
    let marker = new google.maps.Marker({
      map,
      icon: iconElem,
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
      marker.setIcon(markerPathStart + selectedMarkerExtensions[currentIndex]);
      activeMarker = marker;

      // Create info window for marker
      const contentString =
        '<div id="info-window">' +
        `<div id="info-window-background" style="background-image:url('` +
        displayedLocations[currentIndex].exterior +
        `');"></div>` +
        createCloseLocationWindowButton() +
        '<div id="info-window-text">' +
        '<h3 id="info-window-location-name">' +
        displayedLocations[currentIndex].loclabel +
        "</h3>" +
        '<p id="info-window-location-address">' +
        displayedLocations[currentIndex].address +
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
    infoWindowArea.close();
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
  const maxCharacters = 40, // whatever max charachter you like to display
    targets = document.getElementsByClassName("location-adress-item-mobile");

  Array.from(targets).forEach((target) => {
    const text = target.textContent,
      truncate = text.substring(0, maxCharacters);
    target.textContent = `${truncate}...`;
  });

  await initMap();
});
