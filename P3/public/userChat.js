const socket = io();

button = document.getElementById("inputButton");
messagesDiv = document.getElementById("messagesDiv");
input = document.getElementById("inputInput");
usersListDiv = document.getElementById("usersListDiv")

let CHAT_DATABASE = {general:[]}
let STATE = "general"
//Send User-server messages


function setState(id){
  console.log(id)
  STATE = id
  messagesDiv.innerHTML = CHAT_DATABASE[id]

}

function sendMessage(){
  //Mandar un mensaje SI atado a un evento
  console.log([USERNAME,input.value])
  msg = input.value
  input.value = ""
  messagesDiv.innerHTML += "<div class='messageClassDiv2'> <span class='userName'>Tú</span> <p class='chatText'>"+msg+"</p>  </div>"
  socket.emit("message" , ["general",USERNAME,msg])
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
  msg = JSON.parse(msg)
  new_message = ""
  if (msg[1] == "server"){
    CHAT_DATABASE[msg[0]] += "<div class='messageClassDiv3'> <p class='userName'>Server</p>  <p class='chatText' >" + msg + "</p> </div>"
  }else{
    CHAT_DATABASE[msg[0]] += "<div class='messageClassDiv1'> <p class='userName' >" + msg[1] + "</p> <p class='chatText' >"+ msg[2] +"</p> <div>"
  }

  if (STATE == msg[0]) {setState(msg[0])}

});

socket.on("server", (msg)=>{
  console.log(msg)
  messagesDiv.innerHTML 
});

socket.on("chatList", (msg)=>{
  list = JSON.parse(msg)
  console.log(list)
  usersListDiv.innerHTML = "<div class='userChat' onclick=setState('general') > <p class='userNameUserChat'> General </p>"
  for (let i = 0; i < list.length ; i++) {
    if (USERNAME != list[i].name){
      usersListDiv.innerHTML +=  "<div class='userChat' onclick=setState('" + list[i].id + "') > <p class='userNameUserChat'>" + list[i].name+ "</p> <p class='greenDot'> · </p> </div>"
    }
  }

});

