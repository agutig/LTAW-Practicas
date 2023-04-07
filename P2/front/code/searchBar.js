
document.addEventListener("DOMContentLoaded", function(event) { 


const searchBar = document.getElementsByClassName('searchBar')[0];
const searchElements = document.getElementById('searchElements')
console.log(searchElements)
searchBar.addEventListener('input', searchPreview);

let searchResults = []

function searchPreview() {

    search = searchBar.value
    if (search.length >= 3){
      console.log(search)
      const m = new XMLHttpRequest();
      m.open("GET", "/productos?product="+search, true);
      m.onreadystatechange = () => {
        if (m.readyState==4 && m.status == 200) {
          results = JSON.parse(m.responseText)
          searchElements.innerHTML = ""
          for (let i=0; i < results.length; i++) {
            searchElements.innerHTML += "<button class='elementSearched' onclick=\"location.href='/product.html?product_id=" + results[i][1]+"';\">"+ results[i][0] +"</button>"
          }
          searchResults = results
          console.log(searchResults);
        }
      }
      m.send();  //Envío de la petición
    }else{
      searchElements.innerHTML = ""
    }
  }
})



function productSearch(){

  const searchBar = document.getElementsByClassName('searchBar')[0];
  search = searchBar.value
  console.log(search)
  const m = new XMLHttpRequest();
  m.open("GET", "/searchProduct?product="+search, true);
  m.onreadystatechange = () => {
    if (m.readyState==4 && m.status == 200) {
      results = JSON.parse(m.responseText)
      if (results[0] == "product"){
        window.location.href = '/product.html?product_id=' + results[1];
      }else if (results[0] == "searchPage"){
        window.location.href = "/searchPage?product="+ search
      }else{
        window.location.href = '/error.html'
      }
    }
  }
  m.send();  //Envío de la petición
}