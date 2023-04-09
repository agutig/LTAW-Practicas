

function closeSesion(){
    const m = new XMLHttpRequest();
      m.open("GET", "/closeSesion", true);
      m.onreadystatechange = () => {
        if (m.readyState==4 && m.status == 200) {
            location.href='/';
        }
      }
      m.send();  //Envío de la petición
}