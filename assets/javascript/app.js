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
  var timeNow = moment().format("ddd mmm Do, HH:mm:ss");

function displayTime() {
    timeNow = moment().format("ddd MMM Do, HH:mm:ss");
    $(".lead").text(timeNow);
}

function timeGet(firstTime, firstFrequency) {
    var currentTime = moment();
    //console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));
    var convertedTrainStart = moment(firstTime, "HH:mm").subtract(1, "years");
    //console.log(convertedTrainStart);
    var differenceInTime = currentTime.diff(moment(convertedTrainStart), "minutes");
    //console.log("DIFFERENCE IN TIME: " + differenceInTime);
    var trainTimeRemainder = differenceInTime % firstFrequency;
    //console.log("Remainder: " + trainTimeRemainder);
    var minutesUntilArrival = firstFrequency - trainTimeRemainder;
    //console.log("MINUTES TILL TRAIN: " + minutesUntilArrival);
    var nextTrainTime = moment().add(minutesUntilArrival, "minutes");
    var nextTrainConverted = moment(nextTrainTime).format("hh:mm a")     // remove seconds before submit
    //console.log("ARRIVAL TIME: " + nextTrainConverted);
    var trainArrivalData = [minutesUntilArrival, nextTrainConverted];

    return trainArrivalData;
}

function updateTrains() {
    var trainId;
    $("#train-data").empty();
    database.ref("/TrainData").on("child_added", function(snapshot) {  // listening for event child_added
        var newTrain = snapshot.val().Name;
        var newDestination = snapshot.val().Destination;
        var newStart = snapshot.val().Start;
        var newFrequency = snapshot.val().Frequency;
        var trainComes =  timeGet(newStart, newFrequency);
        var minutesAway = trainComes[0];
        var nextArrival = trainComes[1];
        var newTrainRow = "";
        trainId = snapshot.key;

        newTrainRow += "<tr>"
        newTrainRow += "<th scope='row'>" + newTrain + "</th>";
        newTrainRow += "<td>" + newDestination + "</td>";
        newTrainRow += "<td>" + newFrequency + "</td>";
        newTrainRow += "<td>" + nextArrival + "</td>";
        newTrainRow += "<td>" + minutesAway + "</td>";
        newTrainRow += "<td><button type='button' class='btn btn-primary btn-sm' id='" + trainId +"'>remove</button></td>";
        newTrainRow += "</tr>";

        $("#train-data").append(newTrainRow);
    });
}

function submitTrain(event){
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
    updateTrains();
}

function removeTrain() {
    //console.log("Click");
    var trainKey = $(this).attr("id");
    //console.log(trainKey);
    database.ref("/TrainData").child(trainKey).remove();
    updateTrains();
}

$(document).ready(function() {
    updateTrains();
    setInterval(updateTrains, 1000 * 30);
    setInterval(displayTime, 1000);  

    $("#submit").click(submitTrain);
    $("#train-data").on("click", ".btn", removeTrain);
});
