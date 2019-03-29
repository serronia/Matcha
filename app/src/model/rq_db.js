var con = require('../db');

module.exports={
    get_mdp: function(login){
        var selectQuery = 'SELECT mdp, actif FROM utilisateur where login=?';
        var value = [login];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if ( results.length == 1)
                { 
                    var firstResult = results[0];
                    success(results);
                } 
                else
                {
                    success(0);
                }
            }
            );
        });
    },

    users_tri : function(city_user, tag, sexe, login, trier, filtrer){
        var table = "(((utilisateur INNER JOIN photo ON photo.id_user=utilisateur.id) INNER JOIN details ON details.id_user=utilisateur.id) INNER JOIN preference ON preference.id_user=utilisateur.id)"
        if(sexe!=3)
        {
            var base = 'SELECT login, age, city, sexe, photo_1, tag, popularity FROM '+table+' WHERE city=? AND sexe=? AND login!=?';
            var val = [city_user,sexe, login];
        } 
        else
        {
            var base = 'SELECT login, age, city, sexe, photo_1, tag, popularity FROM '+table+' WHERE city=? AND login!=?';
            var val = [city_user, login];
        }
        if (filtrer)
        {
            console.log("filtres = -----------------", filtrer)
            var filtres = " ";
            if(filtrer.agemin)
                filtres= filtres + " AND age > "+ filtrer.agemin;
            if(filtrer.agemax)
                filtres=filtres+" AND age < "+ filtrer.agemax;
            /*if(filtrer.kmmin)
                filtres=filtres+" AND dist > "+ filtrer.kmmin;
            if(filtrer.kmmax)
                filtres=filtres+" AND dist < "+ filtrer.kmmax;*/
            if(filtrer.tag)
                filtres=filtres+" AND tag  LIKE '%"+ filtrer.tag+"%'";
            if(filtrer.pop)
                filtres=filtres+" AND popularity >= "+ filtrer.pop;
            console.log("filtre = ", filtres);
            base = base + filtres;
        }
        
        console.log("base apres filtres = ", base);
        if (trier)
        {
            switch (trier) {
                case 'tri_age':
                    base = base + " ORDER BY age DESC";
                    break;
                case 'tri_loc':
                    base = base + " ORDER BY city DESC";
                    break;
                case 'tri_pop':
                    base = base + " ORDER BY popularity ASC";
                    break;
                case 'tri_tag':
                    base = base + " ORDER BY tag DESC";
                    break;
                default:
                    base = base + " ";
                    break;
            }
        }
        console.log("base apres tri = ", base);
        selectQuery = base;
        return new Promise ((success, error) =>{
            con.query(selectQuery, val, (error, res, fields) => {
                if (error) throw(error);
                if (res.length)
                { 
                    var mini = "";
                    var i = res.length-1;
                    while(i >=0)
                    {
                        if(res[i].photo_1)
                        {
                            if (res[i].sexe == 0)
                            {
                                var mini = mini + "<div class=\"user_mini\"><div class=\"bd\"><i class=\"fas fa-mars\"></i><span>"+
                                        res[i].city+"</span></div><a href=\"/profil/login/"+res[i].login+"\"><img src=\""+res[i].photo_1+"\"></a><div class=\"bd\"><span>"+
                                        res[i].login+"</span><span>"+res[i].age+"</span></div></div>";
                            }
                            else
                            {
                                var mini = mini + "<div class=\"user_mini\"><div class=\"bd\"><i class=\"fas fa-venus\"></i><span>"+
                                        res[i].city+"</span></div><a href=\"/profil/login/"+res[i].login+"\"><img src=\""+res[i].photo_1+"\"></a><div class=\"bd\"><span>"+
                                        res[i].login+"</span><span>"+res[i].age+"</span></div></div>";
                            }
                        }
                        i--;
                    }
                    success(mini);
                } 
                else
                {
                    success(0);
                }
            }
            );
        });
    },

    mini_user: function(login, trier, filtrer){
        var selectQuery = 'SELECT city, tag, orientation, age  FROM (utilisateur INNER JOIN preference ON preference.id_user = utilisateur.id) WHERE login=?';
        var value = [login];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if (results.length == 1)
                {
                    var ret ="";
                    if(results[0].orientation=="homme")
                        sexe=0;
                    else if(results[0].orientation=="femme")
                        sexe=1;
                    else
                        sexe=3;
                    this.users_tri(results[0].city, results[0].tag, sexe, login, trier, filtrer).then(res => {
                        if (res)
                        {
                          ret = ret + res;
                        }
                        else
                        {
                          ret = "Il n'y a pas de profils correspondants à vos critères";
                        }
                        success(ret);
                      })
                } 
                else
                {
                    success(0);
                }
            }
            );
        });
    },

    profil_user: function(login){
        var selectQuery = 'SELECT * FROM utilisateur WHERE login=?';
        var value = [login];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if (results.length == 1)
                {
                    success(results);
                } 
                else
                {
                    success(0);
                }
            }
            );
        });
    },

    pref_user: function(login){
        var selectQuery = 'SELECT orientation, bio, tag FROM (preference INNER JOIN utilisateur ON preference.id_user = utilisateur.id) WHERE utilisateur.login=?';
        var value = [login];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if (results.length)
                {
                    success(results);
                } 
                else
                {
                    success(0);
                }
            }
            );
        });

    },

    photo_user: function(login){
        var selectQuery = 'SELECT photo_1, photo_2, photo_3, photo_4, photo_5 FROM (photo INNER JOIN utilisateur ON photo.id_user = utilisateur.id) WHERE utilisateur.login=?';
        var value = [login];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if (results[0].photo_1)
                {
                    success(results);
                } 
                else
                {
                    success({0:{photo_1:"/default-user-image.png"}});
                }
            }
            );
        });

    },

    update_pref: function(atti, bio, tag, login){
        var selectQuery = 'UPDATE (preference INNER JOIN utilisateur ON preference.id_user = utilisateur.id) SET orientation=?, bio=?, tag=? WHERE utilisateur.login=?';
        var value = [atti, bio, tag, login];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if (results.length)
                {
                    success(1);
                } 
                else
                {
                    success(0);
                }
            }
            );
        });
    },

    modif_user: function(oldlogin, login, mail, genre, nom, prenom, adr){
        var selectQuery = 'UPDATE utilisateur SET login=?, mail=?, sexe=?, nom=?, prenom=?, city=? WHERE login=?';
        var value = [login, mail, genre, nom, prenom, adr, oldlogin];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if (results.length)
                {
                    success(1);
                } 
                else
                {
                    success(0);
                }
            }
            );
        });
    },

    updade_mdp: function(login, mdp){
        var selectQuery = 'UPDATE utilisateur SET mdp=? WHERE login=?';
        var value = [mdp, login];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if (results.length)
                {
                    success(1);
                } 
                else
                {
                    success(0);
                }
            }
            );
        });
    },

    verif_mail: function(mail, login){
        var selectQuery = 'SELECT * FROM utilisateur WHERE login=? AND mail=?';
        var value = [login, mail];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if (results.length != 0)
                {
                    success(1);
                } 
                else
                {
                    success(0);
                }
            }
            );
        });
    },

    User_compl: function(login){
        var selectQuery = 'SELECT bio, tag FROM (preference INNER JOIN utilisateur ON preference.id_user = utilisateur.id) WHERE login=?';
        var value = [login];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if (results.length != 0)
                {
                    if(results[0].bio && results[0].tag)
                    {
                        success(1);
                    }
                    else
                    {
                        success(0);
                    }
                } 
                else
                {
                    success(0);
                }
            }
            );
        });
    },



};

