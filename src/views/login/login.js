import Core from '../../Core';

function cleanErrors(element, index, array) {
    element.innerHTML = "";
}

function getData(evt) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let errors = document.getElementsByClassName('error');

    evt.preventDefault();
    Array.from(errors).forEach(cleanErrors);

    if (!email) {
        document.getElementById('empty_email').innerHTML = "Type e-mail";
    } else if (!re.test(email)) {
        document.getElementById('incorrect_email').innerHTML = "Incorrect e-mail";
    } 
    if (!password) {
        document.getElementById('empty_password').innerHTML = "Type password";
    }
    if(email && password){
        setData(email, btoa(encodeURIComponent(password)));
    }
}

function setData(email, password) {
    const url = "http://hackyeahbe.azurewebsites.net/chcem/userkow/logowanko";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", url);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({ Email: email, Password: password }));

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            let res = JSON.parse(xmlhttp.response);
            if (res.success) {
                Core.redirect('/second')();
            }
        }
    }
}

export default getData;