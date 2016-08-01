var map;
var service;
var infoWindow = null;


// ___________________INITIALIZE___________________
function initialize(location) {
  console.log("initialize function");

  var mapOptions = {
    center: new google.maps.LatLng(37.09024, -100.712891),
    zoom: 4,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };

//fire up map
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

// Set up markers api
    var markerOptions = {
      map: map
    };

    var marker = new google.maps.Marker(markerOptions);
    marker.setMap(map);

// Set up info window api
    var infoWindowOptions = {};
    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

    google.maps.event.addListener(marker,'click',function(){
    infoWindow.open(map, marker);
    });



// handling the performSearch types
function handleSearchResults(results, status){
  var place;
  if (results.length === 0){
    alert("No camping found in the area. If you think this is a mistake, try centering the map in the location you are searching in.");
  }

  for (var i = 0; i < results.length; i ++){
    var li = document.createElement("LI");
    var campList = document.getElementById('campList');

    place = results[i];
    if (place.rating && place.name.toLowerCase().indexOf('rv') === -1 && place.name.toLowerCase().indexOf('camp' || 'site') > -1){
      var photo = place.photos && place.photos[0] && place.photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200});
      var photo_url = photo ? '<img src="' + photo + '"/><br/>' : '';

      var marker = new google.maps.Marker({
          position: place.geometry.location, //change lat and lon
          map: map,
          info: "<div id='iw-container'> <div class ='iw-title'>" +
          place.name + "</div>" + photo_url +  "<br/>Camground rating: " + place.rating + "/5 </div>"
      });
      google.maps.event.addListener(marker, "click", function(){
        infoWindow.setContent(this.info);
        infoWindow.open(map, this);
      });

      // TODO Bind list to map
      // li.innerHTML = "<div class='campListItem'> <strong>" + results[i].name + "</strong>" + "</div>";
      // campList.appendChild(li);
      // li.addEventListener("click", function(){
      //   console.log(this.info);
      // });
    }
    console.log(results[i],results[i].name);
  }

}
//function to check nearby places
function performSearch(){
  var request = {
    bounds: map.getBounds(),
    types: ['campground'],
    rankBy: google.maps.places.RankBy.PROMINENCE,
  };
  service.nearbySearch(request, handleSearchResults);
}



//fire up places api
    service = new google.maps.places.PlacesService(map);

/*
  //Ensures waiting until map bounds are initialized before performing search
  google.maps.event.addListenerOnce(map,'bounds_changed', performSearch);
*/
//refresh on button click
  $('#campgroundSearchBtn').click(performSearch);


//___________________________Autocomplete search______________________
//Set default bounds for the autocomplete search results
// The autocomplete will be biased towards the latlng set below
  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(48.987386, -124.626080),
    new google.maps.LatLng(18.005611, -62.361014)
  );

  var options = {
    bounds: defaultBounds
  };
        // Get HTML autocomplete element
  var Autocompleteinput = document.getElementById('pac-input');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(Autocompleteinput);

        //Create autocomplete object
  var autocomplete = new google.maps.places.Autocomplete(Autocompleteinput, options);

  // Connect autocomplete to map
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
  infoWindow.close();
  var place = autocomplete.getPlace();
  // If the place has a geometry, then present it on a map.
  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
    map.setZoom(9);
  } else {
    map.setCenter(place.geometry.location);
    map.setZoom(17);
  }
  performSearch();
  });

}


$(document).ready(function() {
  initialize();

});
