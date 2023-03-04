



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


document.addEventListener("DOMContentLoaded", function(event) { 
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

var nextRev = document.getElementById("reviewButtonNext");
var prevRev = document.getElementById("reviewButtonPrev");

index = 0

function showReview(){
    names[0].innerHTML = reviews[ Math.abs(index % reviews.length)].name
    coments[0].innerHTML = reviews[Math.abs(index % reviews.length)].coment
    images[0].src = reviews[Math.abs(index % reviews.length)].image

}

nextRev.onclick = function() {
    index += 1
    showReview()
    console.log(index)
};

prevRev.onclick = function() {
    index += -1
    showReview()
    console.log(index)
};


setInterval(function() {
    showReview()
    index += 1
  }, 5000);

console.log(index)

});