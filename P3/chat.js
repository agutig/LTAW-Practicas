//http://localhost:8080/

//-- Cargar las dependencias
const socketServer = require('socket.io').Server;
const http = require('http');
const express = require('express');
const fs = require('fs');


const PUERTO = 8080;
CHAT_HTML =  fs.readFileSync('public/userChat.html', 'utf-8')
const app = express();

//Esto es necesario para que el servidor le envíe al cliente la biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));
app.use(express.static('public'));

const server = http.Server(app);
const io = new socketServer(server);

app.post('/login', (req, res) => {
    let userName = ""
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', () => {
        const datos = new URLSearchParams(data);
        userName = datos.get('userName');
        res.send(CHAT_HTML);
        io.emit("server", "Se ha conectado: " + userName);
    });

});
/*
app.get('/', (req, res) => {
  res.send('Bienvenido a mi aplicación Web!!!');
});
*/

/* GESTIÓN SOCKETS IO. */

io.on('connect', (socket) => {

    console.log('nueva conexión')

    /*
    socket.on('connect_login', (msg)=> {
        socket.broadcast.emit("server", "Se ha conectado: " + msg);
    });  
    */

    socket.on('disconnect', function(){
        console.log('CONEXIÓN TERMINADA');
    });  


    socket.on("message", (msg)=> {
    //-- Mensaje recibido: Hacer eco
        console.log("Mensaje Recibido!: " + msg);
        socket.broadcast.emit("message",msg);
    });

});

//-- Lanzar el servidor HTTP
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
