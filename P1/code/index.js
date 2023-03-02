



function showOnScroll() {
    deleteAnim = document.getElementsByClassName("opacityOnLoad3")
    for (var i = 0; i < deleteAnim.length; i++) {
        deleteAnim[i].classList.remove('opacityOnLoad3');
    }
    var elementsToShow = document.getElementsByClassName("fade");
    for (var i = 0; i < elementsToShow.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = elementsToShow[i].getBoundingClientRect().top;
        elementsToShow[i].style.opacity = 0.2 +(windowHeight - elementTop)/windowHeight
        /*
        if (elementTop > 0 && elementTop < windowHeight) {
            elementsToShow[i].style.opacity = 1
            elementsToShow[i].classList.remove('fade');
            elementsToShow[i].classList.add('fade-visible');
        }
        */
    }
}

window.addEventListener('scroll', showOnScroll);


var jBalvin = {
    name: 'J Balvin',
    coment: 'Lo unico bueno que tienen es el front de la web, no les vuelvo a comprar.',
    image: 'images/cliente_1.png'
}

var guillermo = {
    name: 'Guillermo Del Todo',
    coment: 'Han escrito mal mi nombre caguen la leche',
    image: 'images/cliente_2.png'
}

reviews = [guillermo,jBalvin]

names = document.getElementsByClassName("reviewName");
coments = document.getElementsByClassName("reviewText");
images = document.getElementsByClassName("reviewUserImage");


index = 0

setInterval(function() {
    names[0].innerHTML = reviews[index % reviews.length].name
    coments[0].innerHTML = reviews[index % reviews.length].coment
    images[0].src = reviews[index % reviews.length].image
    index += 1
    console.log("La función timer se ha activado.");
    console.log(name.innerHTML)
  }, 5000);