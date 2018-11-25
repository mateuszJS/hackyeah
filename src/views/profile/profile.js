import getData from "../login/login";

function getProfile(user) {
    document.getElementById("email").innerHTML = localStorage.getItem("email");
    
}

export default getProfile;