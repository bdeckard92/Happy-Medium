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

    var database = firebase.database();

    // googmaps api key AIzaSyBQATEiEDSZipTwdCzAE3oHxn6GwQKR5gQ
    var pos;
    var newMap;
    var mapOptions;
    function myMap() {
        var infoWindowOptions = {
            // content: 'BC Testing!'
        };
        var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here.');

            //console.log(pos.lat + ", " + pos.lng);
            database.ref("/locations").set({
                lat: pos.lat+.06,
                lng: pos.lng+.07,
            });

            var mapCanvas = $("#mapArea");
            mapOptions = {
                center: new google.maps.LatLng(pos.lat, pos.lng),
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var acOptions = {
                types: ['establishment']
            };
            newMap = new google.maps.Map(document.getElementById('mapArea'), mapOptions);
            //autocomplete area
            var autocomplete = new google.maps.places.Autocomplete(document.getElementById('topSearch'), acOptions);
            // bindTo is to limit the auto-complete to the bounds of the map
            autocomplete.bindTo('bounds', newMap);

            var markerOptions = {
                position: new google.maps.LatLng(pos.lat, pos.lng),
                label: "A"
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
        });
    } // end of myMap function

    myMap();

    function addMarker(lat,lng) {
        markerOptions = {
            position: new google.maps.LatLng(lat,lng),
            label: "B"
        };
        marker = new google.maps.Marker(markerOptions);
        marker.setMap(newMap);
    }
    // < div class = "chip" >
    // Tag <i class = "close material-icons" > close < /i> <
    // /div>

    database.ref().on("child_added", function(snapshot) {
        if (snapshot.child("locations").exists()) {
            addMarker(parseFloat(snapshot.val().lat),parseFloat(snapshot.val().lng));
        }
    });

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
