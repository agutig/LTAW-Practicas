



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