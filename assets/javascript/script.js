$('.g-signin2').trigger();
var profile = '';
var name;
var email;
function onSignIn(googleUser) {
    profile = googleUser.getBasicProfile();
    name = profile.getName();
    //console.log('Image URL: ' + profile.getImageUrl());
    email = profile.getEmail();
    //initiiate();
    $('.g-signin2').hide();
    $('#hello').html("Hello <strong>" + name + "</strong>, start or join a room to begin.");
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    name = null;
    email = null;
    $('#content').hide();
    $('.g-signin2').show();
    window.location = "index.html";
}

$(document).ready(function() {
    $('#create_room').click(function() {
        $('#content').show();
        initiiate();
    });
});

var config = {
    apiKey: "AIzaSyArprwD6qM4Z6qf8LkXaO-qBTwCwiVJSz8",
    authDomain: "happy-medium-152501.firebaseapp.com",
    databaseURL: "https://happy-medium-152501.firebaseio.com",
    storageBucket: "happy-medium-152501.appspot.com",
    messagingSenderId: "37679856259"
};
firebase.initializeApp(config);

function initiiate() {
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

            addMarker(pos.lat,pos.lng);

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
            draggable:true,
            label: count+''
        };
        //var c = count;
        mapArray[count-1] = new Array(count, lat, lng);
        //console.log(lat + ',' + lng + ' - ' + count);
        count++;
        marker = new google.maps.Marker(markerOptions);
        marker.setMap(newMap);

        google.maps.event.addListener(marker, 'dragend', function (event) {
            //console.log(this.getPosition().lat() + ',' + this.getPosition().lng());
            userChangePosition(this.label,this.getPosition().lat(),this.getPosition().lng());
            //getMedium();
        });

        getMedium();
    }

    function userChangePosition(c, la, lo) {
        //console.log(c + ',' + la + ',' + lo);
        mapArray[parseInt(c)-1] = new Array(parseInt(c), la, lo);
        database.ref("/locations_map").on("child_added", function(snapshot) {
            //console.log(typeof c + ',' + typeof snapshot.val().user);
            //console.log(c + ',' + la + ',' + lo);
            if(parseInt(c)+1 === snapshot.val().user) {
                snapshot.ref.update({
                    lat: la,
                    lng: lo
                });
            }
        });
        getMedium();
    }

    /*function getDistanceInfo(lat,lng) {
        $.ajax({
            type: "POST",
            //url:'https://maps.googleapis.com/maps/api/place/json?origin=' + poslat + ',' + poslng + '&destination=' + lat + ',' + lng + '&key=AIzaSyBW4fuvgb119VPdeEAb61U3KFHVTXkdQvE',
            url:'https://maps.googleapis.com/maps/api/place/radarsearch/json?location=' + lat + ',' + lng + '&radius=500&type=restaurants&key=AIzaSyBW4fuvgb119VPdeEAb61U3KFHVTXkdQvE',
            success: function(text){
                console.log(text);
            }
        });
    }*/

    database.ref("/locations_map").on("child_added", function(snapshot) {
        addMarker(snapshot.val().lat,snapshot.val().lng);
        //console.log(snapshot.val());
    });

    database.ref("/locations_map").on("value", function(snapshot) {
        getMedium();
    });

    function getMedium() {
        if(xloc != null) {
            xloc.setMap(null);
        }
        var avgLat = 0;
        var avgLng = 0;
        var j = 0;

        for(var i=0;i<mapArray.length;i++) {
        //for (var i in mapArray) {
            avgLat = (avgLat + mapArray[i][1]);
            avgLng = (avgLng + mapArray[i][2]);
            //console.log(i);
            j++;
        }
        avgLat = avgLat / j;
        avgLng = avgLng / j;
        //console.log(avgLat + ',' + avgLng + ' - X');
        //addMarker(avgLat,avgLng);

        var markerOptions2 = {
            position: new google.maps.LatLng(avgLat,avgLng),
            //label: 'X'
        };
        var marker2 = new google.maps.Marker(markerOptions2);
        marker2.setAnimation(google.maps.Animation.BOUNCE);
        marker2.setMap(newMap);
        //marker2.metadata = { id: markerId };
        xloc = marker2;

        //getDistanceInfo(avgLat,avgLng);
    }

    /*setTimeout(function(){
        database.ref("/locations_map").push({
            lat: 30.3151369,
            lng: -97.3840504,
        });
    }, 5000);*/

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
}
