const http = require('http');

//-- Definir el puerto a utilizar
const PUERTO = 8080;

const server = http.createServer((req, res) => {
    
    
  console.log("Petición recibida!");
});

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Servidor activado. Escuchando en puerto: " + PUERTO);
