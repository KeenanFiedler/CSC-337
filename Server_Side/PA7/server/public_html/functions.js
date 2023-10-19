/*
    Keenan Fiedler
    This is the client-side Javascript file for PA6. It allows the users text entered in the left side to be translated to text on the right side.
    This is based on their choice in the two drop down boxes, with six different translation modes. 
    It sends a request to the server for the actual translation using promises.
*/

//This function gets the translation of the text in the left from the server and displays it on the right
//It has no parameters.
function sendMessage(person){
    //include <b> tags and colon around alias in the message
    let inputs = document.getElementsByClassName("inputItems" + String(person));
    let send = {message: "<b>" + inputs[0].value + ":</b> " + inputs[1].value};
    let p = fetch("http://localhost:80/message", {
        method: 'POST',
        body: JSON.stringify(send),
        headers: { 'Content-Type': 'application/json'}
    });
    p.catch((error) => {
        console.log(error);
    });
    console.log("Sent");
}


//This function refreshes the messages on the screen every second
//It has no parameters
function updateMessages(){
    let textAreas = document.getElementsByClassName("chat");
    var messages = "";
    fetch("http://localhost:80/update").then((response) => {return response.text();}).then((text) =>{messages = text});
    for(let i = 0; i < textAreas.length; i++){
        textAreas[i].innerHTML = messages;
    }
    console.log("Updated");
}

var get = setInterval(updateMessages(), 1000);