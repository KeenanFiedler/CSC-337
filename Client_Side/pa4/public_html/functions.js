/*
    Keenan Fiedler
    This is the main Javascript file for PA4. It allows teh input of the user to update the text on the right.
    It also allows the user to click a button and randomize the values of the cells in the square cypher,
    and change a slider to change the shift of the caesar cypher. This all updates in real time.
*/

//responds to the typed input and updates text on right for both cyphers
//No Parameters
function inputTyped(){
    newSquareText();
    changeCaesar();
}

//function that changes the values of each of the squares in the table
//No Parameters
function changeSquare(){
    //arr of 1-25
    let arr = []
    for (let i = 1; i <= 25; i++) {
      arr.push(i)
    }
    
    //set result to non-repeating randomization of 1-25
    let result = [];
    for (let i = 1; i <= 25; i++) {
      const random = Math.floor(Math.random() * (25 - i));
      result.push(arr[random]);
      arr[random] = arr[25 - i];
    }

    //setting square table cells to random letter given by random list of 1-25
    for(let i = 0; i < 25; i++){
        let num = result[i]
        let text = document.getElementById("S".concat(num.toString()));
        text.innerHTML = String.fromCharCode(i+65);
    }

    //setting text in cypher space to new values
    newSquareText();
}

//function that sets the text for the square cypher to the right values
//No Parameters
function newSquareText(){
    //gets input array
    let input = document.getElementById("input");
    let inputArray = input.value.split("");
    //sets output array
    let displayArray = [];
    let displayText = document.getElementById("square")


    let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? 123456789]+/;
    //getting corresponding Square cypher values to the input and put in output array. 
    //If input is Z, z, or special, it is translated directly
    for(let i = 0; i < inputArray.length; i++){
        if(format.test(inputArray[i]) || inputArray[i] == "Z" || inputArray[i] == "z"){
            displayArray[i] = inputArray[i];
        } else {
            displayArray[i] = document.getElementById("S".concat((inputArray[i].toLowerCase().charCodeAt(0)-96))).outerText;
        }   
    }


    //buffer to remove commas in displayArray.toString(), turns the cyphered array into text
    let buffer = ""
    for (let i = 0; i < displayArray.length; i++ ){
        buffer = buffer + displayArray[i].toString();
    }
    //sets the text from the square to the cyphered text.
    displayText.innerHTML = "";
    buffer = buffer.toUpperCase();
    displayText.appendChild(document.createTextNode(buffer));
}


//changes the Caesar shift value and changes the text displayed on the right
//No Parameters
function changeCaesar(){
    //gets slider value
    let slider = document.getElementById("slider");
    let shift = slider.valueAsNumber; 
    //gets input value
    let input = document.getElementById("input");
    inputArray = input.value.split("");
    //set up output array
    let displayArray = [];
    let displayText = document.getElementById("caesar")


    let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? 123456789]+/;
    //sets output array charaters to input array characters+shift
    for(let i = 0; i < inputArray.length; i++){
        if(format.test(inputArray[i])){
            displayArray[i] = inputArray[i];
        } else {
            displayArray[i] = String.fromCharCode((((inputArray[i].toLowerCase().charCodeAt(0)+shift)-97)%26+97));
        }   
    }


    //buffer to remove commas in displayArray.toString(), turns the cyphered array into text
    let buffer = ""
    for (let i = 0; i < displayArray.length; i++ ){
        buffer = buffer + displayArray[i].toString();
    }
    //sets the caesar text to the cyphered text.
    displayText.innerHTML = "";
    buffer = buffer.toUpperCase();
    displayText.appendChild(document.createTextNode(buffer));
}
