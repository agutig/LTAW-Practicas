/*
let btn_test;
document.getElementById("btn_test").onclick = () => {
    console.log("Botón apretado!");
}
console.log(document.getElementById("btn_test").onclick)

*/
function getDate(){
    var date = new Date();
    var hour = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
    return hour + ":" + minutes
}

let testButton= document.getElementById('testButton');
testButton.onclick = () => {
    console.log("Hey")
    sendMessage("Este es un mensaje de prueba, ignorenlo")
};

console.log(testButton)

let sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', () => {
    console.log("caca")
    const input = document.getElementById('inputTextServer');
    sendMessage(input.value)
    input.value = ""
});
console.log(sendButton)

function sendMessage(message){
    showText = "<div class='messageClassDiv2'> <p class='chatTimeText'> <span class='userName'>server</span> <span class='messDate'>"+ getDate() +"</span>  </p> <p class='chatText' >"+ message +"</p> </div>"
    //"<div class='messageDiv1'> <p class='userName'>Server</p>  <p class='chatText' >" + message  + "</p>  </div>"
    document.getElementById("smallChatDivDiv").innerHTML += showText;
    electron.ipcRenderer.invoke('serverMess' , message )
}

