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

function affiche_profil(){
    fetch("http://localhost:8080/user")
        .then(response => response.text())
        .then(response => {
            if (response != "NomUser")
            {
                console.log("user connecté :  ",response);
                fetch("http://localhost:8080/mini_user")
                    .then(res => res.text())
                    .then(res => {
                        if (res.length)
                        {
                            console.log("res de mini_user : ", res);
                            var lol = "";
                            var princ = document.getElementById("principale");
                            lol = res;
                            console.log("lol = ",lol);
                            princ.innerHTML = lol;
                        }
                        else
                        {
                            var princ = document.getElementById("principale");
                            princ.innerHTML="<h1 style=\"color: #fffdff;\">pas de suggestion pour l'instant</h1>";
                        }
                    });
            }
            else
            {
                var princ = document.getElementById("principale");
                princ.innerHTML="<h1 style=\"color: #fffdff;\">Bienvenu sur matcha. Vous devez être connecté pour voir les suggestions.</h1>";
            }
        });
}
function profil_user(){
    var genre = document.getElementById("genre");
    var age = document.getElementById("age");
    var orientation = document.getElementById("orientation");
    var ville = document.getElementById("ville");
    fetch("http://localhost:8080/user_profil")
        .then(profil => profil.text())
        .then(profil => {
            console.log("profil = ", profil);
            if(profil.sexe == 0)
                genre.innerHTML="Genre : Homme"
            else
                genre.innerHTML="Genre : Femme"
            age.innerHTML="Age = "+profil.age;
            orientation.innerHTML = "Attiré.e par :"+profil.orientation;
            ville.innerHTML=profil.city;

        });
}