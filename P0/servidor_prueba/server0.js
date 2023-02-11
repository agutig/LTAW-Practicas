const http = require('http');

const PUERTO = 8080;

const server = http.createServer((req, res) => {
    
  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");

  // Repuesta del servidor
  res.setHeader('Content-Type', 'text/plain');
  res.write("Soy el Happy server!!\n");
  res.end();


});

server.listen(PUERTO);
console.log("Happy server activado!. Escuchando en puerto: " + PUERTO);