/*
    Keenan Fiedler
    This is the app Javascript file for PA9. It allows the user to search the listings, add a listing,
    view all of their listings, and view all of their purchases. It also allows the user to buy items.
*/

//searches all listings for a keyword
function searchListings(){
    let input = document.getElementById("search").value;
    console.log(input);
    let output = document.getElementById("itemDisplay");
    let url="";
    output.innerHTML = "";
    if(input ==""){
        url = 'http://localhost:80/get/items'
    }else{
        url = 'http://localhost:80/search/items/' + input
    }
    fetch(url).then((response)=>{return response.text();}).then((text)=>{
        console.log(text);
        let j = JSON.parse(text);
        for(let i =0; i<j.length; i++){
            let name = j[i].title;
            let desc = j[i].desc;
            let image = j[i].image;
            let price = j[i].price;
            let status = j[i].status;
            if(status == "SOLD"){
                output.innerHTML = output.innerHTML + "<div>" 
                + "<div><b>" + name + "</b></div><br>" 
                + "<div>" + desc + "</div><br>" 
                + "<div>" + image + "</div><br>" 
                + "<div>" + price + "</div><br>" 
                + "<div>This item has been purchased.</div><br>" 
                +"</div><br>"; 
            }else{
                output.innerHTML = output.innerHTML + "<div>" 
                + "<div><b>" + name + "</b></div><br>" 
                + "<div>" + desc + "</div><br>" 
                + "<div>" + image + "</div><br>" 
                + "<div>" + price + "</div><br>" 
                + "<div><button id='" + name + "' onclick='buyItem(" + name + ")'>Buy Now!</button></div><br>" 
                +"</div><br>"; 
            }
        }
    });
}

//gets the users listings
function viewListings(){
    let output = document.getElementById("itemDisplay");
    output.innerHTML = "";
    fetch('http://localhost:80/get/listings').then((response)=>{return response.text();}).then((text)=>{
        console.log(text);
        let j = JSON.parse(text);
        for(let i =0; i<j.length; i++){
            let name = j[i].title;
            let desc = j[i].desc;
            let image = j[i].image;
            let price = j[i].price;
            let status = j[i].status;
            output.innerHTML = output.innerHTML + "<div>" 
            + "<div><b>" + name + "</b></div><br>" 
            + "<div>" + desc + "</div><br>" 
            + "<div>" + image + "</div><br>" 
            + "<div>" + price + "</div><br>" 
            + "<div>" + status + "</div><br>" 
            +"</div><br>"; 
        }
    });
}

//gets the users purchases
function viewPurchases(){
    let output = document.getElementById("itemDisplay");
    output.innerHTML = "";
    fetch('http://localhost:80/get/purchases').then((response)=>{return response.text();}).then((text)=>{
        console.log(text);
        let j = JSON.parse(text);
        for(let i =0; i<j.length; i++){
            let name = j[i].title;
            let desc = j[i].desc;
            let image = j[i].image;
            let price = j[i].price;
            let status = j[i].status;
            output.innerHTML = output.innerHTML + "<div class='displayItem' id = '" + name + "'>" 
            + "<div><b>" + name + "</b></div><br>" 
            + "<div>" + desc + "</div><br>" 
            + "<div>" + image + "</div><br>" 
            + "<div>" + price + "</div><br>" 
            + "<div>" + status + "</div><br>" 
            +"</div><br>"; 
        }
    });
}

//alows the user to buy an item
function buyItem(element){
    let send = {title: element.id};
    fetch("http://localhost:80/app/purchase", {
        method: 'POST',
        body: JSON.stringify(send),
        headers: { 'Content-Type': 'application/json'
    }});
}

//take the user to the post page to buy an item
function addListing(){
    window.location.href = "/app/post.html";
}
//This function sends the information necessary to add an item to the server, 
//and returns the user to the home page
//It has no paramters
function addItem(){
    let inputs = document.getElementsByClassName("itemItems");
    console.log(inputs);
    let send = {title: inputs[0].value, 
                desc: inputs[1].value, 
                image: inputs[2].value, 
                price: inputs[3].value, 
                status: inputs[4].value};
    let p = fetch("http://localhost:80/add/item", {
        method: 'POST',
        body: JSON.stringify(send),
        headers: { 'Content-Type': 'application/json'}
    }).then(()=>{
        window.location.href = "/app/home.html";
    });
    p.catch((error) => {
        console.log(error);
    });
    console.log("Sent");
    for(let i = 0; i< inputs.length; i++){
        inputs[i].value = "";
    }
}

//updates the heading of the homepage with the username of the user
function getName(){
    fetch('/get/name').then((response)=>{return response.text();}).then((text)=>{
        document.getElementById("top").innerHTML = "Welcome " + text + "! What would you like to do?";
    });
}

