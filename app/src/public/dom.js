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
                fetch("http://localhost:8080/mini_user")
                    .then(res => res.text())
                    .then(res => {
                        if (res.length)
                        {
                            var lol = "";
                            var princ = document.getElementById("principale");
                            lol = res;
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
    var ville = document.getElementById("ville");
    fetch("http://localhost:8080/user_profil")
        .then(profil => profil.json())
        .then(profil => {
            if(profil[0].sexe == 0)
                genre.innerHTML="Genre : Homme"
            else
                genre.innerHTML="Genre : Femme"
            age.innerHTML="Age : "+profil[0].age;
            ville.innerHTML="Ville : "+profil[0].city;
        });

    fetch("http://localhost:8080/user_pref")
        .then(pref => pref.json())
        .then(pref => {
            if(pref[0].orientation == "homme")
            {
                document.getElementById("atti").checked = true;
            }
            else if(pref[0].orientation == "femme")
            {
                document.getElementById("atti2").checked = true;
            }
            else
            {
                document.getElementById("atti3").checked = true;
            }
            document.getElementById("bio").value=pref[0].bio;
            document.getElementById("tag").value=pref[0].tag;
        });

    fetch("http://localhost:8080/user_photo")
        .then(photo => photo.json())
        .then(photo => {
            document.getElementById("photo_profil").src=photo[0].photo_1;
            if(photo[0].photo_2)
            {
                document.getElementById("photo_2").src=photo[0].photo_2;
                document.getElementById("photo_2").style.display="flex";
            }
            if(photo[0].photo_3)
            {
                document.getElementById("photo_3").src=photo[0].photo_3;
                document.getElementById("photo_3").style.display="flex";
            }
        });
    
}

function auto_compl(){
    var user = document.getElementById("user");
    var mail = document.getElementById("mail");
    var date = document.getElementById("date");
    var nom = document.getElementById("nom");
    var prenom = document.getElementById("prenom");
    var ville = document.getElementById("ville");
    

    fetch("http://localhost:8080/modif_user/auto_compl")
        .then(profil => profil.json())
        .then(profil => {
            var date_split = profil[0].naissance.split('T')[0];
            console.log("profil dans dom =" , profil[0])
            user.value = profil[0].login;
            mail.value = profil[0].mail;
            date.value = date_split;
            nom.value = profil[0].nom;
            prenom.value = profil[0].prenom;
            ville.value = profil[0].city;
            if(profil[0].sexe == 1)
                document.getElementById("femme").checked = true;
            else
                document.getElementById("homme").checked = false;

        });

}

function profil_other(){
    var genre = document.getElementById("genre");
    var age = document.getElementById("age");
    var ville = document.getElementById("ville");
    fetch("http://localhost:8080/profil/get_profil")
        .then(profil => profil.json())
        .then(profil => {
            if(profil[0].sexe == 0)
                genre.innerHTML="Genre : Homme"
            else
                genre.innerHTML="Genre : Femme"
            age.innerHTML="Age : "+profil[0].age;
            ville.innerHTML="Ville : "+profil[0].city;
        });

    fetch("http://localhost:8080/profil/user_pref")
        .then(pref => pref.json())
        .then(pref => {
            if(pref[0].orientation == "homme")
            {
                document.getElementById("atti").checked = true;
            }
            else if(pref[0].orientation == "femme")
            {
                document.getElementById("atti2").checked = true;
            }
            else
            {
                document.getElementById("atti3").checked = true;
            }
            document.getElementById("bio").value=pref[0].bio;
            document.getElementById("tag").value=pref[0].tag;
        });

    fetch("http://localhost:8080/profil/user_photo")
        .then(photo => photo.json())
        .then(photo => {
            document.getElementById("photo_profil").src=photo[0].photo_1;
            if(photo[0].photo_2)
            {
                document.getElementById("photo_2").src=photo[0].photo_2;
                document.getElementById("photo_2").style.display="flex";
            }
            if(photo[0].photo_3)
            {
                document.getElementById("photo_3").src=photo[0].photo_3;
                document.getElementById("photo_3").style.display="flex";
            }
        });
    
}