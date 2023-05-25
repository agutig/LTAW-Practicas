
let btn_test;
document.getElementById("btn_test").onclick = () => {
    console.log("Botón apretado!");
}

console.log(document.getElementById("btn_test").onclick)

/*

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
    showText = "<div class='messageDiv1'> <p class='userName'>Server</p>  <p class='chatText' >" + message  + "/p>  </div>"
    document.getElementById("smallChatDivDiv").innerHTML += showText;
    electron.ipcRenderer.invoke('serverMess' , message )
}

*/