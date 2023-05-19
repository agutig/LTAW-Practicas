
//Test:  http://localhost:9000/

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

function returnFiles(dir ,space){
  let sendText = ""
  const archivos = fs.readdirSync(dir);
  for (let i = 0; i < archivos.length; i++) {
    console.log(archivos[i])
    if(archivos[i].split(".").length > 1){
      sendText += "<p> " + space + " " + archivos[i] + "</p>";
    }else{
      sendText += "<p> " + space + " " + archivos[i] + "</p>";
      sendText += returnFiles(dir + "/" + archivos[i] , space + "---")
    }
  }
  return sendText
}

const PUERTO = 9000;
const DIRECTORY = returnFiles("./" , "-")

const server = http.createServer((req, res) => {
    
  url = print_info_req(req)
  if (req.method == "GET" ){

    if(url.pathname != '/ls'){
      if (url.pathname == '/'){ url.pathname = "index.html"}
      fs.readFile(url.pathname.slice(1,), (err, data) => { if(!err){OK(res,data)}else{NOT_OK(res)}});
    }else{
      OK(res,DIRECTORY)
    }

  }

});

server.listen(PUERTO);
console.log("Servidor activado. Escuchando en puerto: " + PUERTO);
