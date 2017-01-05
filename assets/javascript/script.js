var config = {
    apiKey: "AIzaSyArprwD6qM4Z6qf8LkXaO-qBTwCwiVJSz8",
    authDomain: "happy-medium-152501.firebaseapp.com",
    databaseURL: "https://happy-medium-152501.firebaseio.com",
    storageBucket: "happy-medium-152501.appspot.com",
    messagingSenderId: "37679856259"
};
firebase.initializeApp(config);
var database = firebase.database();

/*$(document).ready(function() {
    $('#join_room').hover(function() {
        $('#ul_join_room').show();
    });

    $('#ul_join_room').on("mouseout", function() {
        $('#ul_join_room').hide();
    });
});*/

$('.g-signin2').trigger();
var profile = '';
var name = null;
var email = null;
var room = false;
var room_timestamp;
var room_reference;
var count = 1;
var xloc = null;
var mapArray = new Array;
var pos;
var newMap;
var mapOptions;
var service;
var bounds;
var bounds_markes = new Array;

var marker_first = 0;
var interval = 0;

function onSignIn(googleUser) {
    profile = googleUser.getBasicProfile();
    name = profile.getName();
    //console.log('Image URL: ' + profile.getImageUrl());
    email = profile.getEmail();
    //initiiate();
    $('.g-signin2').hide();
    $('#hello').html("Hello <strong>" + name + "</strong>, start or join a room to begin.");
    room = true;

    $('#create_room').removeClass("disabled");
    $('#join_room').removeClass("disabled");
    $('#sign_out').removeClass("disabled");

    filljoinroom();
}

function filljoinroom() {
    var rooms = 0;
    database.ref().on("child_added", function(snapshot) {
        if(typeof snapshot.val().created_by === 'string' && snapshot.val() !== null) {
            if(rooms <= 0) $('#ul_join_room').html('');
            //console.log(snapshot.val().created_by + ' (' + snapshot.val().date + ')');
            //$('#ul_join_room').append('<li><a class="room_ref" data-name="' + snapshot.val().created_by + '" data-date="' + snapshot.val().date + '">' + snapshot.val().created_by + ' (' + snapshot.val().date + ')</a></li>');
            $('#ul_join_room').append('<li><a onclick="initiate_join(\'' + snapshot.val().created_by + '\',\'' + snapshot.val().date + '\',\'' + snapshot.val().reference + '\')">' + snapshot.val().created_by + ' (' + snapshot.val().date + ')</a></li>');
            rooms++;
        }
    });
}

/*var room_creator;
var room_date;
var room_reference;
function filljoinroom_click(name,date,reference) {
    room_creator = name;
    room_date = date;
    room_reference = reference;
    initiate_join();
}*/

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
        if(room) {
            $('#content').show();
            initiate();
            //console.log(Date.now());
            room = false;
        }
    });

    $('#happy_msg').keypress(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13' && $('#happy_msg').val() != ''){
            database.ref("/room_" + room_reference + "/chat").push({
                id: email,
                time: moment().get('hour') + ':' + moment().get('minute') + ':' + moment().get('second'),
                msg: $('#happy_msg').val()
            });
            $('#happy_msg').val('');
        }
    });

    /*database.ref("/room_" + room_reference + "/chat").on("value", function(snapshot) {
        if(snapshot.val() !== null) {
            updateChat();
        }
    });*/

    //function updateChat() {
        /*database.ref("/room_" + room_reference + "/chat").on("child_added", function(snapshot) {
            console.log('okok');
            var color_class;
            if(snapshot.val().id == email) color_class = "msg_id_owner";
            else color_class = "msg_id";
            $('#happy_chat').append('<div class="msg"><span class="' + color_class + '">' + snapshot.val().id + '</span><br><span class="msg_msg"><a title="' + snapshot.val().time + '">' + snapshot.val().msg + '</a></span></div>');
        });*/
    //}
});

function addMarker(lat,lng,id,index) {
    var drag = false;
    if(id === email) {
        drag = true;
    }
    markerOptions = {
        position: new google.maps.LatLng(lat,lng),
        draggable: drag,
        label: count+''
    };

    //console.log(lat + ',' + lng + ' - ' + count + ' - ' + id);
    marker = new google.maps.Marker(markerOptions);
    mapArray[count-1] = new Array(count, lat, lng, marker);

    $('#list_users').append('<li><strong>' + count + '</strong>: ' + id + '</li>');

    count++;
    marker.setMap(newMap);

    if(id === email) {
        google.maps.event.addListener(marker, 'dragend', function (event) {
            userChangePosition(this.label,this.getPosition().lat(),this.getPosition().lng(),this);
        });
    }

    getMedium();
}

