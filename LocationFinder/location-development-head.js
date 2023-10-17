
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "AIzaSyDrMsbcOPpBnKJi7avj6GJilRdlJPSuJGc",
    v: "weekly",
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
  });

    let map;
  
  // List of locations created from Locations collection
  let locations = [];
  let locationsElements = [];
  
  let displayedLocations = [];
  let markers = [];
  let searchingAreaMarker;
  
  let infoWindows = [];
  let infoWindowArea;
  
  let locationList = [];
  let locationListBackup = [];
  const defaultCenterPosition = { lat: 43.76228, lng: -79.41673 };
  
  const defaultZoom = 10.5;
  const ipLocationZoom = 10.5;
  const locationSearchZoom = 12;
  const markerClickZoom = 14;
  
  let _ipAddress;
  let ipLocationCache = {};
  let ipLocationCacheExists = false;
  
  // Change first number to change policy; days * hours * minutes * seconds * milliseconds
  const retentionFactor = (7 * 24 * 60 * 60 * 1000);
  const ipRegistryAPIKey = 'iwf1g4hhgjdb700y';
  
  console.log("Buff Genji");

  // Check to see if there is a location cache
  function checkForIPLocationCache() {
  	if (localStorage) {
    	ipLocationCache = JSON.parse(localStorage.getItem('ipLocationCache'));
      
      if((ipLocationCache != null) && (checkRetention())) {
      		console.log("Cache is valid!");
      		return true;
      }
      else {
        console.log("Cache is invalid!");
        return false;
      }
    }
  }
  
  // See if cache is within retention policy
  function checkRetention() {
  	let expirationDate = new Date(ipLocationCache.timeStamp).getTime() + retentionFactor;
    let currentDate = new Date().getTime();
    
    if(expirationDate < currentDate)
    	return false;
    else
    	return true;   	
  }
  
  // Create a localStorage item for relevant ip location data
  function createIPLocationCache() {
  	localStorage.setItem('ipLocationCache',JSON.stringify(ipLocationCache));
  }
  
  // Convert degrees to radians
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  
  async function displayLocation(lat, lng, locName) {
    // Request needed libraries
  	const { Map } = await google.maps.importLibrary("maps");
    
  	const position = { lat: lat, lng: lng };
  	const marker = new google.maps.Marker({
    	map: map,
      position: position,
      title: locName,
    });
  }
  
  function findClosestLocations(currentLocation, placeSearchingThisAreaPin) {
  	
		setScrollToZero();
  
    displayedLocations = [];
    
    locationList = document.getElementsByClassName("location-list")[0];
    const listItems = document.getElementsByClassName("location-item");
    
    let numberOfLocations = locationList.length < 10 ? locationList.length : 10;

    const locationListLength = locationList.childNodes.length;
    
    for(i=0;i<locationListLength;i++) {
    	locationList.removeChild(locationList.firstChild)
    }
    
    for(i=0;i<locationListBackup.length;i++) {
    	locationList.appendChild(locationListBackup[i]);
    }
    
    // Loop to assign distance from currentLocation to each location
 		locations.forEach((location) => {
    	let distance = getDistanceFromLatLonInKm(currentLocation, location);
      location.distance = distance;
      location.orderNumber = 99999;
    });
    
    // Create a sorted version of the locations list
    let sortedLocations = locations.sort(
    	(loc1, loc2) => (loc1.distance < loc2.distance) ? -1 : (loc1.distance > loc2.distance) ? 1 : 0);
    
    // Loop to change displayed locations to first 10 from sortedLocations
    for(i=0;i<numberOfLocations;i++) {
    	sortedLocations[i].orderNumber = i + 1;
    	displayedLocations.push(sortedLocations[i]);
    }
    
    for(i=0;i<listItems.length;i++) {
    	try {
    		document.querySelectorAll('[locname="'+sortedLocations[i].name+'"]')[0].setAttribute('ordernumber',i+1);
      }
      catch(error) { console.error(error) }
    }
    
    const listItemsArray = Array.from(listItems);
    
    listItemsArray.sort(function(a,b) {
    	return a.getAttribute("orderNumber")-b.getAttribute("orderNumber");
    })
    
    while(locationList.firstChild) {
    	locationList.removeChild(locationList.firstChild);
    }
    
    for(i=0;i<numberOfLocations;i++) {
    	locationList.appendChild(listItemsArray[i]);
    }
    
    addDistanceAndOrderNumber(locationList);
    setDisplayedLocationMarkers(placeSearchingThisAreaPin);
  }
  
  // Handle getting IP location data
  async function getIPLocationData() {
  	let url = "https://api.ipregistry.co/";
  	
  	if(checkForIPLocationCache()) {
    	console.log("Cache found! Cache created on "+ipLocationCache.timeStamp);
      ipLocationCacheExists = true;
      await initMap();
      findClosestLocations({lat:ipLocationCache.lat,lng:ipLocationCache.lng}, true);
      createMapBounds();
    }
    else {
    	// Retrieve user's IP address
    	const ipRegistryPromise = fetch('https://api.ipify.org')
      	.then((res) => res.text())
        .then(ip => {
          _ipAddress = ip;
          // After getting ip, make the call to ipRegistry for location data
        	return fetch(url + ip + '?key=' + ipRegistryAPIKey);
        })
        .then(response => response.json())
        .catch(err => console.log('Request failed', err))
        
       // Create an object to store relevant data from ipRegistry API
      ipRegistryPromise.then(async (locationData) => {
        ipLocationCache = {
        		timeStamp: new Date(locationData.time_zone.current_time).toUTCString(),
            lat:locationData.location.latitude,
            lng:locationData.location.longitude,
            city:locationData.location.city,
            postalCode:locationData.location.postal,
            ipAddress:_ipAddress
        };
        // Stores ip location data into localStorage
        createIPLocationCache();
        ipLocationCacheExists = true;
        await initMap();
        
        findClosestLocations({lat:ipLocationCache.lat,lng:ipLocationCache.lng}, true);
        createMapBounds();
        return;
      })
      .catch(async (err) => {
      	console.log("Invalid API result, can't create cache", err);
        await initMap();
        findClosestLocations({lat:defaultCenterPosition.lat,lng:defaultCenterPosition.lng},true);
        createMapBounds();
      });
    }
  }
  
  async function initMap() {
  	let position = defaultCenterPosition;
    
    // Request needed libraries.
  	const { Map } = await google.maps.importLibrary("maps");
  	const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  	const { Places } = await google.maps.importLibrary("places");
    
    // Create the search box and link it to the UI element.
    const input = document.getElementById("location-search");
    const searchBox = new google.maps.places.SearchBox(input);
    
  	// The map, centered in Toronto
  	map = new Map(document.getElementById("map"), {
    	zoom: ipLocationCacheExists ? ipLocationZoom : defaultZoom,
    	center: ipLocationCacheExists ? {lat:ipLocationCache.lat,lng:ipLocationCache.lng} : position,
      mapTypeControl: false,
    	mapId: "LOCATION_MAP_ID",
  	});
    
    map.addListener("click", () => {
    	clearActiveMarker();
    });
    
    map.addListener("zoom_changed", () => {
    	//console.log("Zoom level: "+map.getZoom());
    });

    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
			const areaWindow = $('#info-window-area-pin');
  		createCloseAreaWindowButton(areaWindow);
		});
     
    searchBox.addListener("places_changed", () => {
    	const places = searchBox.getPlaces();
      
      if (places.length == 0) {
      	return;
      }
      
      // Clear out the old markers
      markers.forEach((marker) => {
      marker.setMap(null);
       });
      
      markers = [];
       
      places.forEach((place) => {
      	if(!place.geometry || !place.geometry.location) {
        	console.log("Returned place contains no geometry");
          return;
        }
       
        map.setCenter(place.geometry.location);
        
        findClosestLocations({lat:place.geometry.location.lat(), lng:place.geometry.location.lng()}, true);
      });
      createMapBounds();
    });
    
    createSearchThisAreaBtn();
    createAreaInfoWindow();
  }
  
  // Get locations data from Locations collection
  function retrieveLocationData() {
  	locationElements = document.querySelectorAll("div[id^='LOCATIONID_']");
  	locationElements.forEach((element) => locations.push({"name": element.dataset.locname, "loclabel": element.dataset.loclabel, "lat": element.dataset.latitude, "lng": element.dataset.longitude, "distance": -1,"address":element.dataset.address, "exterior":element.dataset.exterior}));
}