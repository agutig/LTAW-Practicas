const socket = io();

button = document.getElementById("inputButton");
messagesDiv = document.getElementById("messagesDiv");
input = document.getElementById("inputInput");

//Send User-server messages


button.onclick = () => {
    //Mandar un mensaje SI atado a un evento
    console.log([USERNAME,input.value])
    msg = input.value
    messagesDiv.innerHTML += "<div class='messageClassDiv2'> <p class='textType2'>"+msg+"</p>  <div>"
    socket.emit("message" , [USERNAME,msg]) 
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
  messagesDiv.innerHTML += "<div class='messageClassDiv1'> <p class='textType1'>"+msg+"</p> <div>"
});

