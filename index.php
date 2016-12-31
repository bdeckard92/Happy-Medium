<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Happy Medium</title>
    <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.8/css/materialize.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7"
        crossorigin="anonymous">
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>
    <nav id="topNav" class="white" role="navigation">
        <div class="nav-wrapper container ">
            <a id="logo-container" href="#" class="brand-logo">Happy Medium</a>
            <ul class="right hide-on-med-and-down">
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
                <!-- <li><a id="topdropdown" class="dropdown-button hide-on-med-and-down" href="#!" data-activates="topdropdown1">Type of Location<i class="material-icons right">arrow_drop_down</i></a>
                    <ul id="topdropdown1" class="dropdown-content">
                        <li><a href="#!">Coffee Shop</a></li>
                        <li class="divider"></li>
                        <li><a href="#!">Restaurant</a></li>
                        <li class="divider"></li>
                        <li><a href="#!">Park</a></li>
                    </ul>
                </li> -->
            </ul>
            <ul id="nav-mobile" class="side-nav" style="transform: translateX(-100%);">
                <li><a style="color: black;" href="#">Navbar Link</a></li>
            </ul>
            <a href="#" data-activates="nav-mobile" class="button-collapse"><i class="material-icons">menu</i></a>
        </div>
    </nav>
    <br>
    <div class="container">
        <div class="row">
            <div class="col s4">
                <input type="text" class="form-control" id="topSearch" placeholder="Address of First Person">
                <button id="submitButton" type="submit" class="waves-effect waves-light btn">Submit<i class="material-icons right">send</i></button>
            </div>
            <div class="col s8" id="locationOptions">
                <!-- Locations -->
                <!--
                <a class="dropdown-button hide-on-med-and-down" href="#!" data-activates="dropdown2">Type of Location<i class="material-icons right">arrow_drop_down</i></a>
                <ul id="dropdown2" class="dropdown-content">
                    <li><a href="#!">Coffee Shop</a></li>
                    <li class="divider"></li>
                    <li><a href="#!">Restaurant</a></li>
                    <li class="divider"></li>
                    <li><a href="#!">Park</a></li>
                </ul>
                -->
            </div>
        </div>
        <div class="row">
            <div class="col s9">
             <!--   <div id="mapArea"></div> -->
            </div>
            <div class="sidebar col s3">
                <div class="card-panel blue-grey lighten-4">
                    <h5>List of Starting Locations</h5>
                    <ul id="startingLocationArea">
                    </ul>
                </div>
            </div>
            <div class="sidebar col s3">
                <div class="card-panel blue-grey lighten-4">
                    <h5>List of Meeting Places Here</h5>
                    <ul>
                        <li>Location 1</li>
                        <li>Location 2</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.1.1.js" integrity="sha256-16cdPddA6VdVInumRGo6IbivbERE8p7CQR3HzTBuELA=" crossorigin="anonymous"></script>
    <!-- <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script> -->
    <script src="https://www.gstatic.com/firebasejs/3.6.4/firebase.js"></script>
    <!-- <script src="https://cdn.firebase.com/libs/angularfire/1.2.0/angularfire.min.js"></script> -->
    <script src="https://cdn.jsdelivr.net/momentjs/2.12.0/moment.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.8/js/materialize.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
        crossorigin="anonymous"></script>
    <!-- <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBQATEiEDSZipTwdCzAE3oHxn6GwQKR5gQ&sensor=false&libraries=places"></script> -->
    <script src="assets/javascript/script.js"></script>
</body>

</html>
<!-- test comment -->
