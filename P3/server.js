//http://localhost:9000/

//-- Cargar las dependencias
const socketServer = require('socket.io').Server;
const http = require('http');
const express = require('express');
const fs = require('fs');
const colors = require('colors');


const PUERTO = 9000;
const CHAT_HTML =  fs.readFileSync('public/userChat.html', 'utf-8')
let clients = []
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
        const clientsName = clients.map(objeto => objeto.name);
        if (clientsName.includes(userName)){
            res.status(404).send("Nombre de usuario ya utilizado por otro usuario");
        }else if(userName.toLowerCase() == "server" ){
            res.status(404).send("Nombre de usuario no disponible");

        }else if(userName == "" ){
            res.status(404).send("Necesitas un nombre de usuario, este campo no puede estar vacio");

        }else{
            res.send(CHAT_HTML);
        }
    });

});


/* GESTIÓN SOCKETS IO. */

io.on('connect', (socket) => {

    socket.on("connect_login", (msg)=> {
        console.log('Nueva conexión: '.green + socket.id.blue + ": " + msg.yellow)
        clients.push({name: msg , id: socket.id})
        socket.broadcast.emit("message",JSON.stringify(["general","server", "Se ha conectado: " + msg]));
        io.emit("chatList", JSON.stringify(clients));
        const fechaActual = new Date();
        const hora = Number(fechaActual.getHours().toString().padStart(2, '0'));
        hourMess = ""
        if (hora > 9 && hora <= 13) {
            hourMess = "Buenos días ";
          } else if (hora > 13 && hora < 21) {
            hourMess = "Buenas tardes ";
          } else if (hora >= 21 || hora < 9) {
            hourMess = "Buenas noches ";
          }

        socket.emit("message", JSON.stringify(["general", "server" ,hourMess + msg + ", bienvenido."]) );
    });

    socket.on('disconnect', function(){
        console.log('CONEXIÓN TERMINADA CON: '.red  + socket.id.yellow);
        filtered_clients = []
        for (let i = 0; i <  clients.length; i++){
            if (clients[i].id == socket.id){
                io.emit("message", JSON.stringify([ "general", "server" ,"Se ha desconectado  " + clients[i].name ,"disconect" ,socket.id]));
            }else{
                filtered_clients.push(clients[i])
            }

        }
        clients = filtered_clients
        io.emit("chatList", JSON.stringify(clients));
    });  


    socket.on("message", (msg)=> {
        showMesageData(msg , socket.id)
        if (msg[2][0] == "/"){
            spetialCommands(msg[2], socket , msg[1] , msg[0])
        }else{
            if (msg[0] == "general"){
                socket.broadcast.emit("message",JSON.stringify(msg));

            }else{

                destinatary = msg[0]
                msg[0] = socket.id
                io.to(destinatary).emit('message', JSON.stringify(msg));
            }
            
        }
    });

});

//-- Lanzar el servidor HTTP
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);


function spetialCommands(comand, socket , name ,channel){

    switch(comand){

        case "/help":
            socket.emit("message" ,JSON.stringify([channel ,"server","Comandos Disponibles: <br> - /list: Devuelve una lista con los usuarios conectados" + 
            "<br> - /hello : Devuelve el saludo <br> - /date : Da la fecha actual "]))
            break;

        case "/list":
            let response = "Lista de usuarios conectados (menos tú, claro)"
            for (let i = 0; i <  clients.length; i++){
                if (socket.id != clients[i].id){
                    response += "<br> - " + clients[i].name
                }
            }
            socket.emit("message" ,JSON.stringify([channel ,"server",response]))
            break;

        case "/hello":
            socket.emit("message" , JSON.stringify([channel ,"server","Hola " + name + " !"]))
            break;

        case "/date":
            socket.emit("message" , JSON.stringify([channel ,"server","Esta es la fecha actual: " + getDate()]))
            break;

        default:
            socket.emit("message" , JSON.stringify([channel ,"server","Comando no reconocido, escribe /help para conocer todas las opciones"]))
            break;
    }

}


function getDate(){
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaActual.getFullYear();
    const hora = fechaActual.getHours().toString().padStart(2, '0');
    const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
    const segundos = fechaActual.getSeconds().toString().padStart(2, '0');

    const fechaHora = `${dia}/${mes}/${anio} ${hora}:${minutos}:${segundos}`;
    return fechaHora
}


function showMesageData(msg , id){
    console.log("________________________________________________".white)
    console.log("Mensaje recibido: ".magenta)
    console.log("origin id: ".blue + id.yellow)
    console.log("Destination id: ".blue + msg[0].yellow)
    if (msg[0] == "general"){
        console.log("Message content: ".blue + msg[2].yellow)
    }else{
        console.log("Message content: ".blue + "PRIVATE CONVERSATION")
    }
    console.log("________________________________________________".white)

}
