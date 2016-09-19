var map;
var service;
var infoWindow = null;


// ___________________INITIALIZE___________________
function initialize(location) {
  console.log("initialize function");
  // Array that holds campgrounds requested in handleSearchResults
  var campgrounds = [];

  var mapOptions = {
    center: new google.maps.LatLng(37.09024, -100.712891),
    zoom: 4,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_LEFT
}
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
  function handleSearchResults(results, status, pagination){
    var place;
    console.log(results);
    for (var i = 0; i < results.length; i ++){
      place = results[i];
      // Create filter to get better results
      var filterResults = place.rating && place.name.toLowerCase().indexOf('rv') === -1 && place.name.toLowerCase().indexOf('camp' || 'site') > -1;
      if (filterResults){
        console.log(place.name);
        //push to campgrounds array
        campgrounds.push(place);
      }
    }
    //check if more results exist in PLACES request
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      return;
    }else{
        renderCampgrounds(campgrounds);
        if (pagination.hasNextPage) {
          pagination.nextPage();
          }
      }
  }

  function renderCampgrounds(campgrounds){
    campgrounds.forEach(function(arrayItem){
      photo = arrayItem.photos && arrayItem.photos[0] && arrayItem.photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200});
      photo_url = photo ? '<img src="' + photo + '"/><br/>' : '';

      marker = new google.maps.Marker({
          position: arrayItem.geometry.location, //change lat and lon
          map: map,
          info: "<div id='iw-container'> <div class ='iw-title'>" +
          arrayItem.name + "</div>" + photo_url +  "<br/>Camground rating: " + arrayItem.rating + "/5 </div>"
      });
      google.maps.event.addListener(marker, "click", function(){
        infoWindow.setContent(this.info);
        infoWindow.open(map, this);
      });

    });
    console.log(campgrounds);

  }


  //function to check nearby places
  function performSearch(){
    zoomLevel = map.getZoom();
    console.log(zoomLevel);
    if (zoomLevel <= 6) {
      alert("Zoom in further into a region or type in location in search box");
      // var alertBox = document.getElementsByClassName('zoomCheck');
      // document.getElementsByClassName('mapContainer').appendChild(alertBox);
      }
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
  $('#refreshBtn').click(performSearch);


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
  $("#questionMark").hover(function(){
    document.getElementById("infoText").style.display = "block";
  }, function(){
    document.getElementById("infoText").style.display = "none";
  });
  $("#refreshBtn").hover(function(){
    document.getElementById("refreshBtn").style.background = "whitesmoke";
  }, function(){
    document.getElementById("refreshBtn").style.background = "white";
  }
);
});
