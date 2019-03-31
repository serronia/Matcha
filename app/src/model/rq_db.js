var con = require('../db');
var rq_db_re = require('./rq_db_recherche');

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

    users_tri : function(city_user, tag, sexe, login, trier, filtrer, lat, lng){
        var ban = "(SELECT id_user_2 FROM (ban INNER JOIN utilisateur ON utilisateur.id=ban.id_user_1) "
        var table = "(((utilisateur INNER JOIN photo ON photo.id_user=utilisateur.id) INNER JOIN details ON details.id_user=utilisateur.id) INNER JOIN preference ON preference.id_user=utilisateur.id)"
        if(sexe!=3)
        {
            var base = 'SELECT login, age, city, sexe, photo_1, tag, popularity, latitude, longitude FROM '+table+' WHERE city=? AND sexe=? AND login!=? AND utilisateur.id NOT IN '+ban+'WHERE login=?)';
            var val = [city_user, sexe, login, login];
        } 
        else
        {
            var base = 'SELECT login, age, city, sexe, photo_1, tag, popularity, latitude, longitude FROM '+table+' WHERE city=? AND login!=? AND utilisateur.id NOT IN '+ban+'WHERE login=?)';
            var val = [city_user, login, login];
        }
        if (filtrer)
        {
            var filtres = " ";
            if(filtrer.agemin)
                filtres= filtres + " AND age > "+ filtrer.agemin;
            if(filtrer.agemax)
                filtres=filtres+" AND age < "+ filtrer.agemax;
            if(filtrer.tag)
                filtres=filtres+" AND tag  LIKE '%"+ filtrer.tag+"%'";
            if(filtrer.pop)
                filtres=filtres+" AND popularity >= "+ filtrer.pop;
            base = base + filtres;
        }
        else
            base = base + "AND popularity >= 0";
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
                    //base = base + " ORDER BY tag DESC";
                    //SELECT login_user, COUNT(*) FROM tags_user WHERE login_user!='otterqueen' AND id_tag IN (SELECT id_tag FROM tags_user WHERE login_user='otterqueen') GROUP BY login_user
                    base = "SELECT utilisateur.id, login, login_user, city, age,sexe, photo_1,latitude, longitude, tag,popularity, COUNT(*) as nb_tag \
                            FROM ((((tags_user INNER JOIN utilisateur ON utilisateur.login=tags_user.login_user)INNER JOIN photo ON utilisateur.id=photo.id_user) \
                            INNER JOIN preference ON utilisateur.id=preference.id_user) INNER JOIN details ON utilisateur.id=details.id_user) \
                            WHERE login_user!=? AND city=? AND id_tag IN (SELECT id_tag FROM tags_user WHERE login_user=?) \
                            GROUP BY utilisateur.id, photo_1, tag,popularity ORDER BY nb_tag DESC"
                    val = [login, city_user, login];
                    break;
                default:
                    base = base + " ";
                    break;
            }
        }
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
                            var dist = rq_db_re.dist(lat, lng, res[i].latitude, res[i].longitude);
                            if(dist >= filtrer.kmmin && dist <= filtrer.kmmax)
                            {
                                if (res[i].sexe == 0)
                                {
                                    var mini = mini + "<div class=\"user_mini\"><div class=\"bd\"><i class=\"fas fa-mars\"></i><span id=\"dist\">"+dist+" km</span><span>"+
                                            res[i].city+"</span></div><a href=\"/profil/login/"+res[i].login+"\"><img src=\""+res[i].photo_1+"\"></a><div class=\"bd\"><span>"+
                                            res[i].login+"</span><span>"+res[i].age+"</span></div></div>";
                                }
                                else
                                {
                                    var mini = mini + "<div class=\"user_mini\"><div class=\"bd\"><i class=\"fas fa-venus\"></i><span id=\"dist\">"+dist+" km</span><span>"+
                                            res[i].city+"</span></div><a href=\"/profil/login/"+res[i].login+"\"><img src=\""+res[i].photo_1+"\"></a><div class=\"bd\"><span>"+
                                            res[i].login+"</span><span>"+res[i].age+"</span></div></div>";
                                }
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
        var selectQuery = 'SELECT city, tag, orientation, age, latitude, longitude  FROM (utilisateur INNER JOIN preference ON preference.id_user = utilisateur.id) WHERE login=?';
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
                    this.users_tri(results[0].city, results[0].tag, sexe, login, trier, filtrer, results[0].latitude, results[0].longitude).then(res => {
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

    update_pref: async function(atti, bio, tag, login){
        rq_db_re.add_tag(tag, login).then(
            res=>{
                return new Promise ((success, error) =>{
                    var selectQuery = 'UPDATE (preference INNER JOIN utilisateur ON preference.id_user = utilisateur.id) SET orientation=?, bio=?, tag=? WHERE utilisateur.login=?';
                    var value = [atti, bio, tag, login];
                    con.query(selectQuery, value, (error, results, fields) => {
                        if (error) throw(error);}
                    );
                });
            })
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
        var selectQuery = 'SELECT bio, tag, photo_1 FROM ((preference INNER JOIN utilisateur ON preference.id_user = utilisateur.id) INNER JOIN photo ON photo.id_user=utilisateur.id) WHERE login=?';
        var value = [login];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if (results.length != 0)
                {
                    if(results[0].bio && results[0].tag && results[0].photo_1)
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

