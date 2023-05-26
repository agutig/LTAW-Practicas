
//Test:  http://localhost:9000/

//Modules
const fs = require('fs');
const http = require('http');


////OTHER
const DIRECTORY = returnFiles("./" , "-")

///////////////////////////////////////////////////// SET
const PUERTO = 9000;
const FRONT_PATH = "front/"

/////////////////////////////////////////////////////  DOWNLOAD DATA
DATABASE =  fs.readFileSync('tienda.json', 'utf-8')
DATABASE = JSON.parse(DATABASE)
const imagePath = "images/"

///////////////////////////////////////////////////// LOAD STATIC COMPONENTS
let SEARCHBAR = fs.readFileSync(FRONT_PATH + 'searchBar.html', 'utf-8')
let FOOTER = fs.readFileSync(FRONT_PATH + 'footer.html', 'utf-8')
let ORDERTEMPLATE = fs.readFileSync(FRONT_PATH + 'orderTemplate.html', 'utf-8')

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
        cookies = getCookies(req)
        data = manageProfilePage(data,cookies)
        OK(res,data)}else{NOT_OK(res)}});

    }else if (url.pathname == '/cart.html'){
      fs.readFile(FRONT_PATH + "cart.html", (err, data) => { if(!err){
        cookies = getCookies(req)
         manageCart(data,cookies ,function(error, data) {
          if (error) {
            console.error("error");
          } else {
            OK(res,data) 
          }
        });

        }else{NOT_OK(res)}});


    }else if (url.pathname == '/addCart'){

      let product = url.searchParams.get("cart");
      cookies = getCookies(req)
      if (checkIDExists(product)){
        if(cookies['cart']  == null || cookies['cart']  == "" ){
          res.setHeader('Set-Cookie', "cart="+product+"_1" );
          OK(res,"200 OK")
        }else{
          cart = cookies['cart'].split(":")
          cart = convert2Dic(cart,"_")
          if(cart[product] != null){
            cart[product] = String(Number(cart[product]) + 1) 
          }else{
            cart[product] = "1";
          }
          let cartCokie = ""
          Object.keys(cart).forEach(function(id) {
            cartCokie += id + "_" + cart[id] +":"
          });
          cartCokie = cartCokie.substring(0, cartCokie.length - 1);
          res.setHeader('Set-Cookie', ["cart="+cartCokie] );
          OK(res,"200 OK")
        }

      }else{
        //Si pasa por aqui, es debido a que hay un error y el id que se busca NO existe
        NOT_OK(res)
      }

  }else if (url.pathname == '/searchPage'){
    fs.readFile(FRONT_PATH + "searchPage.html", (err, data) => { if(!err){
      let productFind = url.searchParams.get("product");
      productList = findProduct(productFind)
      cookies = getCookies(req)
      data = manageSearchPage(data ,productList,cookies)
      OK(res,data)}else{NOT_OK(res)}});

  }else if (url.pathname == '/searchCategory'){
    fs.readFile(FRONT_PATH + "searchPage.html", (err, data) => { if(!err){
      let productFind = url.searchParams.get("category");
      productList = findProductByCategory(productFind)
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
      cookies = getCookies(req)
      for (let i = 0; i <  DATABASE.clients.length; i++){
        if (DATABASE.clients[i].userName == cookies.userName){

            if(cookies.cart != undefined && cookies.cart != null  ){DATABASE.clients[i].cart = cookies.cart}else{DATABASE.clients[i].cart = ""}
            fs.writeFile('tienda.json', JSON.stringify(DATABASE, null, 2), (err) => {
              if (err) throw err;
              console.log('Updated JSON');
            });
            break; 
        }
      }
      res.setHeader('Set-Cookie', ["cart= ; expires=Thu, 01 Jan 1970 00:00:00 GMT", "userName= ; expires=Thu, 01 Jan 1970 00:00:00 GMT"] );
      OK(res,"200 OK")

    }else if (url.pathname == '/ls'){
      OK(res,DIRECTORY)


    }else if (url.pathname == '/getReviews'){
      let reviews = []
      for (let i = 0; i <  DATABASE.clients.length; i++){
        if (DATABASE.clients[i].review != "" && DATABASE.clients[i].userName != "root"){
            let reviewObj = {
              name:DATABASE.clients[i].name,
              coment: DATABASE.clients[i].review,
              image: DATABASE.clients[i].image
            }
            reviews.push(reviewObj)
        }
      }
      OK(res,JSON.stringify(reviews))

    }else{
      fs.readFile(FRONT_PATH + url.pathname.slice(1,), (err, data) => { if(!err){OK(res,data)}else{
        NOT_OK(res)}});
    }

  }else if (req.method == "POST" ){
    
    if (url.pathname == '/login'){
      req.on('data', (content)=> {
        content = (content.toString()).split("&")
        content =  convert2Dic(content,"=")
        if(content['userName'] != ""){
          check = checkUser(content['userName'] , content['password'] ,DATABASE)
          if (check[0]) {
            if (check[1] != "" && check[1] != undefined){
              res.setHeader('Set-Cookie',["userName="+content['userName'] ,"cart=" + check[1] ]);
            }else{
              res.setHeader('Set-Cookie',["userName="+content['userName']]);
            }
            
            OK(res,"")
          }else{
            NOT_OK(res)
          }

        }else{
          NOT_OK(res)
        }
      });

    }else if(url.pathname == '/deleteProductCart') {
      let id = url.searchParams.get("id");
      cookies = getCookies(req)
      cartCookie = cookies['cart'].split(":")
      cartCookie = convert2Dic(cartCookie,"_")
      delete cartCookie[id]
      var updatedCart = '';
      if (cartCookie.length <=0 || String(cartCookie) == {} ){
        updatedCart = ''
        res.setHeader('Set-Cookie', ["cart= ; expires=Thu, 01 Jan 1970 00:00:00 GMT"]);
      }else{
        for (var clave in cartCookie) {
          updatedCart += clave + '_' + cartCookie[clave] + ':';
        }
        updatedCart = updatedCart.slice(0, -1);
        res.setHeader('Set-Cookie',["cart="+updatedCart]);
      }

      OK(res,"200 OK")
      //res.setHeader('Set-Cookie', "cart="+cartCokie );



    }else if(url.pathname == '/purchase'){
      req.on('data', (content)=> {
        content =  JSON.parse(content.toString())
        cookies = getCookies(req)
        for (let i = 0; i <  DATABASE.clients.length; i++){
          if (DATABASE.clients[i].userName == cookies.userName){
              DATABASE.clients[i].pedidos.push(content)
              break; 
          }
        }

        // This can be highly optimized
        for (let i = 0; i <  DATABASE.products.length; i++){
          for (let j = 0; j <  content.products.length; j++){
            if (DATABASE.products[i].id == content.products[j][0]){
              DATABASE.products[i].stock = DATABASE.products[i].stock - content.products[j][1]
              break; 
            }
          }
        }

        fs.writeFile('tienda.json', JSON.stringify(DATABASE, null, 2), (err) => {
          if (err) throw err;
          console.log('Updated JSON');
        });
        //res.setHeader('Set-Cookie', ["orders=" + cookie , "cart= ; expires=Thu, 01 Jan 1970 00:00:00 GMT"]); //Añadir cookies de pedido, eliminar cookie carrito
        res.setHeader('Set-Cookie', ["cart= ; expires=Thu, 01 Jan 1970 00:00:00 GMT"]); //Eliminar cookies carrito 
        
        OK(res,"OK")
      });
    }
  }
});

