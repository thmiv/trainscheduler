  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB-Ci5DYbHU7OyeeUrcvQvG7smfX43cZhc",
    authDomain: "project-1-df4f9.firebaseapp.com",
    databaseURL: "https://project-1-df4f9.firebaseio.com",
    projectId: "project-1-df4f9",
    storageBucket: "project-1-df4f9.appspot.com",
    messagingSenderId: "17987574364"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

function timeGet(firstTime, firstFrequency) {
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));
    var convertedTrainStart = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(convertedTrainStart);
    var differenceInTime = currentTime.diff(moment(convertedTrainStart), "minutes");
    console.log("DIFFERENCE IN TIME: " + differenceInTime);
    var trainTimeRemainder = differenceInTime % firstFrequency;
    console.log("Remainder: " + trainTimeRemainder);
    var minutesUntilArrival = firstFrequency - trainTimeRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesUntilArrival);
    var nextTrainTime = moment().add(minutesUntilArrival, "minutes");
    var nextTrainConverted = moment(nextTrainTime).format("hh:mm a")
    console.log("ARRIVAL TIME: " + nextTrainConverted);
    var trainArrivalData = [minutesUntilArrival, nextTrainConverted];

    return trainArrivalData;
}

$(document).ready(function() {

    $("#submit").on("click", function(event){
        event.preventDefault();
        console.log("click click");

        var trainName =  $("#train-name").val().trim();
        var trainDestination = $("#train-destination").val().trim();
        var trainStart = $("#train-start").val().trim();
        var trainFrequency = $("#train-frequency").val().trim();

        database.ref("/TrainData").push({
            Name: trainName,
            Destination: trainDestination,
            Start: trainStart,
            Frequency: trainFrequency,
            Date: firebase.database.ServerValue.TIMESTAMP
        });

    });

    database.ref("/TrainData").on("child_added", function(snapshot) {  // listening for event child_added
        var newTrain = snapshot.val().Name;
        var newDestination = snapshot.val().Destination;
        var newStart = snapshot.val().Start;
        var newFrequency = snapshot.val().Frequency;
        var trainComes =  timeGet(newStart, newFrequency);
        var minutesAway = trainComes[0];
        var nextArrival = trainComes[1];

        $("#train-data").append("<div class='col-md-2'>" + newTrain + "</div>");
        $("#train-data").append("<div class='col-md-2'>" + newDestination + "</div>");
        $("#train-data").append("<div class='col-md-2'>" + newFrequency + "</div>");
        $("#train-data").append("<div class='col-md-2'>" + nextArrival + "</div>");
        $("#train-data").append("<div class='col-md-2'>" + minutesAway + "</div>");
        $("#train-data").append("<div class='col-md-2'><img src='http://via.placeholder.com/40x15' id='remove-button'></div>");
    });

    $("#train-data").on("click", "#remove-button", function() {
        $( ".col-md-2" ).remove();
      });

});
