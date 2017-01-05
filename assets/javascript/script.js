$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyANgKTSXNrxtZrAyHCvXxo0EjIA7DZ09c8",
        authDomain: "happy-medium-rob.firebaseapp.com",
        databaseURL: "https://happy-medium-rob.firebaseio.com",
        storageBucket: "happy-medium-rob.appspot.com",
        messagingSenderId: "577408532184"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    (function () { //init html, db
        var txt = {
            eng: {
                input: {
                    header: "Type of Location: ",
                    name: "locationOption",
                    options: ['Coffee Shop', "Restaurant", "Park"],
                    btn: "Vote"
                }
            }
        };

        //init db
        database.ref().child("votes").once("value", function (snapshot) {
            var votes_exist = snapshot.val(); //check if votes object exists
            if (!votes_exist) { //if not, initialize votes = 0 for each option
                for (i = 0; i < txt.eng.input.options.length; i++) {
                    database.ref("votes/" + txt.eng.input.options[i]).set(0);
                };
            };
        });

        //build html
        var form_id = "form_" + txt.eng.input.name;
        var input_name = "input_vote_" + txt.eng.input.name;

        $("#locationOptions").html("<form id='" + form_id + "'></form>");
        for (i = 0; i < txt.eng.input.options.length; i++) {
            $("form[id='" + form_id + "']").append("<input id='input_vote_" + i + "' type='radio' name='" + txt.eng.input.name + "' value='" + txt.eng.input.options[i] + "'>" + txt.eng.input.options[i] + "</input>");
        };
        $("form[id='" + form_id + "']").append("<button id='voteButton' type='button' class='waves-effect waves-light btn'>Vote</button>");
        $("#voteButton").attr('disabled', true); //disable button init

    })(); //run once

    //get updating values of vote tally
    // ...
    // ...

    $("input[name='locationOption']").click(function () {
        if ($("#voteButton").attr('disabled', true)) {
            $("#voteButton").attr('disabled', false); //enable vote button 
        };
    });

    $("#voteButton").click(function () {
        if ($("input[name='locationOption']").is(":checked")) {
            var val = $("input:radio[name=locationOption]:checked").val();
            //var votes = {};
            //console.log("value: " + val + "\n" + "votes: " + votes);
           
            database.ref().child("votes").once("value", function (snapshot) {
                   console.log(snapshot.child.val());
                /*
                var votes_exist = snapshot.val(); //check if votes object exists
                if (!votes_exist) { //if not, initialize votes = 0 for each option
                    for (i = 0; i < txt.eng.input.options.length; i++) {
                        database.ref("votes/" + txt.eng.input.options[i]).set(0);
                    };
                };
                */
            });

            //push to db
            //database.ref("votes/" + val).set();
            $("input:radio[name=locationOption]").attr('disabled', true); //disable radio buttons
            $("#voteButton").html("Voted").attr('disabled', true); //change text of vote button to voted, disable
        };
    });

});