
document.addEventListener("DOMContentLoaded", function(event) { 


const searchBar = document.getElementsByClassName('searchBar')[0];
const searchElements = document.getElementById('searchElements')
console.log(searchElements)
searchBar.addEventListener('input', searchPreview);

let searchResults = []

function searchPreview() {

    search = searchBar.value
    console.log(search)
    const m = new XMLHttpRequest();
    m.open("GET", "/searchBar?product="+search, true);
    m.onreadystatechange = () => {
      if (m.readyState==4 && m.status == 200) {
        results = JSON.parse(m.responseText)
        searchElements.innerHTML = ""
        for (let i=0; i < results.length; i++) {
          searchElements.innerHTML += "<button class='elementSearched' onclick='productSelected(" + results[i] + ")'>"+ results[i] +"</button>"
        }
        searchResults = results
        console.log(searchResults);
      }
    }
    m.send();  //Envío de la petición
  }


})


function productSelected(productName){
  searchBar.innerHTML
}

