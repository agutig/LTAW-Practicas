const electron = require('electron');

console.log("hey")
let BODY = document.body.innerHTML;

BODY = BODY.replace( "<!--REPLACE_NODE_VERSION-->" ,process.versions.node )
BODY = BODY.replace( "<!--REPLACE_NODE_CHROME-->" ,process.versions.chrome )
BODY = BODY.replace( "<!--REPLACE_NODE_ELECTRON-->" ,process.versions.electron )

document.body.innerHTML = BODY




electron.ipcRenderer.on('usersConNum' , (event,message) => {
    document.getElementById("usersConNum").innerHTML = message;
    console.log(message)
})