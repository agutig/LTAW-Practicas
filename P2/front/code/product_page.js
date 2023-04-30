
document.addEventListener("DOMContentLoaded", function(event) { 

    function actPic(step){
        
        //Take data
        image = document.getElementById("productPic"); 
        fileListLen = 3
        img_url = image.src.split("/");
        file = img_url[img_url.length - 1].split("_")
        index = parseInt(file[file.length - 1].split(".")[0])

        //Update data
        index += parseInt(step)
        if (index < 0){ index = fileListLen -1}
        index = Math.abs(index % fileListLen)
 
        //index = Math.abs(index % fileListLen)

        var ppt = document.getElementById("ppt" + String(index));
        ppt.style.textShadow  = "0.75px 0.75px 0 #1b1b1b, -0.75px -0.75px 0 #1b1b1b,  0.75px -0.75px 0 #1b1b1b,   -0.75px 0.75px 0 #1b1b1b"
        

        //Load data
        file[file.length -1] = String(index) + ".png"
        img_url[img_url.length - 1] = file.join("_")

        image.src = img_url.join("/")
        file = img_url[img_url.length - 1].split("_")
        index = file[file.length -1].split(".")[0]

    }
    
    var nextRev = document.getElementById("picButtonNext");
    var prevRev = document.getElementById("picButtonPrev");

    var ppt0 = document.getElementById("ppt0");
    var ppt1 = document.getElementById("ppt1");
    var ppt2 = document.getElementById("ppt2");

    nextRev.onclick = function() {
        ppt0.style.textShadow  = "none"
        ppt1.style.textShadow = "none"
        ppt2.style.textShadow = "none"
        actPic(1)

    };

    prevRev.onclick = function() {
        ppt0.style.textShadow = "none"
        ppt1.style.textShadow = "none"
        ppt2.style.textShadow = "none"
        actPic(-1)

    };

});

function buyButton(id){

    feedback = document.getElementById("addFeedback");
    stockNumber =  document.getElementById("stockNumber");
    productButton =  document.getElementById("productButton");

    stock = Number(stockNumber.innerHTML) - 1
    stockNumber.innerHTML = String( stock )

    if (stock <=0 ){
        productButton.classList.replace("buyButton", "noStock");
        productButton.onclick = null;
    }

    var m = new XMLHttpRequest();
    m.open("GET", "/addCart?cart=" + String(id), true);
    m.setRequestHeader("Content-Type", "application/json");
    m.onreadystatechange = function() {
        if (m.readyState==4 && m.status == 200) {
            feedback.innerHTML = "Producto añadido al carrito"
        } else if (m.readyState==4 && m.status == 404) {
            feedback.innerHTML = "Error añadido al carrito"
        }
    };
    m.send();
}