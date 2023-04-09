



function login() {

    userName = document.getElementById("userName").value;
    password = document.getElementById("password").value;
    errorText = document.getElementById("errorText");
    errorText.innerHTML = ""
    console.log(userName)
    console.log(password)
    var m = new XMLHttpRequest();
    m.open("POST", "/login", true);
    m.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    m.onreadystatechange = function() {
        if (m.readyState==4 && m.status == 200) {
            location.href='/';
        } else if (m.readyState==4 && m.status == 404) {
            console.log("Error")
            errorText.innerHTML = "Email o contraseña incorrecta"
        }
    };
    m.send(`userName=${userName}&password=${password}`);
}