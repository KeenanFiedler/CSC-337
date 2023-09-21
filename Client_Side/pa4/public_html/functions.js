
function inputTyped(){
    let x = document.getElementById("inputTextbox");
    newSquareText();
    changeCaesar();
}

//function that changes the values of each of the squares in the table
function changeSquare(){
    //arr of 1-25
    let arr = []
    for (let i = 1; i <= 25; i++) {
      arr.push(i)
    }
    
    //non-repeating randomization of 1-25
    let result = [];
    for (let i = 1; i <= 25; i++) {
      const random = Math.floor(Math.random() * (25 - i));
      result.push(arr[random]);
      arr[random] = arr[25 - i];
    }

    //setting square table cells to random letter give by random list of 1-25
    for(let i = 0; i < 25; i++){
        let num = result[i]
        let text = document.getElementById("S".concat(num.toString()));
        text.innerHTML = String.fromCharCode(i+65);
    }

    //setting text in cypher space to new values
    newSquareText();
}

//function that sets the text for the square cypher to the right values
function newSquareText(){
    //setting text in cypher space to new values
    let input = document.getElementById("input");
    let inputArray = input.value.split("");
    let displayArray = [];
    let displayText = document.getElementById("square")
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? 123456789]+/;
    for(let i = 0; i < inputArray.length; i++){
        if(format.test(inputArray[i])){
            displayArray[i] = inputArray[i];
        } else {
            displayArray[i] = document.getElementById("S".concat((inputArray[i].toLowerCase().charCodeAt(0)-96))).outerText;
        }   
    }
    //buffer to remove commas in displayArray.toString()
    let buffer = ""
    for (let i = 0; i < displayArray.length; i++ ){
        buffer = buffer + displayArray[i].toString();
    }
    displayText.innerHTML = "";
    buffer = buffer.toUpperCase();
    displayText.appendChild(document.createTextNode(buffer));
}

function changeCaesar(){
    let slider = document.getElementById("slider");
    let shift = slider.valueAsNumber;
    let input = document.getElementById("input");
    inputArray = input.value.split("");
    let displayArray = [];
    let displayText = document.getElementById("caesar")
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? 123456789]+/;
    for(let i = 0; i < inputArray.length; i++){
        if(format.test(inputArray[i])){
            displayArray[i] = inputArray[i];
        } else {
            displayArray[i] = String.fromCharCode((((inputArray[i].toLowerCase().charCodeAt(0)+shift)-97)%26+97));
        }   
    }
    //buffer to remove commas in displayArray.toString()
    let buffer = ""
    for (let i = 0; i < displayArray.length; i++ ){
        buffer = buffer + displayArray[i].toString();
    }
    displayText.innerHTML = "";
    buffer = buffer.toUpperCase();
    displayText.appendChild(document.createTextNode(buffer));
}
