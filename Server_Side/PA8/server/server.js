/*
    Keenan Fiedler
    This is the server Javascript file for PA9. It allows the input of the user in to register as a user,
    add items, see your listings, search the listings, and see your purchases. It uses cookies and sessions
    to keep track of users.
*/

//basic inclusion of packages
const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const cookieParser = require('cookie-parser');

//DB stuff
const db = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/ostaa';
mongoose.connect(mongoDBURL, {useNewURLParser: true});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var ObjectId = require('mongodb').ObjectId; 


//Setting up schema
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: String,
    password: String,
    listings: Object,
    purchases: Object
});
var user = mongoose.model('UserModel', userSchema );
var itemSchema = new Schema({
    title: String,
    desc: String,
    image: String,
    price: Number,
    status: String
});
var item = mongoose.model('ItemModel', itemSchema );


//sets up a session for new users
let sessions = {};
function addSession(username) {
    let sid = Math.floor(Math.random() * 1000000000);
    let now = Date.now();
    sessions[username] = {id: sid, time: now};
    return sid;
}
//removes old sessions from server memory
function removeSessions() {
    let now = Date.now();
    let usernames = Object.keys(sessions);
    for (let i = 0; i < usernames.length; i++) {
        let last = sessions[usernames[i]].time;
        if (last + 120000 < now) {
            delete sessions[usernames[i]];
        }
    }
    console.log(sessions);
}
setInterval(removeSessions, 2000);

//starts server and listens for requests
//only takes URLS matching /translate/TYPE/CONTENT
const app = express();
app.use(parser.json());
const port = 80;
app.use(cookieParser());  
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

//authenticates a user based on sessions on the server and cookie on browser
function authenticate(req, res, next) {
    let c = req.cookies;
    console.log('auth request:');
    console.log(req.cookies);
    if (c != undefined && c.login != undefined) {
        if (sessions[c.login.username] != undefined && 
            sessions[c.login.username].id == c.login.sessionID) {
            next();
        } else {
            res.redirect('/account/index.html');
        }
    }else {
        res.redirect('/account/index.html');
    }
}
app.use('/app/*', authenticate);
app.use(express.static('public_html'));
app.get('/', (req,res)=> {res.redirect('/account/index.html')});
//checks if the username/password is correct, login if correct
app.post('/login', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let p = user.findOne({username: username, password: password}).exec();
    p.then((results) => { 
        if (results == null) {
            res.end('Could not find account');
        }else {
            let sid = addSession(username);  
            res.cookie("login", 
                {username: username, sessionID: sid}, 
                {maxAge: 120000});
            res.end('SUCCESS');
        }
    });
});
//purchases an item and changes the item to SOLD, and the user purchases list
app.post('/app/purchase', (req,res)=>{
    let c = req.cookies;
    var purchaseList=[];
    let itemPurchaser = user.findOne({username:c.login.username}).exec();
    itemPurchaser.then((itemPurchaser)=>{
        purchaseList = itemPurchaser.purchases;
    }).then(()=>{
        let itemSold = item.findOne({title: req.body.title}).exec();
        itemSold.then((itemSold)=>{
            purchaseList.push(itemSold.id);
            console.log(c.login.username);
            console.log(req.body.title);
            let p = item.updateOne({title: req.body.title}, {$set:{status: 'SOLD'}}).exec();
            p.then(()=>user.updateOne({username: c.login.username}, {$set:{purchases: purchaseList}}).exec()).then(()=>res.end());
        });
    });
});

//gets the username for representation on the homepage
app.get('/get/name', (req,res)=>{
    let uname = req.cookies.login.username;
    res.end(uname);
});