function userChangePosition(c, la, lo, marker) {
    mapArray[parseInt(c)-1] = new Array(parseInt(c), la, lo, marker);
    //console.log(mapArray[parseInt(c)-1]);
    database.ref("/room_" + room_reference + "/users").on("child_added", function(snapshot) {
        if(email === snapshot.val().id) {
            snapshot.ref.update({
                lat: la,
                lng: lo
            });
        }
    });
    /*database.ref("/room_" + room_reference + "/users/user_" + c).set({
        id: email,
        lat: la,
        lng: lo,
        refer: c
    });*/
    getMedium();
}

function getMedium() {
    if(xloc !== null) {
        xloc.setMap(null);
    }

    var avgLat = 0;
    var avgLng = 0;
    var j = 0;

    for(var i=0;i<mapArray.length;i++) {
        avgLat = (avgLat + mapArray[i][1]);
        avgLng = (avgLng + mapArray[i][2]);
        j++;
    }

    avgLat = avgLat / j;
    avgLng = avgLng / j;

    var markerOptions2 = {
        position: new google.maps.LatLng(avgLat,avgLng),
    };
    var marker2 = new google.maps.Marker(markerOptions2);
    //marker2.setAnimation(google.maps.Animation.BOUNCE);
    marker2.setMap(newMap);

    xloc = marker2;

    if(count > 2) {
        service = new google.maps.places.PlacesService(newMap);
        service.nearbySearch({
            location: new google.maps.LatLng(avgLat,avgLng),
            radius: 300,
            types: ['cafe','restaurant']
        }, processResults);
    }
}

function processResults(results, status) {
    if(status == google.maps.places.PlacesServiceStatus.OK) {
        createMarkers(results);
    }
}

function createMarkers(places) {
    for (var i = 0; i < bounds_markes.length; i++) {
        bounds_markes[i].setMap(null);
    }

    $('#meeting_places').html('');
    bounds = new google.maps.LatLngBounds();

    for (var i = 0, place; place = places[i]; i++) {
        if(i >= 6) break;
        var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        var marker = new google.maps.Marker({
            map: newMap,
            icon: image,
            title: place.name,
            position: place.geometry.location
        });

        bounds_markes.push(marker);

        //console.log(place);

        $('#meeting_places').append('<li><a title="' + place.vicinity + '">' + place.name + '</a></li>');

        bounds.extend(place.geometry.location);
    }
    //newMap.fitBounds(bounds);
}

function updateMarkers() {
    for(var i=0;i<mapArray.length;i++) {
        mapArray[i][3].setMap(null);
    }

    mapArray = [];
    $('#list_users').html('');
    count = 1;
    database.ref("/room_" + room_reference + "/users").on("child_added", function(snapshot) {
        addMarker(snapshot.val().lat,snapshot.val().lng,snapshot.val().id,false);
    });
}

function initiate() {
    room_timestamp = Date.now();
    room_reference = room_timestamp;
    $(document).ready(function() {
        /*$('#topdropdown').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: false, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        });*/

        var same_user = '';
        database.ref("/room_" + room_reference + "/chat").on("child_added", function(snapshot) {
            var color_class;

            if(same_user === snapshot.val().id) {
                $('#happy_chat').append('<div class="msg_same"><span class="msg_msg"><a title="' + snapshot.val().time + '">' + snapshot.val().msg + '</a></span></div>');
            } else {
                if(snapshot.val().id == email) color_class = "msg_id_owner";
                else color_class = "msg_id";
                $('#happy_chat').append('<div class="msg"><span class="' + color_class + '">' + snapshot.val().id + '</span><br><span class="msg_msg"><a title="' + snapshot.val().time + '">' + snapshot.val().msg + '</a></span></div>');
            }

            same_user = snapshot.val().id;
            var n = $('#happy_chat').height();
            $('#happy_chat').animate({ scrollTop: n }, 50);
        });

        database.ref("/room_" + room_timestamp + "/users").on("child_added", function(snapshot) {
            addMarker(snapshot.val().lat,snapshot.val().lng,snapshot.val().id,false);
        });

        database.ref("/room_" + room_timestamp + "/users").on("value", function(snapshot) {
            if(snapshot.val() !== null) {
                //console.log(snapshot.val().refer + " - " + snapshot.val().lat + " - " + snapshot.val().lng + " - " + snapshot.val().id);
                updateMarkers();
            }
        });

        // googmaps api key AIzaSyBQATEiEDSZipTwdCzAE3oHxn6GwQKR5gQ
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

                database.ref("/room_" + room_timestamp).set({
                    created_by: name,
                    date: moment().get('month')+1 + '/' + moment().get('date') + '/' + moment().get('year') + ' ' + moment().get('hour') + ':' + moment().get('minute') + ':' + moment().get('second'),
                    reference: room_timestamp,
                    chat: {},
                    users: {
                        user_1: {
                            refer: 1,
                            id: email,
                            lat: pos.lat,
                            lng: pos.lng
                        }
                    }
                });

                //console.log(pos.lat + ", " + pos.lng);
                /*database.ref("/locations_map").push({
                    lat: pos.lat+0.06,
                    lng: pos.lng+0.07,
                });
                database.ref("/locations_map").push({
                    lat: pos.lat+0.023,
                    lng: pos.lng+0.093,
                });*/

                //var mapCanvas = $("#mapArea");
                mapOptions = {
                    center: new google.maps.LatLng(pos.lat, pos.lng),
                    zoom: 12,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                /*var acOptions = {
                    types: ['establishment']
                };*/
                newMap = new google.maps.Map(document.getElementById('mapArea'), mapOptions);
                //autocomplete area
                //var autocomplete = new google.maps.places.Autocomplete(document.getElementById('topSearch'), acOptions);
                // bindTo is to limit the auto-complete to the bounds of the map
                //autocomplete.bindTo('bounds', newMap);

                //addMarker(pos.lat,pos.lng,email,false);

                /*google.maps.event.addListener(autocomplete, 'place_changed', function() {
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
                });*/
            });
        } // end of myMap function

        myMap();

        setInterval(function(){
            if(interval < 5) {
                updateMarkers();
                interval++;
            }
        }, 2000);
        /*$(document).on("click", "#submitButton", function() {
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
        });*/

    }); // end of document ready
}


