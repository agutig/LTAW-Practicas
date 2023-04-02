
document.addEventListener("DOMContentLoaded", function(event) { 


const searchBar = document.getElementsByClassName('searchBar')[0];
const searchElements = document.getElementById('searchElements')
console.log(searchElements)
searchBar.addEventListener('input', searchPreview);

function searchPreview() {
    searchElements.innerHTML = "<p class='elementSearched'>"+ searchBar.value +"</p>"
    console.log(searchBar.value);
  
  }

})