//************ */
//OSTAA PART 1
//************ */
//compiles users from the database into a string
app.get('/get/users', function(req,res){
    let users = user.find({}).exec();
    var buffer = [];
    users.then((users) => {
        for(var i = 0; i < users.length; i++){
            buffer[i] = users[i];
        }
        res.end(buffer);
    });
});
//compiles items from the database into a string
app.get('/get/items', function(req,res){
    let items = item.find({}).exec();
    var buffer = [];
    items.then((items) => {
        for(var i = 0; i < items.length; i++){
            buffer[i] = items[i];
        }
        res.json(buffer);
    });
});
//compiles listings of a user from the database into a string
app.get('/get/listings', function(req,res){
    let c = req.cookies;
    var buffer = [];
    let users = user.find({username:c.login.username}).exec();
    users.then((users)=>{
        if(users != null){
            let list = users[0].listings;
            var itemidlist = [];
            if(list != undefined){
                for(let i = 0; i < list.length; i++){
                    itemidlist[i] = new ObjectId(list[i]);
                }
                let items = item.find({_id: {$in: itemidlist}}).exec();
                items.then((items)=>{
                    for(let i = 0; i<items.length; i++){
                        buffer[i] = items[i];
                    }
                }).then(()=>{
                    res.json(buffer);
                });
            }else{
                res.end();
            }
        }else{
            res.end();
        }
    });
});
//compiles purchases of a user from the database into a string
app.get('/get/purchases', function(req,res){
    let c = req.cookies;
    var buffer = [];
    let users = user.find({username:c.login.username}).exec();
    users.then((users)=>{
        if(users != null){
            let list = users[0].purchases;
            var itemidlist = [];
            console.log(list);
            if(list != undefined){
                for(let i = 0; i < list.length; i++){
                    itemidlist[i] = new ObjectId(list[i]);
                }
                let items = item.find({_id: {$in: itemidlist}}).exec();
                items.then((items)=>{
                    for(let i =0; i<items.length; i++){
                        buffer[i] = items[i];
                    }
                }).then(()=>{
                    res.json(buffer);
                });
            }else{
                res.end();
            }
        }else{
            res.end();
        }   
    });
});
//compiles all users with substring from the database into a string
app.get('/search/users/:KEYWORD', function(req,res){
    regex = new RegExp(".*" + req.params.KEYWORD + ".*")
    let users = user.find({username: regex}).exec();
    var buffer = [];
    users.then((users) => {
        for(var i = 0; i < users.length; i++){
            buffer[i] = users[i];
        }
        res.end(buffer);
    });
});
//compiles all items with substring from the database into a string
app.get('/search/items/:KEYWORD', function(req,res){
    console.log(req.params);
    regex = new RegExp(".*" + req.params.KEYWORD + ".*")
    let items = item.find({desc: regex}).exec();
    var buffer = [];
    items.then((items) => {
        for(var i = 0; i < items.length; i++){
            buffer[i] = items[i];
        }
        res.json(buffer);
    });
});
//adds a user to the database
app.post('/add/user', function(req,res){
    let username = req.body.username;
    let password = req.body.password;
    let listings = [];
    let purchases = [];
    let p1 = user.find({username: username}).exec();
    p1.then((result)=>{
        if (result.length == 0) {
            let send = new user({username: username, password: password, listings: listings, purchases: purchases});
            let p = send.save();
            p.then(() => {
                res.end("Saved User");
            });
            p.catch((error)=>{
                res.end("Database Save Issue")
            });
        }else{
            res.end("User Already Created")
        }
    });
});
//adds an item to the database
app.post('/add/item', function(req,res){
    let title = req.body.title;
    let desc = req.body.desc;
    let image = req.body.image;
    let price = req.body.price;
    let status = req.body.status
    let username = req.cookies.login.username;
    console.log(title);
    let send = new item({title: title, desc: desc, image: image, price: price, status: status});
    let p = send.save();
    p.then(() => {
        console.log("Saved Item!")
    }).then(()=> {
        let Useritem = item.findOne({desc: desc});
        Useritem.then((Useritem) => {user.updateOne({username: username}, {$push: {"listings":Useritem.id}}).exec()});
    });
    p.catch((error) => {
        console.log('Save failed');
        console.log(error);
    });
    res.end();
});