server.listen(PUERTO);
console.log("Servidor activado. Escuchando en puerto: " + PUERTO);



/////////////////////////////////////////////////////  DINAMIC HTML 

function manageMain(data, DATABASE , cookies){
  data = data.toString()
  data = data.replace("<!--INSERTSEARCHBAR-->",SEARCHBAR);
  data = data.replace("<!--INSERTFOOTER-->",FOOTER);
  if(cookies['userName'] != null){
    data = data.replace("Log in",cookies['userName']);
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
  data = data.replace("<!--INSERTSEARCHBAR-->",SEARCHBAR);
  data = data.replace("<!--INSERTFOOTER-->",FOOTER);
  if(cookies['userName'] != null){
    data = data.replace("Log in",cookies['userName']);
    data = data.replace("login.html", "profile.html");
  }

  for (let i = 0; i < DATABASE.products.length; i++){
      if (id ==  DATABASE.products[i].id){
        data = data.replace("placeholderTittle",  DATABASE.products[i].name);
        data = data.replace("placeholderImage", imagePath + String( DATABASE.products[i].img[0]));
        data = data.replace("placeholderIntro",  DATABASE.products[i].descripcion);

        data = data.replace("<!--placeholderWholePrice-->",  DATABASE.products[i].price);
        data = data.replace("<!--placeholderMonthPrice-->",  (DATABASE.products[i].price/12).toFixed(2));

        let reservedStock = 0

        if(cookies['cart'] != null){
          cartCookie = cookies['cart'].split(":")
          cartCookie = convert2Dic(cartCookie,"_")
          for (let key in cartCookie) {
            if (key ==  DATABASE.products[i].id){
                reservedStock = Number(cartCookie[key])
            }
          }
        }
        let stock = DATABASE.products[i].stock - reservedStock

        data = data.replace("replaceStock",  stock);
        if (stock > 0 ){
          data = data.replace("replaceClass", "'buyButton' onclick='buyButton(REPLACE_ID);'");
          data = data.replace("REPLACE_ID", id);
          data = data.replace("replaceButtonText", "Añadir al carrito");
        }else{
          data = data.replace("replaceClass", "noStock");
          data = data.replace("replaceButtonText", "Sin stock");
        }
        
        for (let j = 0; j <  DATABASE.products[i].caracteristics.length; j++){
          data = data.replace("placeholderESP",  DATABASE.products[i].caracteristics[j]);
        }
        break;
      }
  }
  return data
}


function manageSearchPage(data ,list,cookies){

  data = data.toString()
  data = data.replace("<!--INSERTSEARCHBAR-->",SEARCHBAR);
  data = data.replace("<!--INSERTFOOTER-->",FOOTER);
  if(cookies['userName'] != null){
    data = data.replace("Log in",cookies['userName']);
    data = data.replace("login.html", "profile.html");
  }data = data.replace("<!--INSERTSEARCHBAR-->",SEARCHBAR);
  data = data.replace("<!--INSERTFOOTER-->",FOOTER);

  if (list.length == 0){
    data = data.replace("replaceText" , "Lo sentimos,no tenemos ninguna sugerencia para esta busqueda." + "\n" +
     "Es probable que no tengamos ese producto :(  <img id='gatoTiste' src='images/gatoTiste.png'> ")
  }else{
    text = "<p>Estos son los productos mas similares a tu busqueda:</p>"
    for (let i=0; i < list.length; i++) {
      text += "<button class='suggestionButton' onclick=\"location.href='/product.html?product_id=" + list[i][1]+"';\">"+ list[i][0] +"</button>"
    }
    data = data.replace("replaceText" , text)
  }
  return data
}


function manageProfilePage(data,cookies){
  data = data.toString()
  data = data.replace("<!--INSERTSEARCHBAR-->",SEARCHBAR);
  data = data.replace("<!--INSERTFOOTER-->",FOOTER);
  if(cookies['userName'] != null){
    user = findUserByTag(cookies["userName"])
    data = data.replace("Log in",cookies['userName']);
    data = data.replace("login.html", "profile.html");
    data = data.replace("REPLACEIMG",user['image']);
    data = data.replace("userTag",cookies["userName"]);
    data = data.replace("userName",user["name"]);
    data = data.replace("userEmail",user["email"]);
    if(user.pedidos.length == 0){
      data = data.replace("<!--REPLACEORDERS-->","<p>No tienes ningun pedido</p>");
    }else{
      let components = ""
      for (let i = 0; i <  user.pedidos.length; i++){
        components += "<div class='order'> <p class='orderDivText'>Pedido para: "+ user.pedidos[i].data.user + "</p>\
        <p class='orderDivText3'>Dirección de envio: " +user.pedidos[i].data.dir  +" </p>\
        <p class='orderDivText3'>Numero de tarjeta: "+ user.pedidos[i].data.card + "</p> <p class='orderDivText3'> Productos comprados: </p>  "
        let total = 0
        for (let j = 0; j <  user.pedidos[i].products.length; j++){
          newOrder = ORDERTEMPLATE
          let product = findProductById(user.pedidos[i].products[j][0])
          newOrder = newOrder.replace("TITTLE",product.name);
          newOrder = newOrder.replace("UNITS",user.pedidos[i].products[j][1]);
          let price = product.price * Number(user.pedidos[i].products[j][1])
          newOrder = newOrder.replace("PRICE",price);
          components += newOrder
          total +=price
        }
        components += "<p class='orderDivText2'>Total: " + total +" €</p>  </div>"
      }
      data = data.replace("<!--REPLACEORDERS-->",components);
    }

  }
  return data
}


async function manageCart(data,cookies , callback){
  data = data.toString()
  data = data.replace("<!--INSERTSEARCHBAR-->",SEARCHBAR);
  data = data.replace("<!--INSERTFOOTER-->",FOOTER);
  if(cookies['userName'] != null){
    data = data.replace("Log in",cookies["userName"]);
    data = data.replace("login.html", "profile.html");
    if(cookies['cart'] != null && cookies['cart'].length != 0  ){
      fs.readFile(FRONT_PATH + "cartProduct.html", (err, component) => { 
        if(!err){
          component = component.toString()
          cartCookie = cookies['cart'].split(":")
          cartCookie = convert2Dic(cartCookie,"_")
          productsComponents = "<p id='cartTittle'>Lista de productos</p> \n <div id='productDiv' >"
          totalPrice = 0
          for (let key in cartCookie) {
            newComponent = component
            let id = key
            let stock = cartCookie[key]
            let componentData = findProductById(id)
            newComponent = newComponent.replace("TITTLE",componentData.name);
            newComponent = newComponent.replace(/REPLACE_ID/g,id);
            newComponent = newComponent.replace(/PRICEUNIT/g, String(componentData.price));
            newComponent = newComponent.replace("value='0'", "value='" + stock+"'");
            newComponent = newComponent.replace("TOTALPRICE", String(Number(stock) * Number(componentData.price)));
            newComponent = newComponent.replace("replaceMAX", componentData.stock);
            totalPrice += Number(stock) * Number(componentData.price)
            productsComponents += newComponent + "\n";
          }
          const inputUI = "<div id=inputDataCart > <p class='textUserCart'>Tarjeta de crédito</p> \
          <input type='number' id='cardClient' class='userDataInput' placeholder='Introduce tu tarjeta de credito para completar el pago'/> \
          <p class='textUserCart' >Dirección de envio</p> <input id='dirClient' type='text' class='userDataInput' placeholder='Introduce tu direccion para completar el pago'/>\
          <p id='feedbackText'></p> </div>"
          productsComponents += " <p id='totalPriceFinal'> Total: " + String(totalPrice) + " € </p>" + inputUI + "</div> " ;
          data = data.replace("<!--REPLACE_PRODUCTS-->",productsComponents);
          data = data.replace("REPLACE_TEXT","Realizar pedido");
          data = data.replace("REPLACE_URL","sendPurchase()");
          callback(null,data)
        }else{console.log("error de lectura")}
      })
      

    }else{
      data = data.replace("<!--REPLACE_PRODUCTS-->", "<p id='cartTittle' style='margin: auto; margin-top: 2%'> No tienes ningun producto en la cesta :( </p>");
      data = data.replace("extraStyle=''","style='margin: auto; margin-top: 2%'");
      data = data.replace("REPLACE_TEXT","Volver a la pagina de inicio");
      data = data.replace("REPLACE_URL","location.href='/';");
      callback(null,data)
    }
    
  }else{
    data = data.replace("<!--REPLACE_PRODUCTS-->"," <p id='cartTittle'  style='margin: auto; margin-top: 2%'> Inicia sesión para poder realizar la compra </p>");
    data = data.replace("extraStyle=''","style='margin: auto; margin-top: 2%'");
    data = data.replace("REPLACE_URL","location.href='login.html';");
    data = data.replace("REPLACE_TEXT","Inicia sesion");
    callback(null,data)
  }
  
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

function findProductByCategory(search){
  const filteredArray = []
   DATABASE.products.map(function(elemento) {
    if ((elemento.category).toUpperCase().startsWith(search.toUpperCase())) {
      filteredArray.push([elemento.name ,elemento.id]);
    }
  });
  return filteredArray
}

function findProductById(id){

  let element;
  DATABASE.products.map(function(elemento) {
    if (elemento['id'] == id) {
      element = elemento
    }
  });
  return element
}

function findUserByTag(tag){

  let user;
  DATABASE.clients.map(function(client) {
    if (client['userName'] == tag) {
      user = client;

    }
  });
  return user
}

function convert2Dic(params , split){

  const dict = {};
  for (let i = 0; i < params.length; i++){
    param = params[i].split(split)
    dict[param[0]] = param[1];
  }
  return dict
}

function getCookies(req){
  let cookie = req.headers.cookie
  if (cookie) {
    cookie = cookie.replace(/\s/g, "");
    cookie = cookie.split(";")
    cookie = convert2Dic(cookie,"=")
    return cookie
  }else{
    return {}
  }
}

function checkUser(user,password,DATABASE){
  found = false
  cart = ""
  for (let i = 0; i <  DATABASE.clients.length; i++){
    if(DATABASE.clients[i].userName == user && DATABASE.clients[i].password == password ){
      found = true;
      cart = DATABASE.clients[i].cart
      break;
    }
  }
  return [found,cart]
}

function checkIDExists(search){
  let found = false
  DATABASE.products.map(function(elemento) {
    if (elemento.id == search) {
      found = true
    }
  });
  return found
}


function returnFiles(dir ,space){
  let sendText = ""
  const archivos = fs.readdirSync(dir);
  for (let i = 0; i < archivos.length; i++) {
    if(archivos[i].split(".").length > 1){
      sendText += "<p> " + space + " " + archivos[i] + "</p>";
    }else{
      sendText += "<p> " + space + " " + archivos[i] + "</p>";
      sendText += returnFiles(dir + "/" + archivos[i] , space + "---")
    }
  }
  return sendText
}