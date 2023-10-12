/*
    Keenan Fiedler
    This is the Javascript file for PA5. It allows the input of the user in the URL to be parsed and 
    trasnlated in six differnt ways between Germna, Spanish, and Enlglish. Each request to the server via
    the URL updates the text in the webstire to display teh requested translation of a senctence.
*/
//basic includsion of packages
const express = require('express');
const readline = require('readline');
const fs = require("fs");


var outputArray = [];


//makes mapping of english words to spanish words
var e2s = {};
var fileStream = fs.createReadStream('Spanish.txt');
var file = readline.createInterface({input: fileStream, output: process.stdout, terminal: false});
file.on('line', (line) => {
    //splits each line by tab and then discards everything after special characters in the second half
    temp = line.split('\t');
    temp[1] = String(temp[1]).split(/[<>%\$\{\(\[\/\,]/)[0];
    e2s[temp[0]] = temp[1];
});


//makes mapping of spanish words to english words
var s2e = {};
var fileStream2 = fs.createReadStream('Spanish.txt');
var file2 = readline.createInterface({input: fileStream2, output: process.stdout, terminal: false});
file2.on('line', (line) => {
    //splits each line by tab and then discards everything after special characters in the second half
    temp = line.split('\t');
    temp[1] = String(temp[1]).split(/[<>%\$\{\(\[\/\,]/)[0];
    s2e[temp[1]] = temp[0];
});


//makes mapping of english words to german words
var e2g = {};
var fileStream3 = fs.createReadStream('German.txt');
var file3 = readline.createInterface({input: fileStream3, output: process.stdout, terminal: false});
file3.on('line', (line) => {
    //splits each line by tab and then discards everything after special characters in the second half
    temp = line.split('\t');
    temp[1] = String(temp[1]).split(/[<>%\$\{\(\[\/\,]/)[0];
    e2g[temp[0]] = temp[1];
});


//makes mapping of german words to english words
var g2e = {};
var fileStream4 = fs.createReadStream('German.txt');
var file4 = readline.createInterface({input: fileStream4, output: process.stdout, terminal: false});
file4.on('line', (line) => {
    //splits each line by tab and then discards everything after special characters in the second half
    temp = line.split('\t');
    temp[1] = String(temp[1]).split(/[<>%\$\{\(\[\/\,]/)[0];
    g2e[temp[1]] = temp[0];
});


//This function translates foreign words into english words
//It takes in a string, type, and an array, words. 
//type holds the "s2e" or "g2e".
//words holds the array of the input sentence.
function foreignToEnglish(type, words){
    if(type == 's2e'){
        //goes through each word in words and decides if it is in the dict and sets the corresponding value in outputArray to the translated value
        for(let i = 0; i < words.length; i++){
            word = words[i];
            if(word in s2e){
                outputArray[i] = s2e[word];
            }else{
                outputArray[i] = "?"
            }
        }
    }else if(type == 'g2e'){
        //goes through each word in words and decides if it is in the dict and sets the corresponding value in outputArray to the translated value
        for(let i = 0; i < words.length; i++){
            word = words[i];
            if(word in g2e){
                outputArray[i] = g2e[word];
            }else{
                outputArray[i] = "?"
            }
        }
    }
}


//this function translates english words into foreign words
//It takes in a string, type, and an array, words. 
//type holds the "s2e" or "g2e".
//words holds the array of the input sentence.
function englishToForeign(type,words){
    if(type == 'e2s'){
        //goes through each word in words and decides if it is in the dict and sets the corresponding value in outputArray to the translated value
        for(let i = 0; i < words.length; i++){
            word = words[i];
            if(word in e2s){
                outputArray[i] = e2s[word];
            }else{
                outputArray[i] = "?"
            }
        }
    }else if(type == 'e2g'){
        //goes through each word in words and decides if it is in the dict and sets the corresponding value in outputArray to the translated value
        for(let i = 0; i < words.length; i++){
            word = words[i];
            if(word in e2g){
                outputArray[i] = e2g[word];
            }else{
                outputArray[i] = "?"
            }
        }
    }
}


//the function translates foreign words to foreign words
//It takes in a string, type, and an array, words. 
//type holds the "s2e" or "g2e".
//words holds the array of the input sentence.
function foreignToForeign(type, words){
    if(type == 'g2s'){
        //goes through each word in words and decides if it is in the given lang to engilsh dict
        //then checks if the trasnlation into english is in the english to other lang dict
        //sets outputArray to the english words translated in the first step
        for(let i = 0; i < words.length; i++){
            word = words[i];

            if(word in g2e){
                tempWord = g2e[word];
                if(tempWord in e2s){
                    outputArray[i] = e2s[tempWord];
                }else{
                outputArray[i] = "?"
                }
            }else{
                outputArray[i] = "?"
            }
        }
    }else if(type == 's2g'){
        //goes through each word in words and decides if it is in the given lang to engilsh dict
        //then checks if the trasnlation into english is in the english to other lang dict
        //sets outputArray to the english words translated in the first step
        for(let i = 0; i < words.length; i++){
            word = words[i];

            if(word in s2e){
                tempWord = s2e[word];
                console.log(tempWord);
                if(tempWord in e2g){
                    console.log(e2g[tempWord]);
                    outputArray[i] = e2g[tempWord];
                }else{
                outputArray[i] = "?"
                }
            }else{
                outputArray[i] = "?"
            }
        }
    }
}

//starts server and listens for requests
//only takes URLS matching /translate/TYPE/CONTENT
const app = express();
const port = 80;
app.use(express.static('public_html'));
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
app.get('/translate/:type/:words', function(req,res){

//sets up everything necessary to process URl and translation
outputArray=[];
var type = req.params.type;   
var words = req.params.words;
words = words.split('+');
//makes sure what operation is requested
//determines what type of translation out of e2f, f2e, f2f
//english to foreign languages
if(type == 'e2s' || type == 'e2g'){
    englishToForeign(type, words)
}
//foreign languages to english
else if(type == 's2e' || type == 'g2e'){
    foreignToEnglish(type, words)
} 
//foreign languages to foreign languages
else if(type == 's2g' || type== 'g2s'){
    foreignToForeign(type, words)
}

//compiles outputArray into a string with proper spacing
let buffer = ""
for (let i = 0; i < outputArray.length; i++ ){
    buffer = buffer + outputArray[i].toString() + " ";
}
    res.end(buffer);
});