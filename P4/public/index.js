

function login() {

    USERNAME = document.getElementById("userName").value;
    var m = new XMLHttpRequest();
    m.open("POST", "/login", true);
    m.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    m.onreadystatechange = function() {
        if (m.readyState==4 && m.status == 200) {
            console.log(m.responseText)

            var scriptElement = document.createElement("script");
            scriptElement.setAttribute("type", "text/javascript");
            scriptElement.setAttribute("src", "userChat.js");
            document.head.appendChild(scriptElement);

            var linkElement = document.createElement("link");
            linkElement.setAttribute("rel", "stylesheet");
            linkElement.setAttribute("type", "text/css");
            linkElement.setAttribute("href", "userChat.css")
            document.head.appendChild(linkElement);

            document.body.innerHTML = m.responseText;
            document.body.innerHTML = document.body.innerHTML.replace("<!--REPLACENAME-->", USERNAME)


        } else if (m.readyState==4 && m.status == 404) {
            console.log("Error")
        }
    };
    m.send(`userName=${USERNAME}`);
}