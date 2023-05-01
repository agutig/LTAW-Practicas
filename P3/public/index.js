const socket = io();

button = document.getElementById("inputButton");


//Send User-server messages


button.onclick = () => {
    //Mandar un mensaje SI atado a un evento
     console.log("hey")
     socket.emit("message" , "holii") 
}

//Manage Server-client responses
socket.on("connect", () => {
  console.log("conexión correcta")
});  

socket.on("disconnect", ()=> {
  console.log("Desconexión")
})

socket.on("message", (msg)=>{
  console.log(msg)
});

