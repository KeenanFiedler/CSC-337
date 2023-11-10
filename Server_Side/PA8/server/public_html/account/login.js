/*
    Keenan Fiedler
    This is the login Javascript file for PA9. It allows users to login and be recognized with cookies
    and adds new users to the database.
*/



//This function sends the login information to the server
//It has no parameters
function login(){
    let inputs = document.getElementsByClassName("loginItems");
    let send = {username: inputs[0].value, password: inputs[1].value};
    let p = fetch("http://localhost:80/login", {
        method: 'POST',
        body: JSON.stringify(send),
        headers: { 'Content-Type': 'application/json'}
    }).then((res)=>{return res.text()}).then((text)=>{
        if(text == "SUCCESS"){
            window.location.href = "/app/home.html";
        }else{
            window.alert("ERROR");
        }
    });
    p.catch((error) => {
        console.log(error);
    });
    inputs[0].value = "";
    inputs[1].value = "";
}





//****************** */
//FROM OSTAA PART 1
//****************** */
//This function sends the information necessary to add a user to the server
//It has no parameters
function addUser(){
    let inputs = document.getElementsByClassName("userItems");
    let send = {username: inputs[0].value, password: inputs[1].value};
    let p = fetch("http://localhost:80/add/user", {
        method: 'POST',
        body: JSON.stringify(send),
        headers: { 'Content-Type': 'application/json'}
    }).then((response)=>{return response.text();}).then((text)=>{
        let reg = document.getElementById('register');
        reg.innerHTML = reg.innerHTML + "<div>" + text + "</div>";
    });;
    p.catch((error) => {
        console.log(error);
    });
    console.log("Sent");
    inputs[0].value = "";
    inputs[1].value = "";
}


