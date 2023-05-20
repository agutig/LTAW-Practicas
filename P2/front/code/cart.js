

function loadDOMdata(){
    let inputs = document.getElementsByClassName('cartProductInput');
    let outputs = document.getElementsByClassName('cartProductPrice3');

    for (let i = 0; i < inputs.length; i++) {
        if(inputs[i] != undefined){
            inputs[i].addEventListener('change', () => {
                outputs[i].textContent = String( Number(inputs[i].getAttribute('unit'))  * Number(inputs[i].value))
                updateTotal()
              });
        }
    }
}


document.addEventListener("DOMContentLoaded", function(event) { 
    loadDOMdata()
})


function updateTotal(){
    let total = 0
    let subPrices = document.getElementsByClassName('cartProductPrice3');
    for (let i = 0; i < subPrices.length; i++) {
        total += Number(subPrices[i].textContent) 
    }
    document.getElementById('totalPriceFinal').textContent = "Total " + String(total) 
    if (total <= 0){
        location.reload();
    }
}

function sendPurchase(){

    let purchase = []
    let ids = document.getElementsByClassName('cartProductId');
    let stock = document.getElementsByClassName('cartProductInput');
    for (let i = 0; i < ids.length; i++) {
        purchase.push([ids[i].getAttribute('productId'), stock[i].value])
    }

    console.log(purchase)
    var m = new XMLHttpRequest();
    m.open("POST", "/purchase", true);
    m.setRequestHeader("Content-Type", 'application/json');
    m.onreadystatechange = function() {
        if (m.readyState==4 && m.status == 200) {
            body = document.getElementsByClassName('mainBody')[0];
            body.innerHTML = "<p id='cartTittle' style='margin: auto; margin-top: 2%'> Compra realizada con exito, puedes comprobar el pedido en tu perfil</p>" 
            body.innerHTML += "<button id='cartButton'  style='margin: auto; margin-top: 2%' onclick=\"location.href='/' \" ;>Volver a la pagina de inicio</button>"

        } else if (m.readyState==4 && m.status == 404) {
            console.log("Error")
            errorText.innerHTML = "Email o contraseña incorrecta"
        }
    };
    m.send(JSON.stringify(purchase));
}

function deleteProduct(id){
    console.log(id)
    var elemento = document.querySelector('[productid="' + id + '"]');
    elemento.remove()
    //elemento.innerHTML = ""
    const m = new XMLHttpRequest();
    m.open("POST", "/deleteProductCart?id="+id, true);
    m.onreadystatechange = () => {
        if (m.readyState==4 && m.status == 200) {
            updateTotal()
        }
    }
    m.send();  //Envío de la petición
    loadDOMdata()
}