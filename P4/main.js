//http://localhost:9000/

//-- Cargar las dependencias
const socketServer = require('socket.io').Server;
const http = require('http');
const express = require('express');
const fs = require('fs');


/* ELECTRON GUI */
const electron = require('electron');
let win = null;
electron.app.on('ready', () => {
    console.log("Evento Ready!");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
  ____  _____ ______     _______ ____     ____  _____ _____ _   _   _ _   _____    ____ ___  _   _ _____ ___ ____ _   _ ____      _  _____ ___ ___  _   _ 
 / ___|| ____|  _ \ \   / / ____|  _ \   |  _ \| ____|  ___/ \ | | | | | |_   _|  / ___/ _ \| \ | |  ___|_ _/ ___| | | |  _ \    / \|_   _|_ _/ _ \| \ | |
 \___ \|  _| | |_) \ \ / /|  _| | |_) |  | | | |  _| | |_ / _ \| | | | |   | |   | |  | | | |  \| | |_   | | |  _| | | | |_) |  / _ \ | |  | | | | |  \| |
  ___) | |___|  _ < \ V / | |___|  _ <   | |_| | |___|  _/ ___ \ |_| | |___| |   | |__| |_| | |\  |  _|  | | |_| | |_| |  _ <  / ___ \| |  | | |_| | |\  |
 |____/|_____|_| \_\ \_/  |_____|_| \_\  |____/|_____|_|/_/   \_\___/|_____|_|    \____\___/|_| \_|_|   |___\____|\___/|_| \_\/_/   \_\_| |___\___/|_| \_|
                                                                                                                                                        
 Just replace P3 code  &   ADD these diferent events when needed

    - Update number of users --> win.webContents.send('usersCon' ,clients)
    - Update number of users --> win.webContents.send('genChat' ,message)
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
            res.send(CHAT_HTML);
        });

    });


    /* GESTIÓN SOCKETS IO. */

    io.on('connect', (socket) => {

        console.log('nueva conexión')

        socket.on("connect_login", (msg)=> {
            console.log("Mensaje Recibido!: " + msg);
            clients.push({name: msg , id: socket.id})
            socket.broadcast.emit("server", "Se ha conectado: " + msg);
            socket.emit("server", "Wuolololooo bienvenido " + msg);
            win.webContents.send('usersCon' ,clients)
            win.webContents.send('genChat' , ["server", "Se ha conectado: " + msg])
        });

        socket.on('disconnect', function(){
            console.log('CONEXIÓN TERMINADA');
            filtered_clients = []
            for (let i = 0; i <  clients.length; i++){
                if (clients[i].id == socket.id){
                    win.webContents.send('genChat' , ["server", "Se ha desconectado: " + clients[i].name])
                    io.emit("server", "Se ha desconectado: " + clients[i].name);
                }else{
                    filtered_clients.push(clients[i])
                }

            }
            clients = filtered_clients
            win.webContents.send('usersCon' ,clients)
        });  


        socket.on("message", (msg)=> {
            console.log("Mensaje Recibido!: " + msg);
            if (msg[1][0] == "/"){
                spetialCommands(msg[1], socket , msg[0])
            }else{
                socket.broadcast.emit("message",msg);
                win.webContents.send('genChat' , msg)
            }
        });

    });

    //-- Lanzar el servidor HTTP
    server.listen(PUERTO);
    console.log("Escuchando en puerto: " + PUERTO);

    function spetialCommands(comand, socket , name){

        switch(comand){

            case "/help":
                socket.emit("server" ,"Comandos Disponibles: <br> - /list: Devuelve una lista con los comandos disponibles" + 
                "<br> - /hello : Devuelve el saludo <br> - /date : Da la fehca actual ")
                break;

            case "/list":
                let response = "Lista de usuarios conectados (menos tú, claro)"
                for (let i = 0; i <  clients.length; i++){
                    if (socket.id != clients[i].id){
                        response += "<br> - " + clients[i].name
                    }
                }
                console.log(clients)
                socket.emit("server" ,response)
                break;

            case "/hello":
                socket.emit("server" ,"Hola " + name + " !")
                break;

            case "/date":
                socket.emit("server" ,"Esta es la fecha actual: " + getDate())
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
   ____   _   _   ___ 
  / ___| | | | | |_ _|
 | |  _  | | | |  | | 
 | |_| | | |_| |  | | 
  \____|  \___/  |___|    

*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //-- Crear la ventana principal de nuestra aplicación
    win = new electron.BrowserWindow({
        width: 1200,  //-- Anchura 
        height: 800,  //-- Altura
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }

    });

    win.on('ready-to-show', () => {
        win.webContents.send('usersCon' ,clients)
    })

    electron.ipcMain.handle('serverMess',(event,msg) => {
            io.emit("server" ,msg)
    })

    win.loadFile("GUI/renderer.html")

});