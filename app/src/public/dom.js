var menu = document.getElementById("gauche");

function menu1(){
    fetch("http://localhost:8080/user")
        .then(response => response.text())
        .then(response => {
            if (response != "NomUser")
            {document.getElementById("login").innerHTML = "<i class=\"fas fa-power-off\"></i>Deconnection";
            document.getElementById("login").href = "/deco";
            document.getElementById("loginUser").style.display="flex";
            document.getElementById("loginUser2").innerHTML = "<i class=\"fas fa-user\"></i>"+response;}
            else{
                document.getElementById("loginUser").style.display="none";
            }
        });

    menu.innerHTML = '<div class="menu_head">Menu</div>'+ 
    '<div class="menu_elem"><a href="/"><i class="fas fa-home"></i>Accueil</a></div>'+
    '<div class="menu_elem"><a id="login" href="login"><i class="fas fa-power-off"></i>login</a></div>'+
    '<div class="menu_elem" id="loginUser"><a id="loginUser2" href="profil"></a></div>'+
    '<div class="menu_elem"><a href="chat"><i class="far fa-comments"></i>Chat</a></div>'+
    '<div class="menu_elem"><a href="likes"><i class="far fa-heart"></i>Likes</a></div>'+
    '<div class="menu_elem"><a href="recherche"><i class="fas fa-search"></i>Recherche</a></div>';
};

function wrong(){
    fetch("http://localhost:8080/wrong")
        .then(response => response.text())
        .then(response => {
            if (response != "")
            {
                document.getElementById("wrong").innerHTML = "<i class=\"far fa-times-circle\"></i>"+response;
                document.getElementById("wrong").style.display="flex";
            }
            else{
                document.getElementById("wrong").style.display="none";
            }
        });
}

function mail_alert(){
    fetch("http://localhost:8080/mail_alert")
        .then(response => response.text())
        .then(response => {
            if (response != "")
            {
                document.getElementById("mail_alert").innerHTML = "<i class=\"far fa-check-circle\"></i>"+response;
                document.getElementById("mail_alert").style.display="flex";
            }
            else{
                document.getElementById("mail_alert").style.display="none";
            }
        });
}


