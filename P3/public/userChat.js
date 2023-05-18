const socket = io();

button = document.getElementById("inputButton");
messagesDiv = document.getElementById("messagesDiv");
input = document.getElementById("inputInput");
usersListDiv = document.getElementById("usersListDiv")

let CHAT_DATABASE = {general:"<div class='invisibleDiv'></div>"}
let STATE = "general"
let USERS_LIST = []
//Send User-server messages


function setState(id){
  STATE = id
  messagesDiv.innerHTML = CHAT_DATABASE[id]
  var fatherDiv = document.getElementById(id);
  let counter = fatherDiv.querySelector("#unread");
  counter.innerHTML =  ""

  if(id == "general"){
    document.getElementById("tittleConversationH1").innerHTML = "General"
  }else{
    console.log(USERS_LIST)
    for (let i = 0; i < USERS_LIST.length ; i++) {
      if (id == USERS_LIST[i].id){
        document.getElementById("tittleConversationH1").innerHTML = USERS_LIST[i].name
        break;
      }
    }
  }


}

function sendMessage(){
  //Mandar un mensaje SI atado a un evento
  msg = input.value
  input.value = ""
  CHAT_DATABASE[STATE] += "<div class='messageClassDiv2'> <span class='userName'>Tú</span> <p class='chatText'>"+msg+"</p>  </div>"
  messagesDiv.innerHTML = CHAT_DATABASE[STATE]
  socket.emit("message" , [ STATE,USERNAME,msg])
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
  msg = JSON.parse(msg)
  new_message = ""
  if (msg[1] == "server"){
    CHAT_DATABASE[msg[0]] += "<div class='messageClassDiv3'> <p class='userName'>Server</p>  <p class='chatText' >" + msg[2] + "</p>  </div>"
  }else{
    CHAT_DATABASE[msg[0]] += "<div class='messageClassDiv1'> <p class='userName' >" + msg[1] + "</p> <p class='chatText' >"+ msg[2] +"</p> </div>"
  }

  if (STATE == msg[0]) {
    setState(msg[0])
  }else{
    var fatherDiv = document.getElementById(msg[0]);
    let counter = fatherDiv.querySelector("#unread");
    let value = Number((counter.innerHTML).slice(2, -1))
    counter.innerHTML =  " (" + String(value + 1) + ")"

  }

});


socket.on("chatList", (msg)=>{

  list = JSON.parse(msg)
  USERS_LIST = list
  usersListDiv.innerHTML = "<div class='userChat' id='general' onclick=setState('general') > <p class='userNameUserChat'> General </p>  <p id='unread'></p>  <p class='greenDot'> · </p> </div>"
  for (let i = 0; i < list.length ; i++) {
    if (USERNAME != list[i].name){
      if (CHAT_DATABASE[list[i].id] == undefined){CHAT_DATABASE[list[i].id] = "<div class='invisibleDiv'></div>" }
      usersListDiv.innerHTML +=  "<div class='userChat' id='"+list[i].id+"' onclick=setState('" + list[i].id + "') > <p class='userNameUserChat'>" + list[i].name+ "</p> <p id='unread'></p> <p class='greenDot'> · </p> </div>"
    }
  }

});

