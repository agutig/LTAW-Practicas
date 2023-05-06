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
        userList.innerHTML += "<br> - " + message[i].name
    }
    
    console.log(message)
})


electron.ipcRenderer.on('genChat' , (event,message) => {

    typeText = 0
    if(message[0] == "server"){typeText = 1}
    showText = "<div class='messageDiv"+typeText +"' > <p>" + message[0] + "</p> <p>"+ message[1] + "</p>  </div>"
    document.getElementById("smallChatDivDiv").innerHTML += showText;
    console.log(message)
})


function sendTestMess(){

}

const myButton = document.getElementById('testButton');
myButton.addEventListener('click', () => {
    showText = "<div class='messageDiv1' > <p>server</p> <p> This is a test message, just ignore it</p>  </div>"
    document.getElementById("smallChatDivDiv").innerHTML += showText;
    electron.ipcRenderer.invoke('serverMess' , "This is a test message, just ignore it")
});