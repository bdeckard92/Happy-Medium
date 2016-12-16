$(document).ready(function() {

    $('#topdropdown').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });
    var config = {
    apiKey: "AIzaSyArprwD6qM4Z6qf8LkXaO-qBTwCwiVJSz8",
    authDomain: "happy-medium-152501.firebaseapp.com",
    databaseURL: "https://happy-medium-152501.firebaseio.com",
    storageBucket: "happy-medium-152501.appspot.com",
    messagingSenderId: "37679856259"
  };
    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    // --------------------------------------------------------------
    // Link to Firebase Database for viewer tracking
    // database reference for us
    var connectionsRef = database.ref("/connections");
    // database reference for everyone
    var connectedRef = database.ref(".info/connected");

    // Add ourselves to presence list when online.
    connectedRef.on("value", function(snap){
      if(snap.val()){
        var con = connectionsRef.push(true);
        con.onDisconnect().remove();
      }

    });

    // Number of online users is the number of objects in the presence list.
    connectionsRef.on("value", function(snap){
      $("#connected-viewers").html(snap.numChildren());
    });






    // googmaps api key AIzaSyBQATEiEDSZipTwdCzAE3oHxn6GwQKR5gQ
    function myMap() {
        var mapCanvas = $("#mapArea");
        var mapOptions = {
            center: new google.maps.LatLng(30.2746652, -97.742191),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var acOptions = {
            types: ['establishment']
        };
        var newMap = new google.maps.Map(document.getElementById('mapArea'), mapOptions);
        //autocomplete area
        var autocomplete = new google.maps.places.Autocomplete(document.getElementById('topSearch'), acOptions);
        // bindTo is to limit the auto-complete to the bounds of the map
        autocomplete.bindTo('bounds', newMap);
        var infoWindowOptions = {
            // content: 'BC Testing!'
        };
        var infoWindow = new google.maps.InfoWindow(infoWindowOptions);


        var markerOptions = {
            position: new google.maps.LatLng(30.274665, -97.74219)
        };
        var marker = new google.maps.Marker(markerOptions);
        marker.setMap(newMap);

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            infoWindow.close();
            var place = autocomplete.getPlace();
            if (place.geometry.viewport) {
                newMap.fitBounds(place.geometry.viewport);
            } else {
                newMap.setCenter(place.geometry.location);
                newMap.setZoom(15);
            }
            marker.setPosition(place.geometry.location);
            infoWindow.setContent('<div><strong>' + place.name + '</strong><br>');
            infoWindow.open(newMap, marker);
            google.maps.event.addListener(marker, 'click', function(e) {

                infoWindow.open(newMap, marker);

            });
        });

    } // end of myMap function

    myMap();


    // < div class = "chip" >
    // Tag <i class = "close material-icons" > close < /i> <
    // /div>


    $(document).on("click", "#submitButton", function() {
        var address1 = $("#topSearch").val().trim();
        console.log(address1);
        var newAddress = $("<li>");
        var newDiv = $("<div>");
        var newIcon = $("<i>");

        newDiv.addClass("chip");
        // adding the "x" next to starting locations
        newIcon.addClass("close material-icons");
        newIcon.text("close");
        newDiv.text(address1);
        newDiv.append(newIcon);
        newAddress.html(newDiv);
        // newAddress.text(address1);

        $("#startingLocationArea").prepend(newAddress);
        // empty input box after submit is clicked
        $("#topSearch").val("");
    });





}); // end of document ready
