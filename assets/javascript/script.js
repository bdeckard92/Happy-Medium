var config = {
    apiKey: "AIzaSyArprwD6qM4Z6qf8LkXaO-qBTwCwiVJSz8",
    authDomain: "happy-medium-152501.firebaseapp.com",
    databaseURL: "https://happy-medium-152501.firebaseio.com",
    storageBucket: "happy-medium-152501.appspot.com",
    messagingSenderId: "37679856259"
};
firebase.initializeApp(config);
var database = firebase.database();

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
var user_ref;
var avgLat = 0;
var avgLng = 0;
var directionsService;
var directionsDisplay;

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
    //var roomArray = new Array;
    database.ref().on("child_added", function(snapshot) {
        if(typeof snapshot.val().created_by === 'string' && snapshot.val() !== null) {
            if(rooms <= 0) $('#ul_join_room').html('');
            $('#ul_join_room').append('<li><a onclick="initiate_join(\'' + snapshot.val().created_by + '\',\'' + snapshot.val().date + '\',\'' + snapshot.val().reference + '\')">' + snapshot.val().created_by + ' (' + snapshot.val().date + ')</a></li>');
            //roomArray[rooms] = '<li><a onclick="initiate_join(\'' + snapshot.val().created_by + '\',\'' + snapshot.val().date + '\',\'' + snapshot.val().reference + '\')">' + snapshot.val().created_by + ' (' + snapshot.val().date + ')</a></li>';
            rooms++;
        }
    });

    /*for(var i=roomArray.length-1;i<=0;i--) {
        $('#ul_join_room').append(roomArray[i]);
    }*/
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

    $('#ul_join_room').click(function() {
        var n = $('#ul_join_room').height();
        $('#ul_join_room').animate({ scrollTop: n }, 50);
    })
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

    avgLat = 0;
    avgLng = 0;
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
            radius: 500,
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

    var c = 0;
    for (var i = 0, place; place = places[i]; i++) {
        if(typeof place.geometry.viewport.f.b != 'undefined' && typeof place.geometry.viewport.b.b != 'undefined') {
            if(c >= 6) break;
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

            $('#meeting_places').append('<li><a class="places" title="' + place.vicinity + '" onclick="calcRoute(' + place.geometry.viewport.f.b + ',' + place.geometry.viewport.b.b + ')">' + place.name + '</a></li>');

            bounds.extend(place.geometry.location);
            c++;
        }
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

function calcRoute(la,lo) {
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(null);
    directionsDisplay.setDirections(null);
    var request = {
        origin: new google.maps.LatLng(mapArray[user_ref-1][1], mapArray[user_ref-1][2]),
        destination: new google.maps.LatLng(la, lo),
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
    //console.log(directionsDisplay);
    directionsDisplay.setMap(newMap);
}

function initiate() {
    $('#create_room').addClass("disabled");
    $('#join_room').addClass("disabled");

    room_timestamp = Date.now();
    room_reference = room_timestamp;
    $(document).ready(function() {
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
                user_ref = 1;

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

                mapOptions = {
                    center: new google.maps.LatLng(pos.lat, pos.lng),
                    zoom: 12,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                newMap = new google.maps.Map(document.getElementById('mapArea'), mapOptions);
            });
        } // end of myMap function

        myMap();

        setInterval(function(){
            if(interval < 5) {
                updateMarkers();
                interval++;
            }
        }, 2000);
    }); // end of document ready
}


function initiate_join(name,date,reference) {
    $('#create_room').addClass("disabled");
    $('#join_room').addClass("disabled");

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
                user_ref = count_users;

                //console.log(count_users);
                database.ref("/room_" + reference + "/users/user_"+count_users).set({
                    refer: count_users,
                    id: email,
                    lat: pos.lat,
                    lng: pos.lng
                });

                mapOptions = {
                    center: new google.maps.LatLng(pos.lat, pos.lng),
                    zoom: 12,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                newMap = new google.maps.Map(document.getElementById('mapArea'), mapOptions);
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
