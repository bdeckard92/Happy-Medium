var count = 1;
var mapArray = new Array;
var xloc = null;
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
            /*database.ref("/locations_map").push({
                lat: pos.lat+0.06,
                lng: pos.lng+0.07,
            });

            database.ref("/locations_map").push({
                lat: pos.lat+0.023,
                lng: pos.lng+0.093,
            });

            database.ref("/locations_map").push({
                lat: 30.355136899999997,
                lng: -97.26405040000001,
            });*/

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

            /*var markerOptions = {
                position: new google.maps.LatLng(pos.lat, pos.lng),
                label: count+''
            };
            mapArray[count-1] = new Array(pos.lat, pos.lng);
            count++;
            var marker = new google.maps.Marker(markerOptions);
            marker.setMap(newMap);*/
            addMarker(pos.lat,pos.lng);

            /*markerOptions = {
                position: new google.maps.LatLng(pos.lat+0.06, pos.lng+0.07),
                label: "C"
            };
            marker = new google.maps.Marker(markerOptions);
            marker.setMap(newMap);*/

            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                infoWindow.close();
                var place = autocomplete.getPlace();
                //console.log(place);
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
            label: count+''
        };
        mapArray[count-1] = new Array(lat, lng);
        console.log(lat + ',' + lng);
        count++;
        marker = new google.maps.Marker(markerOptions);
        marker.setMap(newMap);
        //getMedium();
        //getDistanceInfo(pos.lat,pos.lng,lat,lng);
    }

    function getDistanceInfo(poslat,poslng,lat,lng) {
        $.ajax({
            type: "POST",
            url:'https://maps.googleapis.com/maps/api/directions/json?origin=' + poslat + ',' + poslng + '&destination=' + lat + ',' + lng + '&key=AIzaSyArprwD6qM4Z6qf8LkXaO-qBTwCwiVJSz8',
            /*data: 'origin=' + poslat + ',' + poslng
                    + '&destination=' + lat + ',' + lng
                    + '&key=AIzaSyBW4fuvgb119VPdeEAb61U3KFHVTXkdQvE',*/
            success: function(text){
                console.log(text);
            }
        });
    }
    // < div class = "chip" >
    // Tag <i class = "close material-icons" > close < /i> <
    // /div>

    setTimeout(function(){
        database.ref("/locations_map").on("child_added", function(snapshot) {
            //console.log(typeof snapshot.val().lat);
            //if (snapshot.child().exists()) {
                addMarker(snapshot.val().lat,snapshot.val().lng);
            //}
        });
    }, 100);

    function getMedium() {
        if(xloc != null) {
            xloc.setMap(null);
        }
        var avgLat = 0;
        var avgLng = 0;
        var j = 0;

        for(var i=0;i<mapArray.length;i++) {
        //for (var i in mapArray) {
            avgLat = (avgLat + mapArray[i][0]);
            avgLng = (avgLng + mapArray[i][1]);
            //console.log(i);
            j++;
        }
        avgLat = avgLat / j;
        avgLng = avgLng / j;
        console.log(avgLat + ',' + avgLng);
        //addMarker(avgLat,avgLng);

        var markerOptions2 = {
            position: new google.maps.LatLng(avgLat,avgLng),
            label: 'X'
        };
        var marker2 = new google.maps.Marker(markerOptions2);
        marker2.setMap(newMap);
        marker2.metadata = { id: markerId };
        xloc = marker2;
    }

    setTimeout(function(){
        getMedium();
    }, 500);

    setTimeout(function(){
        database.ref("/locations_map").push({
            lat: 30.315136899999998,
            lng: -97.38405040000001,
        });
    }, 5000);

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
