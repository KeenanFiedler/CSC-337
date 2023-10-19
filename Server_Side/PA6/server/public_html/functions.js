/*
    Keenan Fiedler
    This is the client-side Javascript file for PA6. It allows the users text entered in the left side to be translated to text on the right side.
    This is based on their choice in the two drop down boxes, with six different translation modes. 
    It sends a request to the server for the actual translation using promises.
*/

//This function gets the translation of the text in the left from the server and displays it on the right
//It has no parameters.
function getTranslation(){
    var url = "http://localhost:80/translate/";
    var type1 = document.getElementById("inlanguage").value;
    var type2 = document.getElementById("outlanguage").value;
    var type = '';
    var watch = 0;
    var words = document.getElementById("inText").value;
    var out = document.getElementById("outText");
    if((type1 =='english' && type2 == 'english')||(type1 =='spanish' && type2 == 'spanish')||(type1 =='german' && type2 == 'german')){watch = 1;}
    else if(type1 == 'english' && type2 == 'german'){type = 'e2g'; url = url + type + "/";}
    else if(type1 == 'english' && type2 == 'spanish'){type = 'e2s'; url = url + type + "/";}
    else if(type1 == 'german' && type2 == 'english'){type = 'g2e'; url = url + type + "/";}
    else if(type1 == 'spanish' && type2 == 'english'){type = 's2e'; url = url + type + "/";}
    else if(type1 == 'german' && type2 == 'spanish'){type = 'g2s'; url = url + type + "/";}
    else if(type1 == 'spanish' && type2 == 'german'){type = 's2g'; url = url + type + "/";}
    if(watch == 0){
        if(words.length == 0){out.innerHTML=words;}
        else{
            words = words.split(" ");
            for(let i = 0; i < words.length; i++){
                if(i == words.length - 1){url = url + words[i];}
                else{url = url + words[i] + "+";}
            }
            fetch(url).then((response) => {return response.text();}).then((text) =>{out.innerHTML = text});
        }
    }else{
        out.innerHTML = words;
    }
}

