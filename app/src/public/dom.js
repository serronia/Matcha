var miou = document.getElementById("gauche");

function menu1(LOL){
    fetch("http://localhost:8080/user")
        .then(response => response.text())
        .then(response => {
            if (response != "log")
            {document.getElementById("login").innerHTML = "<i class=\"fas fa-power-off\"></i>Deconnection";
            document.getElementById("loginUser").style.display="flex";
            document.getElementById("loginUser2").innerHTML = "<i class=\"fas fa-user\"></i>"+response;}
        });

    var miaou = '<div class="menu_head">Menu</div>'+ 
    '<div class="menu_elem"><a href="/"><i class="fas fa-home"></i>Accueil</a></div>'+
    '<div class="menu_elem"><a id="login" href="login"><i class="fas fa-power-off"></i>login</a></div>'+
    '<div class="menu_elem" id="loginUser"><a id="loginUser2" href="profil"></a></div>'+
    '<div class="menu_elem"><a href="chat"><i class="far fa-comments"></i>Chat</a></div>'+
    '<div class="menu_elem"><a href="likes"><i class="far fa-heart"></i>Likes</a></div>'+
    '<div class="menu_elem"><a href="recherche"><i class="fas fa-search"></i>Recherche</a></div>';

    miou.innerHTML = miaou;/*'<div class="menu_head">Menu</div>'+ 
    '<div class="menu_elem"><a href="/"><i class="fas fa-home"></i>Accueil</a></div>'+
    '<div class="menu_elem"><a href="login"><i class="fas fa-power-off"></i>Connection</a></div>'+
    '<div class="menu_elem"><a href="profil"><i class="fas fa-user"></i>Otterqueen</a></div>'+
    '<div class="menu_elem"><a href="chat"><i class="far fa-comments"></i>Chat</a></div>'+
    '<div class="menu_elem"><a href="likes"><i class="far fa-heart"></i>Likes</a></div>'+
    '<div class="menu_elem"><a href="recherche"><i class="fas fa-search"></i>Recherche</a></div>';*/
};

function User(LOL)
{
    return(LOL);
};