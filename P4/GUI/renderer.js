const electron = require('electron');

console.log("hey")
let BODY = document.body.innerHTML;

BODY = BODY.replace( "<!--REPLACE_NODE_VERSION-->" ,process.versions.node )
BODY = BODY.replace( "<!--REPLACE_NODE_CHROME-->" ,process.versions.chrome )
BODY = BODY.replace( "<!--REPLACE_NODE_ELECTRON-->" ,process.versions.electron )

document.body.innerHTML = BODY


electron.ipcRenderer.on('usersCon' , (event,message) => {
    console.log(message)
    document.getElementById("usersConNum").innerHTML = message.length;
    let userList = document.getElementById("usersConList")
    userList.innerHTML = ""
    for (let i = 0; i <  message.length; i++){
        userList.innerHTML += "<br> <p id='greenDot'>.</p>" + message[i].name
    }
    
    console.log(message)
})


electron.ipcRenderer.on('genChat' , (event,message) => {

    typeText = 0
    if(message[1] == "server"){typeText = 1}
    showText = "<div class='messageDiv"+typeText +"' > <p class='userName'>" + message[1] + "</p> <p class='chatText'>"+ message[2] + "</p>  </div>"
    document.getElementById("smallChatDivDiv").innerHTML += showText;
    console.log(message)
})



const myButton = document.getElementById('testButton');
myButton.addEventListener('click', () => {
    showText = "<div class='messageDiv1'> <p class='userName'>Server</p>  <p class='chatText' > This is just a test message, ignore</p>  </div>"
    document.getElementById("smallChatDivDiv").innerHTML += showText;
    electron.ipcRenderer.invoke('serverMess' , "This is a test message, just ignore it")
});