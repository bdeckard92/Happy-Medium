$(document).ready(function() {

    $('#topdropdown').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });
    var config = {
        apiKey: "AIzaSyAFIjT_UyFOjm-JaoZNPDj1PQ7jkuvWVEo",
        authDomain: "happymedium-e5e46.firebaseapp.com",
        databaseURL: "https://happymedium-e5e46.firebaseio.com",
        storageBucket: "happymedium-e5e46.appspot.com",
        messagingSenderId: "620164528731"
    };
    firebase.initializeApp(config);

    // googmaps api key AIzaSyBQATEiEDSZipTwdCzAE3oHxn6GwQKR5gQ
    function myMap() {
        var mapCanvas = $("#mapArea");
        var mapOptions = {
            center: new google.maps.LatLng(30.2746652, -97.742191),
            zoom: 15,
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
            content: 'BC Testing!'
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
                newMap.setZoom(17);
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





    $(document).on("click", "#submitButton", function() {
        var address1 = $("#topSearch").val();
        console.log(address1);

        // empty input box after submit is clicked
        $("#topSearch").val("");
    });





}); // end of document ready
