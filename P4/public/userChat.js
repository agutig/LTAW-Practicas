const socket = io();

button = document.getElementById("inputButton");
messagesDiv = document.getElementById("messagesDiv");
input = document.getElementById("inputInput");
usersListDiv = document.getElementById("usersListDiv")

let CHAT_DATABASE = {general:"<div class='invisibleDiv'></div>"}
let STATE = "general"
let USERS_LIST = []
let SOUND =  new Audio('public/sound_notification.mp3');
//Send User-server messages

function getDate(){
  var date = new Date();
  var hour = date.getHours().toString().padStart(2, '0');
  var minutes = date.getMinutes().toString().padStart(2, '0');
  return hour + ":" + minutes
}


function setState(id){
  STATE = id
  messagesDiv.innerHTML = CHAT_DATABASE[id]
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  var usersChats = document.getElementsByClassName("userChat")
  for (var i = 0; i < usersChats.length; i++) {
    usersChats[i].style.backgroundColor = "#464646";
  }

  var fatherDiv = document.getElementById(id);
  fatherDiv.style.backgroundColor = "#666666";
  let counter = fatherDiv.querySelector("#unread");
  counter.innerHTML =  ""

  if(id == "general"){
    document.getElementById("tittleConversationH1").innerHTML = "General"
  }else{
    for (let i = 0; i < USERS_LIST.length ; i++) {
      if (id == USERS_LIST[i].id){
        document.getElementById("tittleConversationH1").innerHTML = USERS_LIST[i].name
      }
    }
  }


}

function sendMessage(){
  //Mandar un mensaje SI atado a un evento
  msg = input.value
  date = getDate()
  if(msg != ""){
    input.value = ""
    CHAT_DATABASE[STATE] += "<div class='messageClassDiv2'> <p class='chatTimeText'> <span class='userName'>Tú</span>  <span class='messDate'>" + getDate() + "</span>  </p>   <p class='chatText'>"+msg+"</p></div>"
    messagesDiv.innerHTML = CHAT_DATABASE[STATE]
    socket.emit("message" , [ STATE,USERNAME,msg])
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
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
    CHAT_DATABASE[msg[0]] += "<div class='messageClassDiv3'> <p class='userName'>Server</p>  <p class='chatText' >" + msg[2] + "</p> <p>"+getDate()+"</p>  </div>"
    let flag = msg[3]
    if (flag != undefined || flag !=""){
      if(flag == "disconect"){
        let discoUser = msg[4]
        if( STATE == discoUser){
          messagesDiv.innerHTML += "<div class='messageClassDiv3'> <p class='userName'>Server</p>  <p class='chatText' >" + msg[2] + " cambia de chat para seguir chateando</p> <p>"+getDate()+"</p>  </div>"
        }
      }
    }

  }else{
    SOUND.play();
  //CHAT_DATABASE[STATE] +=  "<div class='messageClassDiv2'> <p class='chatTimeText'> <span class='userName'>Tú</span>  <span class='messDate'>" + getDate() + "</span>  </p>   <p class='chatText'>"+msg+"</p></div>"
    CHAT_DATABASE[msg[0]] += "<div class='messageClassDiv1'> <p class='chatTimeText'> <span class='userName'>"+ msg[1] +"</span> <span class='messDate'>"+getDate()+"</span>  </p> <p class='chatText' >"+ msg[2] +"</p> </div>"
  }


  if (STATE == msg[0]) {
    setState(msg[0])
  }else{
    var fatherDiv = document.getElementById(msg[0]);
    let counter = fatherDiv.querySelector("#unread");
    let value = Number((counter.innerHTML).slice(2, -1))
    counter.innerHTML =  " (" + String(value + 1) + ")"
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
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

