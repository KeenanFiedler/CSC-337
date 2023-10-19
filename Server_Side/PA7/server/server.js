/*
    Keenan Fiedler
    This is the Javascript file for PA6. It allows the input of the user in the URL to be parsed and 
    trasnlated in six different ways between German, Spanish, and English. Each request to the server via
    the functions.js file updates the text in the website to display the requested translation of a sentence. 
    It uses express instead of http, and sends every request a return value to the functions.js file in public_html.
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

var schema = new mongoose.Schema({
    text: String
});
var Message = mongoose.model('Type', schema);

//starts server and listens for requests
//only takes URLS matching /translate/TYPE/CONTENT
const app = express();
app.use(parser.json());
const port = 80;
app.use(express.static('public_html'));
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
app.get('/update', function(req,res){
    let messages = Message.find({}).exec();
    messages.then((messages) => {
        
    });
});
app.post('/message', function(req,res){
    let input = req.body.message;
    console.log(input);
    var send = new Message({text: input});
    let p = send.save();
    p.then(() => {
        console.log("Saved Message!")
    });
    p.catch((error) => {
        console.log('Save failed');
        console.log(error);
    });
});