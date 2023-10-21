/*
    Keenan Fiedler
    This is the server Javascript file for PA7. It allows the input of the user in the two text boxes appended to a mongodb
    database when the server recieves a psot request. It also allows the previous messages to be sent back to the client
    friom the database.
*/

//basic inclusion of packages
const express = require('express');
const mongoose = require('mongoose');
const readline = require('readline');
const fs = require("fs");
const parser = require('body-parser');

//DB stuff
const db = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/chatty';
mongoose.connect(mongoDBURL, {useNewURLParser: true});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Setting up schema
var Schema = mongoose.Schema;
var ChatMessageSchema = new Schema({
  time: Number,
  alias: String,
  message: String
});
var ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema );

//starts server and listens for requests
//only takes URLS matching /translate/TYPE/CONTENT
const app = express();
app.use(parser.json());
const port = 80;
app.use(express.static('public_html'));
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
//processes get requests to the server, complies previous messages from the data base into a string
app.get('/chats', async function(req,res){
    let messages = ChatMessage.find({}).exec();
    var buffer = "";
    messages.then((messages) => {
        for(var i = 0; i < messages.length; i++){
            buffer = buffer + messages[i].alias + messages[i].message + "<br>";
        }
        res.end(buffer);
    });
});
//processes post requests, gets the time, alias, and message and saves them to a new file in the database
app.post('/chats/post', async function(req,res){
    let alias = req.body.alias;
    let message = req.body.message;
    let time = req.body.time;
    var send = new ChatMessage({time: time, alias: alias, message: message});
    let p = send.save();
    p.then(() => {
        console.log("Saved Message!")
    });
    p.catch((error) => {
        console.log('Save failed');
        console.log(error);
    });
    res.end();
});