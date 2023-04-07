
//Test:  http://localhost:9000/

//Modules
const fs = require('fs');
const http = require('http');


/////////////////////////////////////////////////////  DOWNLOAD DATA
DATABASE =  fs.readFileSync('tienda.json', 'utf-8')
DATABASE = JSON.parse(DATABASE)
const imagePath = "images/"


/////////////////////////////////////////////////////  BASIC STATIC HTML 
function print_info_req(req) {

  const myURL = new URL(req.url, 'http://' + req.headers['host']);

  if (true){
    console.log("");
    console.log("Mensaje de solicitud");
    console.log("====================");
    console.log("Método: " + req.method);
    console.log("Recurso: " + req.url);
    console.log("Version: " + req.httpVersion)
    console.log("Cabeceras: ");

    for (hname in req.headers)
      console.log(`  * ${hname}: ${req.headers[hname]}`);

    
    console.log("URL completa: " + myURL.href);
    console.log("  Ruta: " + myURL.pathname);
  }
  return myURL
}

function OK(res,data){

    res.statusCode = 200;
    res.statusMessage = "OK"
    //res.setHeader("content-Type" , String(type[0]));
    res.write(data);
    res.end();
    console.log("    200 OK")

}


function NOT_OK(res){
  res.statusCode = 404;
  res.statusMessage = "Not Found"
  res.setHeader('Content-Type','text/html');
  fs.readFile('error.html', (err, data) => { if(!err){
    res.write(data)
    res.end();
    console.log("    Error 404 NOT FOUND")
  }});
  
}


const PUERTO = 9000;

const FRONT_PATH = "front/"

const server = http.createServer((req, res) => {
    
  url = print_info_req(req)

  if (req.method == "GET" ){

    if (url.pathname == '/'){ fs.readFile(FRONT_PATH + 'index.html', (err, data) => { if(!err){
        data = manageMain(data, DATABASE)  
        OK(res,data)
      }else{NOT_OK(res)}});


    }else if (url.pathname == '/product.html'){
      fs.readFile(FRONT_PATH + '/product.html', (err, data) => { if(!err){
        data = manageProductData(data, DATABASE,url.searchParams.get("product_id") )
        OK(res,data)
      }else{NOT_OK(res)}});

    }else if (url.pathname == '/productos'){
        let productFind = url.searchParams.get("product");
        if (productFind != ""){
           productList = findProduct(productFind)
        }else{
          productList = []
        }
        OK(res,JSON.stringify(productList))

    }else if (url.pathname == '/searchProduct'){
      let productFind = url.searchParams.get("product");
      productList = findProduct(productFind)

      if(productList.length == 1){
        //redirect("/product.html?product_id=" + productList[1])
        OK(res,JSON.stringify(["product" , productList[0][1]]))
      }else{
        //redirect(FRONT_PATH + "/error.html")
        OK(res,JSON.stringify(["searchPage" , productList]))
      }

    }else if (url.pathname == '/searchPage'){
      fs.readFile(FRONT_PATH + "searchPage.html", (err, data) => { if(!err){

        let productFind = url.searchParams.get("product");
        productList = findProduct(productFind)
        data = manageSearchPage(data ,productList)
        OK(res,data)}else{NOT_OK(res)}});

    }else{
      fs.readFile(FRONT_PATH + url.pathname.slice(1,), (err, data) => { if(!err){OK(res,data)}else{NOT_OK(res)}});
    }

  }

});

server.listen(PUERTO);
console.log("Servidor activado. Escuchando en puerto: " + PUERTO);



/////////////////////////////////////////////////////  DINAMIC HTML 

function manageMain(data, DATABASE){
  data = data.toString()
  for (let i = 0; i < DATABASE[0].length; i++){
    data = data.replace("placeholderTittle", DATABASE[0][i].name);
    data = data.replace("placeholderSlogan", DATABASE[0][i].slogan);
    data = data.replace("placeholderImage", imagePath + String(DATABASE[0][i].img[0]));
    data = data.replace("placeholderID" ,DATABASE[0][i].id )
    
  }
  return data
}

function manageProductData(data, DATABASE , id){
  data = data.toString()
  for (let i = 0; i < DATABASE[0].length; i++){
      if (id == DATABASE[0][i].id){
        data = data.replace("placeholderTittle", DATABASE[0][i].name);
        data = data.replace("placeholderIntro", DATABASE[0][i].intro);
        data = data.replace("placeholderImage", imagePath + String(DATABASE[0][i].img[0]));
        for (let j = 0; j < DATABASE[0][i].description.length; j++){
          data = data.replace("placeholderESP", DATABASE[0][i].description[j]);
        }
      }
  }
  return data
}


function manageSearchPage(html ,list){

  html = html.toString()
  if (list.length == 0){
    html = html.replace("replaceText" , "Lo sentimos, \n no tenemos ninguna sugerencia para esta busqueda :(")
  }else{
    text = "<p>Estos son los productos mas similares a tu busqueda:</p>"
    for (let i=0; i < list.length; i++) {
      text += "<button class='suggestionButton' onclick=\"location.href='/product.html?product_id=" + list[i][1]+"';\">"+ list[i][0] +"</button>"
    }
    html = html.replace("replaceText" , text)
  }

  return html

}


function findProduct(search){

  const filteredArray = []
  DATABASE[0].map(function(elemento) {
    if ((elemento.name).toUpperCase().startsWith(search.toUpperCase())) {
      filteredArray.push([elemento.name ,elemento.id]);
    }
  });
  return filteredArray
}

