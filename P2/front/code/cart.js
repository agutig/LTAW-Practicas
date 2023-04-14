

document.addEventListener("DOMContentLoaded", function(event) { 

    let inputs = document.getElementsByClassName('cartProductInput');
    let outputs = document.getElementsByClassName('cartProductPrice3');

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', () => {
          outputs[i].textContent = String( Number(inputs[i].getAttribute('unit'))  * Number(inputs[i].value))
          updateTotal()
        });
    }
})


function updateTotal(){
    let total = 0
    let subPrices = document.getElementsByClassName('cartProductPrice3');
    for (let i = 0; i < subPrices.length; i++) {
        total += Number(subPrices[i].textContent) 
    }
    document.getElementById('totalPriceFinal').textContent = "Total " + String(total) 
}

function sendPurchase(){

    let purchase = []
    let ids = document.getElementsByClassName('cartProductId');
    let stock = document.getElementsByClassName('cartProductInput');
    for (let i = 0; i < ids.length; i++) {
        purchase.push([ids[i].getAttribute('productId'), stock[i].value])
    }

    var m = new XMLHttpRequest();
    m.open("POST", "/Purchase", true);
    m.setRequestHeader("Content-Type", 'application/json');
    m.onreadystatechange = function() {
        if (m.readyState==4 && m.status == 200) {
            location.href='/';
        } else if (m.readyState==4 && m.status == 404) {
            console.log("Error")
            errorText.innerHTML = "Email o contraseña incorrecta"
        }
    };
    m.send(JSON.stringify(purchase));
}