function initiate_join(name,date,reference) {
    $('#content').show();
    room_reference = reference;

    var same_user = '';
    database.ref("/room_" + room_reference + "/chat").on("child_added", function(snapshot) {
        var color_class;

        if(same_user === snapshot.val().id) {
            $('#happy_chat').append('<div class="msg_same"><span class="msg_msg"><a title="' + snapshot.val().time + '">' + snapshot.val().msg + '</a></span></div>');
        } else {
            if(snapshot.val().id == email) color_class = "msg_id_owner";
            else color_class = "msg_id";
            $('#happy_chat').append('<div class="msg"><span class="' + color_class + '">' + snapshot.val().id + '</span><br><span class="msg_msg"><a title="' + snapshot.val().time + '">' + snapshot.val().msg + '</a></span></div>');
        }

        same_user = snapshot.val().id;
        var n = $('#happy_chat').height();
        $('#happy_chat').animate({ scrollTop: n }, 50);
    });

    database.ref("/room_" + room_reference + "/users").on("child_added", function(snapshot) {
        addMarker(snapshot.val().lat,snapshot.val().lng,snapshot.val().id,false);
    });

    database.ref("/room_" + room_reference + "/users").on("value", function(snapshot) {
        if(snapshot.val() !== null) {
            //console.log(snapshot.val().refer + " - " + snapshot.val().lat + " - " + snapshot.val().lng + " - " + snapshot.val().id);
            updateMarkers();
        }
    });

    var count_users = 1;
    database.ref("/room_" + reference + '/users').on("child_added", function(snapshot) {
        count_users++;
    });

    $(document).ready(function() {
        /*$('#topdropdown').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: false, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        });*/

        function myMap1() {
            var infoWindowOptions = {
                // content: 'BC Testing!'
            };
            var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
            navigator.geolocation.getCurrentPosition(function(position) {
                pos = {
                    lat: position.coords.latitude + (count_users / 100),
                    lng: position.coords.longitude + (count_users / 100)
                    /*lat: 30.377068600000003 ,
                    lng: -97.69365609999999*/
                };
                infoWindow.setPosition(pos);
                infoWindow.setContent('You are here.');

                //console.log(count_users);
                database.ref("/room_" + reference + "/users/user_"+count_users).set({
                    refer: count_users,
                    id: email,
                    lat: pos.lat,
                    lng: pos.lng
                });

                //var mapCanvas = $("#mapArea");
                mapOptions = {
                    center: new google.maps.LatLng(pos.lat, pos.lng),
                    zoom: 12,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                /*var acOptions = {
                    types: ['establishment']
                };*/
                newMap = new google.maps.Map(document.getElementById('mapArea'), mapOptions);
                //autocomplete area
                //var autocomplete = new google.maps.places.Autocomplete(document.getElementById('topSearch'), acOptions);
                // bindTo is to limit the auto-complete to the bounds of the map
                //autocomplete.bindTo('bounds', newMap);

                //addMarker(pos.lat,pos.lng,email,false);

                /*google.maps.event.addListener(autocomplete, 'place_changed', function() {
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
                });*/
            });
        } // end of myMap function

        myMap1();

        setInterval(function(){
            if(interval < 5) {
                updateMarkers();
                interval++;
            }
        }, 2000);
    }); // end of document ready
}
