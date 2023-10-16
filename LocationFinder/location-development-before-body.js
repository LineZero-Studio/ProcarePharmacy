    // Start of marker image path
  const markerPathStart = "https://uploads-ssl.webflow.com/64fa7d1f00d18f244fdb3270/65";
  // Marker path extensions
  const markerExtensions = ["1b94955b7d5a168690c781_pin01.svg",
  "1b9495c8c4fda10dcedb96_pin02.svg","1b9495a68886e4172a8249_pin03.svg",
  "1b94953e3841f4481f1f24_pin04.svg","1b9496b7970eb877139140_pin05.svg",
  "1b94957fe4e6d1b7599071_pin06.svg","1b9495a68886e4172a82b3_pin07.svg",
  "1b9495b7970eb877139056_pin08.svg","1b94958c2adb9234076640_pin09.svg",
  "1b9495beccf35f365f2e9d_pin10.svg"];
    
  const selectedMarkerExtensions = ["1b95464d6195a65d4a1a7f_PinSelected01.svg",
  "1b9547a3255cf8ca04e570_PinSelected02.svg","1b95476e86b996798912d3_PinSelected03.svg",
  "1b9547a68886e4172b1bd7_PinSelected04.svg","1b9547ecfa9b8a0207afff_PinSelected05.svg",
  "1b9547ecfa9b8a0207b00c_PinSelected06.svg","1b95474e33d016c177069f_PinSelected07.svg",
  "1b954796b829a772da93cd_PinSelected08.svg","1b95475b7d5a1686916f19_PinSelected09.svg",
  "1b9547e50cf4dd82daf106_PinSelected10.svg"];
    
  const searchingAreaMarkerExtension = "24d5e3a54c8991585f1c9b_SearchingHerePin.svg"; 
    
	locationList = document.getElementsByClassName("location-item");
  Array.from(locationList).forEach((node) => locationListBackup.push(node.cloneNode(true)));


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
    	function(position) {
      	const _lat = position.coords.latitude;
        const _lng = position.coords.longitude;
        
        map.setCenter({lat:_lat,lng:_lng});
        map.setZoom(locationSearchZoom);
        
        findClosestLocations({lat:_lat,lng:_lng}, true);
        createMapBounds();
      },
      function(error) {
      	console.error("Error getting user's location: ", error);
      });
  }

  $(".pharmacynearme").on("click", function (evt) {
  const zoom = $( window ) .width() >= 768 ? 11: 10;
    InitMap(defaultZoom);
    Webflow.validClick = function(){return true};
  });

  $(".locationpage").on("click", function (evt) {
  	const location  = evt.currentTarget.dataset.location;
    window.location.replace(`${window.location.origin}/location/${location}`)
  });

    setDisplayedLocationMarkers(false);
    let activeMarker;
	
    // Function to display markers of displayed locations
	async function setDisplayedLocationMarkers(placeSearchingThisAreaPin) { 
    
    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));
    
    if(searchingAreaMarker) 
    	searchingAreaMarker.setMap(null);
    
    markers = [];
    searchingAreaMarker = null;
    
    // Create markers for the 10 closest locations.
    for(var i=0;i<displayedLocations.length;i++) {
    	let iconElem = markerPathStart + markerExtensions[i];
      let marker = new google.maps.Marker({
          map,
          icon: iconElem,
          title: displayedLocations[i].name,
          position: {lat: Number(displayedLocations[i].lat), lng: Number(displayedLocations[i].lng)},
      });
      
      // Add a click listener for each marker, and set up the info window.
    	marker.addListener("click", ({ domEvent, latLng }) => {   
        let previousIndex = markers.indexOf(activeMarker);
        let currentIndex = markers.indexOf(marker);
        
        clearActiveMarker();
        
        // Change list entry color
        locationList.childNodes.forEach((locationItem) => {
        	locationItem.style.backgroundColor = '#F8FCFF';
        });
        locationList.childNodes[currentIndex].style.backgroundColor = "#FFF";
        
        // Set new active marker
       	marker.setIcon(markerPathStart + selectedMarkerExtensions[currentIndex]); 
        activeMarker = marker;
        
        // Set list scroll
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
 					$('.location-list-wrapper').scrollLeft(currentIndex * 355);
        else
        	$('.location-list-wrapper').scrollTop(currentIndex * 370.2);
        
        // Create info window for marker
        const contentString = 
        	'<div id="info-window">'+
        		`<div id="info-window-background" style="background-image:url('`+displayedLocations[currentIndex].exterior+`');"></div>`+
            createCloseLocationWindowButton()+
            '<div id="info-window-text">'+
            	'<h3 id="info-window-location-name">'+displayedLocations[currentIndex].loclabel+'</h3>'+
              '<p id="info-window-location-address">'+displayedLocations[currentIndex].address+'</p>'+
            '</div>'+
          '</div>';
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
      locationList.childNodes[i].addEventListener('click',function(evt) {
      	let index = this.getElementsByClassName('dynamic-order')[0].innerHTML - 1;
        locationList.childNodes.forEach((locationItem) => {
        	locationItem.style.backgroundColor = '#F8FCFF';
        });
        this.style.backgroundColor = '#FFF';
      	google.maps.event.trigger(markers[index],'click', {});
      }); 
        
    	markers.push(marker);
    }
    
    if(markers.length > 0) {

      // If 'searchingTheArea' button was pressed
      if(placeSearchingThisAreaPin) {
        searchingAreaMarker = new google.maps.Marker({
          map,
          icon: markerPathStart + searchingAreaMarkerExtension,
          title: "Searching this area",
          position: map.getCenter(),
          animation: google.maps.Animation.DROP,
        });

        searchingAreaMarker.addListener("click", ({ domEvent, LatLng }) => {
          // Reset selected marker to unselected
          if(activeMarker) {
            activeMarker.setIcon(markerPathStart+markerExtensions[markers.indexOf(activeMarker)]);
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
  	if(activeMarker)	{
    	activeMarker.setIcon(markerPathStart + markerExtensions[markers.indexOf(activeMarker)]);
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
  
  	for(i=0;i<locationList.childNodes.length;i++) {
  		// Order number
  		locationList.childNodes[i].getElementsByClassName("dynamic-order")[0].innerHTML = locationList.childNodes[i].getAttribute("ordernumber");
    
    	// Distance
    	locationList.childNodes[i].getElementsByClassName("dynamic-distance")[0].innerHTML = Number(displayedLocations[i].distance).toFixed(1)+" km";
    }
  }
  
  function setScrollToZero() {
      // Set list scroll
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
 			$('.location-list-wrapper').scrollLeft(0);
    else
      $('.location-list-wrapper').scrollTop(0);
  }
  
  function createAreaInfoWindow() {
  	// InfoWindow for searchingTheArea pin
      const areaPinContentString = 
        '<div id="info-window-area-pin">'+
        	createCloseAreaWindowButton()+
          '<div id="info-window-area-text">'+
          	'<h3 id="info-window-area-title">Searching Here</h3>'+
          	'<p id="info-window-area-caption">This pin is where our searches are relative to</p>'+
        	'</div>'+
        '</div>';

      infoWindowArea = new google.maps.InfoWindow({
        content: areaPinContentString,
        ariaLabel: "SearchingHere",
      });
  }
  
  function createMapBounds() {
  	const bounds = new google.maps.LatLngBounds();
    bounds.extend(map.getCenter());
    bounds.extend(new google.maps.LatLng(displayedLocations[0].lat,displayedLocations[0].lng));
    
    map.fitBounds(bounds);
    
    if(map.getZoom() > locationSearchZoom) {
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