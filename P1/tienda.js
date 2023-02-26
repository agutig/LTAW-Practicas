
//Test:  http://127.0.0.1:8080/

//Modules
const fs = require('fs');
const http = require('http');

function print_info_req(req) {

  console.log("");
  console.log("Mensaje de solicitud");
  console.log("====================");
  console.log("Método: " + req.method);
  console.log("Recurso: " + req.url);
  console.log("Version: " + req.httpVersion)
  console.log("Cabeceras: ");

  for (hname in req.headers)
    console.log(`  * ${hname}: ${req.headers[hname]}`);

  const myURL = new URL(req.url, 'http://' + req.headers['host']);
  console.log("URL completa: " + myURL.href);
  console.log("  Ruta: " + myURL.pathname);

  return myURL
}


function replaceType(type){

  switch(type){
      case 'html':
        return  ['text/html','utf8']
      
      case 'css':
        return ['text/css','utf8']
      
      case 'js':
        return ['text/javascript','utf8']

      case 'jpeg':
        return ['image/jpeg','binary']

      case 'png':
        return ['image/png','binary']

      case 'jpg':
        return ['image/jpg','binary']
  }
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
  res.setHeader("content-Type" , "text/plain");
  res.end();
  console.log("    Error 404 NOT FOUND")
}


const PUERTO = 8080;

const server = http.createServer((req, res) => {
    
  url = print_info_req(req)
  if (req.method == "GET" ){

    if (url.pathname == '/'){
      fs.readFile('index.html', (err, data) => { if(!err){OK(res,data)}else{NOT_OK(res)}});

    }else{
      fs.readFile(url.pathname.slice(1,), (err, data) => { if(!err){OK(res,data)}else{NOT_OK(res)}});
    }

    //<img src="images/mv_apple_0_0.jpg">

  }

});

server.listen(PUERTO);
console.log("Servidor activado. Escuchando en puerto: " + PUERTO);
