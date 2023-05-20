

function showOnScroll() {
    deleteAnim = document.getElementsByClassName("opacityOnLoad3")
    for (var i = 0; i < deleteAnim.length; i++) {
        deleteAnim[i].classList.remove('opacityOnLoad3');
    }
    var elementsToShow = document.getElementsByClassName("fade");
    for (var i = 0; i < elementsToShow.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = elementsToShow[i].getBoundingClientRect().top;
        elementsToShow[i].style.opacity = 0.3 + 1.95*(windowHeight - elementTop)/windowHeight
        /*
        if (elementTop > 0 && elementTop < windowHeight) {
            elementsToShow[i].style.opacity = 1
            elementsToShow[i].classList.remove('fade');
            elementsToShow[i].classList.add('fade-visible');
        }
        */
    }
}


//__________________________________________________________________


document.addEventListener("DOMContentLoaded", function(event) { 

window.addEventListener('scroll', showOnScroll);
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
auto = 0

setInterval(function() {
    auto += 1
    if(auto >= 5){
        index += 1
        showReview()
        auto=0
    }
}, 1000);

nextRev.onclick = function() {
    index += 1
    showReview()
    auto = 0

};

prevRev.onclick = function() {
    index += -1
    showReview()
    auto = 0
};

reviews = []

var m = new XMLHttpRequest();
m.open("GET", "/getReviews", true);
m.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
m.onreadystatechange = function() {
    if (m.readyState==4 && m.status == 200) {
        reviews = JSON.parse(m.responseText)
        showReview()
    }
};
m.send();


console.log(reviews)

});


function categorySearch(category){

    const m = new XMLHttpRequest();
    m.open("GET", "/searchProduct?category="+category, true);
    m.onreadystatechange = () => {
      if (m.readyState==4 && m.status == 200) {
        results = JSON.parse(m.responseText)
        if (results[0] == "searchPage"){
          window.location.href = "/searchPage?product="+ search
        }else{
          window.location.href = '/error.html'
        }
      }
    }
    m.send();  //Envío de la petición
  }


