
//Test:  http://localhost:9000/

//Modules
const fs = require('fs');
const http = require('http');
const { url } = require('inspector');


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
    res.write(data);
    res.end();
    //console.log("    200 OK")
}


function NOT_OK(res){
  res.statusCode = 404;
  res.statusMessage = "Not Found"
  res.setHeader('Content-Type','text/html');
  fs.readFile(FRONT_PATH + 'error.html', (err, data) => { if(!err){
    res.write(data)
    res.end();
    console.log("    Error 404 NOT FOUND")
  }});
  
}


const PUERTO = 9000;
const FRONT_PATH = "front/"

const server = http.createServer((req, res) => {
    
  let url = print_info_req(req)

  if (req.method == "GET" ){

    if (url.pathname == '/'){ fs.readFile(FRONT_PATH + 'index.html', (err, data) => { if(!err){
        cookies = getCookies(req)
        data = manageMain(data, DATABASE ,cookies)  
        OK(res,data)
      }else{NOT_OK(res)}});

    }else if (url.pathname == '/product.html'){
      fs.readFile(FRONT_PATH + '/product.html', (err, data) => { if(!err){
        cookies = getCookies(req)
        data = manageProductData(data, DATABASE,url.searchParams.get("product_id") ,cookies)
        OK(res,data)
      }else{NOT_OK(res)}});

    }else if(url.pathname == "/profile.html"){
      fs.readFile(FRONT_PATH + "profile.html", (err, data) => { if(!err){
        data = manageProfilePage(data, DATABASE ,cookies)
        OK(res,data)}else{NOT_OK(res)}});

    }else if (url.pathname == '/searchPage'){
      fs.readFile(FRONT_PATH + "searchPage.html", (err, data) => { if(!err){
        let productFind = url.searchParams.get("product");
        productList = findProduct(productFind)
        cookies = getCookies(req)
        data = manageSearchPage(data ,productList,cookies)
        OK(res,data)}else{NOT_OK(res)}});

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
        OK(res,JSON.stringify(["product" , productList[0][1]]))
      }else{
        OK(res,JSON.stringify(["searchPage" , productList]))
      }

    }else if(url.pathname == "/closeSesion"){
      res.setHeader('Set-Cookie', ["userName= ; expires=Thu, 01 Jan 1970 00:00:00 GMT"] );
      OK(res,"200 OK")

    }else{
      fs.readFile(FRONT_PATH + url.pathname.slice(1,), (err, data) => { if(!err){OK(res,data)}else{
        NOT_OK(res)}});
    }

  }else if (req.method == "POST" ){
    
    if (url.pathname == '/login'){
      req.on('data', (content)=> {
        
        content = (content.toString()).split("&")
        content =  convertDic(content)
        if(content['userName'] != ""){
          if (checkUser(content['userName'] , content['password'] ,DATABASE)) {
            res.setHeader('Set-Cookie', "userName="+content['userName'] );
            OK(res,"")
          }else{
            NOT_OK(res)
          }

        }else{
          NOT_OK(res)
        }
      });
    }
  }
});

server.listen(PUERTO);
console.log("Servidor activado. Escuchando en puerto: " + PUERTO);



/////////////////////////////////////////////////////  DINAMIC HTML 

function manageMain(data, DATABASE , cookies){
  data = data.toString()
  if(cookies['userName'] != null){
    data = data.replace("Log in",cookies["userName"]);
    data = data.replace("login.html", "profile.html");
  }

  for (let i = 0; i <  DATABASE.products.length; i++){
    data = data.replace("placeholderTittle",  DATABASE.products[i].name);
    data = data.replace("placeholderSlogan",  DATABASE.products[i].slogan);
    data = data.replace("placeholderImage", imagePath + String( DATABASE.products[i].img[0]));
    data = data.replace("placeholderID" , DATABASE.products[i].id )
  }
  return data
}

function manageProductData(data, DATABASE , id ,cookies){

  
  data = data.toString()
  if(cookies['userName'] != null){
    data = data.replace("Log in",cookies["userName"]);
    data = data.replace("login.html", "profile.html");
  }

  for (let i = 0; i < DATABASE.products.length; i++){
      if (id ==  DATABASE.products[i].id){
        data = data.replace("placeholderTittle",  DATABASE.products[i].name);
        data = data.replace("placeholderIntro",  DATABASE.products[i].intro);
        data = data.replace("placeholderImage", imagePath + String( DATABASE.products[i].img[0]));
        for (let j = 0; j <  DATABASE.products[i].description.length; j++){
          data = data.replace("placeholderESP",  DATABASE.products[i].description[j]);
        }
      }
  }
  return data
}


function manageSearchPage(html ,list,cookies){

  html = html.toString()
  if(cookies['userName'] != null){
    html = html.replace("Log in",cookies["userName"]);
    html = html.replace("login.html", "profile.html");
  }

  if (list.length == 0){
    html = html.replace("replaceText" , "Lo sentimos,no tenemos ninguna sugerencia para esta busqueda." + "\n" +
     "Es probable que no tengamos ese producto :(  <img id='gatoTiste' src='images/gatoTiste.png'> ")
  }else{
    text = "<p>Estos son los productos mas similares a tu busqueda:</p>"
    for (let i=0; i < list.length; i++) {
      text += "<button class='suggestionButton' onclick=\"location.href='/product.html?product_id=" + list[i][1]+"';\">"+ list[i][0] +"</button>"
    }
    html = html.replace("replaceText" , text)
  }
  return html
}


function manageProfilePage(data,DATABASE, cookies){

  data = data.toString()
  if(cookies['userName'] != null){
    data = data.replace("userTag",cookies["userName"]);
  }

  return data
}


function findProduct(search){
  const filteredArray = []
   DATABASE.products.map(function(elemento) {
    if ((elemento.name).toUpperCase().startsWith(search.toUpperCase())) {
      filteredArray.push([elemento.name ,elemento.id]);
    }
  });
  return filteredArray
}

function convertDic(params){
  const dict = {};
  for (let i = 0; i < params.length; i++){
    param = params[i].split("=")
    dict[param[0]] = param[1];
  }
  return dict
}

function getCookies(req){
  let cookie = req.headers.cookie;
  if (cookie) {
    cookie = cookie.split(";")
    cookie = convertDic(cookie)
    console.log(cookie)
    return cookie
  }else{
    console.log("No cookies encontradas: "  + String([cookie]))
    return {}
  }
}

function checkUser(user,password,DATABASE){
  
  found = false
  for (let i = 0; i <  DATABASE.clients.length; i++){
    if(DATABASE.clients[i].userName == user && DATABASE.clients[i].password == password ){
      found = true;
      break;
    }
  }
  return found
}