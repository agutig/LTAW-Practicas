//http://localhost:8080/

//-- Cargar las dependencias
const socketServer = require('socket.io').Server;
const http = require('http');
const express = require('express');


const PUERTO = 8080;
const app = express();

//Esto es necesario para que el servidor le envíe al cliente la biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));
app.use(express.static('public'));

const server = http.Server(app);
const io = new socketServer(server);

/*
app.get('/', (req, res) => {
  res.send('Bienvenido a mi aplicación Web!!!');
});
*/

/* GESTIÓN SOCKETS IO. */

io.on('connect', (socket) => {

    console.log('nueva conexión')


    socket.on('disconnect', function(){
        console.log('CONEXIÓN TERMINADA');
    });  


    socket.on("message", (msg)=> {
    //-- Mensaje recibido: Hacer eco
        console.log("Mensaje Recibido!: " );
        socket.send(msg);
    });

});

//-- Lanzar el servidor HTTP
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
