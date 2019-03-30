var con = require('../db');
module.exports={
    users_tri : function(city_user, tag, sexe, login, trier, filtrer){
        var table = "(((utilisateur INNER JOIN photo ON photo.id_user=utilisateur.id) INNER JOIN details ON details.id_user=utilisateur.id) INNER JOIN preference ON preference.id_user=utilisateur.id)"
        var base = 'SELECT login, age, city, sexe, photo_1, tag, popularity FROM '+table+' WHERE login!=?';
        var val = [login];
        if (filtrer)
        {
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
            if((filtrer.sexe==0 || filtrer.sexe ==1) && filtrer.sexe != 3)
                filtres=filtres+" AND sexe = "+ filtrer.sexe;
            base = base + filtres;
        }
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

    matchs_with_me: function(id_user){
        var selectQuery = 'SELECT sexe, login, city, age, photo_1 \
                            FROM ((likes INNER JOIN utilisateur ON likes.id_user_1=utilisateur.id) INNER JOIN photo ON utilisateur.id=photo.id_user) \
                            WHERE id_user_2=? AND id_user_1 IN (SELECT id_user_2 FROM likes WHERE id_user_1=?)';
        var value = [id_user,id_user];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, res, fields) => {
                if (error) throw(error);
                if (res.length)
                {
                    var mini = "";
                    var i = res.length-1;
                    while(i >=0)
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
    }
};