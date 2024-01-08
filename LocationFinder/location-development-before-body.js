// Start of marker image path
const markerPathStart =
  "https://uploads-ssl.webflow.com/60392b8b1c9914f4005be205/";
// Marker path extensions
const markerExtensions = [
  "652987957dd95b3e9e2bd379_pin01.svg",
  "6529879547293cd0da4cac6f_pin02.svg",
  "65298796af0e864ce18a063a_pin03.svg",
  "652987953d1f4605cf1531a8_pin04.svg",
  "6529879520159c505a8f549b_pin05.svg",
  "65298795ae3d89c38870611c_pin06.svg",
  "652987958463cc3a8a080fb6_pin07.svg",
  "6529879585542a50bf57a548_pin08.svg",
  "65298795b417280809ec0259_pin09.svg",
  "6529879564ab20fa4af2a61d_pin10.svg",
];

const selectedMarkerExtensions = [
  "6529878aae46aeb7730e63be_PinSelected01.svg",
  "6529878a7d34b296e0c2f378_PinSelected02.svg",
  "6529878a297de02af3f0b487_PinSelected03.svg",
  "6529878acb727c9314be780b_PinSelected04.svg",
  "6529878a00f18f1ca62326f6_PinSelected05.svg",
  "6529878af7446503a019739b_PinSelected06.svg",
  "6529878a2631f110ae93151e_PinSelected07.svg",
  "6529878a25ad9713c844a024_PinSelected08.svg",
  "6529878a64ab20fa4af29a74_PinSelected09.svg",
  "6529878a7dd95b3e9e2bc79e_PinSelected10.svg",
];

const searchingAreaMarkerExtension =
  "653ac42a93859d3f6fd2c7c4_Searching Here Pin.svg";

locationList = document.getElementsByClassName("location-item");
Array.from(locationList).forEach((node) =>
  locationListBackup.push(node.cloneNode(true))
);

$(".nearestlocation").on("click", async function (evt) {
  const className = await getNearestLocationAndUpdate();
  $(`.${className}`).click();
});

$(".test").on("click", function (evt) {
  map.setZoom(12);
  console.log("Set zoom to 12! ***TEST***");
});

async function getNearestLocationAndUpdate() {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const _lat = position.coords.latitude;
      const _lng = position.coords.longitude;

      map.setCenter({ lat: _lat, lng: _lng });
      map.setZoom(locationSearchZoom);

      findClosestLocations({ lat: _lat, lng: _lng }, true);
      createMapBounds();
    },
    function (error) {
      console.error("Error getting user's location: ", error);
    }
  );
}

$(".pharmacynearme").on("click", function (evt) {
  const zoom = $(window).width() >= 768 ? 11 : 10;
  InitMap(defaultZoom);
  Webflow.validClick = function () {
    return true;
  };
});

$(".locationpage").on("click", function (evt) {
  const location = evt.currentTarget.dataset.location;
  window.location.replace(`${window.location.origin}/location/${location}`);
});

setDisplayedLocationMarkers(false);
let activeMarker;

