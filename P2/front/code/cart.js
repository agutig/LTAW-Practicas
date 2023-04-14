

document.addEventListener("DOMContentLoaded", function(event) { 

    const miInput = document.getElementById('cartProductInput');

    miInput.addEventListener('change', () => {
    // Aquí colocas el código que deseas ejecutar cuando cambia el valor del input
    console.log('El valor del input ha cambiado');
    });

})