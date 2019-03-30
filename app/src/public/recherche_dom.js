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
    '<div class="menu_elem" id="loginUser"><a id="loginUser2" href="/profil"></a></div>'+
    '<div class="menu_elem"><a href="chat"><i class="far fa-comments"></i>Chat</a></div>'+
    '<div class="menu_elem"><a href="/matchs"><i class="far fa-heart"></i>Matchs</a></div>'+
    '<div class="menu_elem"><a href="recherche"><i class="fas fa-search"></i>Recherche</a></div>';
};

function affiche_profil(){
    fetch("http://localhost:8080/user")
        .then(response => response.text())
        .then(response => {
            if (response != "NomUser")
            {
                fetch("http://localhost:8080/User_compl")
                    .then(comp => comp.text())
                    .then(comp => {
                        if(comp == "1")
                        {
                            fetch("http://localhost:8080/recherche/mini_user")
                                .then(res => res.text())
                                .then(res => {
                                    if (res.length)
                                    {
                                        var princ = document.getElementById("principale");
                                        princ.innerHTML = res;
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
                            var princ = document.getElementById("principale").innerHTML = "<h1 style=\"color: #fffdff;\">Veuillez completer votre profil pour pouvoir rechercher d'autres profils.</h1>";
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


function affiche_match(){
    var princ = document.getElementById("principale");
    fetch("http://localhost:8080/matchs/matchs_with_me")
    .then(match => match.text())
    .then(match => {
        if (match)
        {
            princ.innerHTML = match;
        }
        else
        {
            princ.innerHTML = "Vous n'avez aucuns Matchs pour l'instant";
        }
    });
}