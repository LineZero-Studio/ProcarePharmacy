// Google Maps JavaScript Library bootstrap loader
((g) => {
  var h,
    a,
    k,
    p = "The Google Maps JavaScript API",
    c = "google",
    l = "importLibrary",
    q = "__ib__",
    m = document,
    b = window;
  b = b[c] || (b[c] = {});
  var d = b.maps || (b.maps = {}),
    r = new Set(),
    e = new URLSearchParams(),
    u = () =>
      h ||
      (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + "");
        for (k in g)
          e.set(
            k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
            g[k]
          );
        e.set("callback", c + ".maps." + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => (h = n(Error(p + " could not load.")));
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
        m.head.append(a);
      }));
  d[l]
    ? console.warn(p + " only loads once. Ignoring:", g)
    : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
  key: "AIzaSyDrMsbcOPpBnKJi7avj6GJilRdlJPSuJGc",
  v: "weekly",
  // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
});

// CDN Script for Before Body
//<script src="https://cdn.jsdelivr.net/gh/PierreRamzyy/ProcarePharmacy@***commitId***/LocationFinder/location-development-before-body.min.js"></script>

// CDN Script for Inside Head
//<script src="https://cdn.jsdelivr.net/gh/PierreRamzyy/ProcarePharmacy@***commitId***/LocationFinder/location-development-head.min.js"></script>

let map;

// List of locations created from Locations collection
let locations = [];
let locationsElements = [];

let markers = [];

let infoWindows = [];
let infoWindowArea;

const defaultCenterPosition = { lat: 43.76228, lng: -79.41673 };

const defaultZoom = 10.5;
const ipLocationZoom = 10.5;
const locationSearchZoom = 12;
const markerClickZoom = 14;

const allMapMarkerPath =
  "https://uploads-ssl.webflow.com/64fa7d1f00d18f244fdb3270/65373f3fd38967c933f9bdc7_allMapMarker.svg";

let _ipAddress;
let ipLocationCache = {};
let ipLocationCacheExists = false;

console.log("Buff Genji");

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  retrieveLocationData();

  // The map, centered in Toronto
  map = new Map(document.getElementById("map"), {
    zoom: defaultZoom,
    center: findCenter(),
    mapTypeControl: false,
    mapId: "LOCATION_MAP_ID",
  });

  // Clear active marker and info window on map click
  map.addListener("click", () => {
    clearActiveMarker();
  });

  // Set markers for all locations
  setLocationMarkers();

  // Create map bounds to specify zoom level
  createMapBounds();
}

// Get locations data from Locations collection
function retrieveLocationData() {
  locationElements = document.querySelectorAll("div[id^='LOCATIONID_']");
  locationElements.forEach((element) =>
    locations.push({
      name: element.dataset.locname,
      loclabel: element.dataset.loclabel,
      lat: element.dataset.latitude,
      lng: element.dataset.longitude,
      distance: -1,
      address: element.dataset.address,
      exterior: element.dataset.exterior,
    })
  );
}

function findCenter() {
  // Implement feature later, this is a placeholder for testing
  return defaultCenterPosition;
}