// Function to display markers of displayed locations
async function setDisplayedLocationMarkers(placeSearchingThisAreaPin) {
  // Clear existing markers
  markers.forEach((marker) => marker.setMap(null));

  if (searchingAreaMarker) searchingAreaMarker.setMap(null);

  markers = [];
  searchingAreaMarker = null;

  // Create markers for the 10 closest locations.
  for (var i = 0; i < displayedLocations.length; i++) {
    let iconElem = markerPathStart + markerExtensions[i];
    let marker = new google.maps.Marker({
      map,
      icon: iconElem,
      title: displayedLocations[i].name,
      position: {
        lat: Number(displayedLocations[i].lat),
        lng: Number(displayedLocations[i].lng),
      },
    });

    // Add a click listener for each marker, and set up the info window.
    marker.addListener("click", ({ domEvent, latLng }) => {
      let previousIndex = markers.indexOf(activeMarker);
      let currentIndex = markers.indexOf(marker);

      clearActiveMarker();

      // Change list entry color
      locationList.childNodes.forEach((locationItem) => {
        locationItem.style.backgroundColor = "#F8FCFF";
      });
      locationList.childNodes[currentIndex].style.backgroundColor = "#FFF";

      // Set new active marker
      marker.setIcon(markerPathStart + selectedMarkerExtensions[currentIndex]);
      activeMarker = marker;

      // Set list scroll
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      )
        $(".location-list-wrapper").scrollLeft(currentIndex * 355);
      else $(".location-list-wrapper").scrollTop(currentIndex * 370.2);

      // Create info window for marker
      const contentString =
        '<a href="https://www.procare-pharmacy.ca/locations/' +
        displayedLocations[currentIndex].slug +
        '">' +
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
        "</div>" +
        "</a>";
      const infoWindow = new google.maps.InfoWindow({
        content: contentString,
        ariaLabel: displayedLocations[currentIndex].name,
      });
      infoWindows.push(infoWindow);

      // Open info window
      infoWindow.open({
        anchor: marker,
        map,
      });
    });

    // Link list entry to marker
    locationList.childNodes[i].addEventListener("click", function (evt) {
      let index = this.getElementsByClassName("dynamic-order")[0].innerHTML - 1;
      locationList.childNodes.forEach((locationItem) => {
        locationItem.style.backgroundColor = "#F8FCFF";
      });
      this.style.backgroundColor = "#FFF";
      google.maps.event.trigger(markers[index], "click", {});
    });

    markers.push(marker);
  }

  if (markers.length > 0) {
    // If 'searchingTheArea' button was pressed
    if (placeSearchingThisAreaPin) {
      searchingAreaMarker = new google.maps.Marker({
        map,
        icon: markerPathStart + searchingAreaMarkerExtension,
        title: "Searching this area",
        position: map.getCenter(),
        animation: google.maps.Animation.DROP,
      });

      searchingAreaMarker.addListener("click", ({ domEvent, LatLng }) => {
        // Reset selected marker to unselected
        if (activeMarker) {
          activeMarker.setIcon(
            markerPathStart + markerExtensions[markers.indexOf(activeMarker)]
          );
          infoWindows.forEach((iwindow) => {
            iwindow.close();
          });
        }

        infoWindowArea.open({
          anchor: searchingAreaMarker,
          map,
        });
      });
    }
  }
}

function clearActiveMarker() {
  if (activeMarker) {
    activeMarker.setIcon(
      markerPathStart + markerExtensions[markers.indexOf(activeMarker)]
    );
    infoWindows.forEach((iwindow) => {
      iwindow.close();
    });
    infoWindows = [];
    infoWindowArea.close();
  }
}

// Get distance from one point on Earth to another
function getDistanceFromLatLonInKm(loc1, loc2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(loc2.lat - loc1.lat); // deg2rad below
  var dLon = deg2rad(loc2.lng - loc1.lng);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(loc1.lat)) *
      Math.cos(deg2rad(loc2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function addDistanceAndOrderNumber(locationList) {
  for (i = 0; i < locationList.childNodes.length; i++) {
    // Order number
    locationList.childNodes[i].getElementsByClassName(
      "dynamic-order"
    )[0].innerHTML = locationList.childNodes[i].getAttribute("ordernumber");

    // Distance
    locationList.childNodes[i].getElementsByClassName(
      "dynamic-distance"
    )[0].innerHTML = Number(displayedLocations[i].distance).toFixed(1) + " km";
  }
}

function setScrollToZero() {
  // Set list scroll
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  )
    $(".location-list-wrapper").scrollLeft(0);
  else $(".location-list-wrapper").scrollTop(0);
}

function createAreaInfoWindow() {
  // InfoWindow for searchingTheArea pin
  const areaPinContentString =
    '<div id="info-window-area-pin">' +
    createCloseAreaWindowButton() +
    '<div id="info-window-area-text">' +
    '<h3 id="info-window-area-title">Searching Here</h3>' +
    '<p id="info-window-area-caption">This pin is where our searches are relative to</p>' +
    "</div>" +
    "</div>";

  infoWindowArea = new google.maps.InfoWindow({
    content: areaPinContentString,
    ariaLabel: "SearchingHere",
  });
}

function createMapBounds() {
  const bounds = new google.maps.LatLngBounds();
  bounds.extend(map.getCenter());
  bounds.extend(
    new google.maps.LatLng(displayedLocations[0].lat, displayedLocations[0].lng)
  );

  map.fitBounds(bounds);

  if (map.getZoom() > locationSearchZoom) {
    map.setZoom(locationSearchZoom);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const maxCharacters = 40, // whatever max charachter you like to display
    targets = document.getElementsByClassName("location-adress-item-mobile");

  Array.from(targets).forEach((target) => {
    const text = target.textContent,
      truncate = text.substring(0, maxCharacters);
    target.textContent = `${truncate}...`;
  });
});
// Check for IP Location data
getIPLocationData();
