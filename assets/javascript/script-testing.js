var config = {
    apiKey: "AIzaSyDKDvhKE_UZagB6YImenQwTq9m38eZ6akE",
    authDomain: "heatmap-clicks.firebaseapp.com",
    databaseURL: "https://heatmap-clicks.firebaseio.com",
    storageBucket: "heatmap-clicks.appspot.com",
    messagingSenderId: "185527880134"
  };
  firebase.initializeApp(config);


  function myMap() {
    var mapCanvas = document.getElementById("map");
    var mapOptions = {
      center: new google.maps.LatLng(51.5, -0.2),
      zoom: 10
    };
    var map = new google.maps.Map(mapCanvas, mapOptions);
  }
