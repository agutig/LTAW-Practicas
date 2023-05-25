const electron = require('electron');
const ip = require('ip');

let BODY = document.body.innerHTML;
//Static data
BODY = BODY.replace( "<!--REPLACE_NODE_VERSION-->" ,process.versions.node )
BODY = BODY.replace( "<!--REPLACE_NODE_CHROME-->" ,process.versions.chrome )
BODY = BODY.replace( "<!--REPLACE_NODE_ELECTRON-->" ,process.versions.electron )
document.body.innerHTML = BODY
//Api conection information data

//electron.ipcRenderer.invoke('conectionInformation' , "")


document.body.innerHTML = BODY


electron.ipcRenderer.on('usersCon' , (event,message) => {

    document.getElementById("usersConNum").innerHTML = message.length;
    let userList = document.getElementById("usersConList")
    userList.innerHTML = ""
    for (let i = 0; i <  message.length; i++){
        userList.innerHTML += "<br> <p id='greenDot'>.</p>" + message[i].name
    }
})


electron.ipcRenderer.on('genChat' , (event,message) => {

    typeText = 0
    if(message[1] == "server"){typeText = 1}
    showText = "<div class='messageDiv"+typeText +"' > <p class='userName'>" + message[1] + "</p> <p class='chatText'>"+ message[2] + "</p>  </div>"
    document.getElementById("smallChatDivDiv").innerHTML += showText;
 
})


electron.ipcRenderer.on('conectionInformation' , (event,message) => {
    message = JSON.parse(message)
    console.log(message)
    console.log(document.getElementById("replaceURL"))
    document.getElementById("replaceURL").innerHTML = "http://" +  message[0] + ":" +message[1]
    //document.body.innerHTML = document.body.innerHTML.replace( "<!--REPLACE_QR-->" ,message[2])
})


