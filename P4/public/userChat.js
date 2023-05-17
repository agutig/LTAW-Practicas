const socket = io();

button = document.getElementById("inputButton");
messagesDiv = document.getElementById("messagesDiv");
input = document.getElementById("inputInput");

//Send User-server messages


function sendMessage(){
  //Mandar un mensaje SI atado a un evento
  console.log([USERNAME,input.value])
  msg = input.value
  input.value = ""
  messagesDiv.innerHTML += "<div class='messageClassDiv2'> <span class='userName'>Tú</span> <p class='chatText'>"+msg+"</p>  </div>"
  socket.emit("message" , [USERNAME,msg])
}


document.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    sendMessage()
  }
});

button.onclick = () => {
  sendMessage()
}

//Manage Server-client responses
socket.on("connect", () => {
  console.log("conexión correcta")
  socket.emit('connect_login', USERNAME);
});  

socket.on("disconnect", ()=> {
  socket.emit('connect_login', USERNAME);
})

socket.on("message", (msg)=>{
  console.log(msg)
  messagesDiv.innerHTML += "<div class='messageClassDiv1'> <p class='userName' >" + msg[0] + "</p> <p class='chatText' >"+ msg[1] +"</p> <div>"
});

socket.on("server", (msg)=>{
  console.log(msg)
  messagesDiv.innerHTML += "<div class='messageClassDiv3'> <p class='userName'>Server</p>  <p class='chatText' >" + msg + "</p>"
});

