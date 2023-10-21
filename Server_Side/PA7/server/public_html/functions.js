/*
    Keenan Fiedler
    This is the client-side Javascript file for PA7. It allows the users text entered in the text boxes
    to be send to the server to be save as messages. It also has a function called every second that sets
    the proper area to display all previous messages.
*/

//This function gets the input text in the alias and message boxes, and sends it to he server to be saved
//It has no parameters
function sendMessage(person){
    //include <b> tags and colon around alias in the message
    let inputs = document.getElementsByClassName("inputItems");
    let send = {time: new Date().getTime(), alias: "<b>" + inputs[0].value + ":</b> ", message: inputs[1].value};
    let p = fetch("http://localhost:80/chats/post", {
        method: 'POST',
        body: JSON.stringify(send),
        headers: { 'Content-Type': 'application/json'}
    });
    p.catch((error) => {
        console.log(error);
    });
    console.log("Sent");
    document.getElementById("message").value = "";
}


//This function refreshes the messages on the screen every second
//It has no parameters
function updateMessages(){
    let textArea = document.getElementById("textArea");
    var messages = "";
    fetch("http://localhost:80/chats").then((response) => {return response.text();}).then((text) => {messages = text;}).then(()=>
    {
    textArea.innerHTML = messages;
    })
    .catch((error) => {
        console.log(error);
    });
}

setInterval(updateMessages, 1000);