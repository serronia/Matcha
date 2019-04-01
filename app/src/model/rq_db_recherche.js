var con = require('../db');
var rq_db = require('./rq_db');

module.exports={
    users_tri : function(city_user, tag, sexe, login, trier, filtrer, lat, lng){
        var ban = "(SELECT id_user_2 FROM (ban INNER JOIN utilisateur ON utilisateur.id=ban.id_user_1) "
        var table = "(((utilisateur INNER JOIN photo ON photo.id_user=utilisateur.id) INNER JOIN details ON details.id_user=utilisateur.id) INNER JOIN preference ON preference.id_user=utilisateur.id)"
        var base = 'SELECT login, age, city, sexe, photo_1, tag, popularity, latitude, longitude FROM '+table+' WHERE login!=? AND utilisateur.id NOT IN'+ban+'WHERE login=?)';
        var val = [login, login];
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
                    //base = base + " ORDER BY tag DESC";
                    base = "SELECT utilisateur.id, login, login_user, city, age,sexe, photo_1,latitude, longitude, tag,popularity, COUNT(*) as nb_tag \
                            FROM ((((tags_user INNER JOIN utilisateur ON utilisateur.login=tags_user.login_user)INNER JOIN photo ON utilisateur.id=photo.id_user) \
                            INNER JOIN preference ON utilisateur.id=preference.id_user) INNER JOIN details ON utilisateur.id=details.id_user) \
                            WHERE login_user!=? AND id_tag IN (SELECT id_tag FROM tags_user WHERE login_user=?) \
                            GROUP BY utilisateur.id, photo_1, tag,popularity ORDER BY nb_tag ASC"
                    val = [login, login];
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
                            var dist = this.dist(lat, lng, res[i].latitude, res[i].longitude);
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
    },

    dist:function(lat_1, long_1, lat_2, long_2){
        var geodist = require('geodist');

        var from = {lat: lat_1, lon: long_1};
        var to = {lat: lat_2, lon: long_2};
        var dist = geodist(from, to, {unit: 'km'})
        return (dist);
    },

    is_exist: function(tag)
    {
        return new Promise ((success, error) =>{
            var sql = "SELECT * FROM tags WHERE name like ?"
            var value = [tag];
            con.query(sql, [[value]], (err, res) => {
                if(err) throw(err);
                if (res.length)
                    success(1);
                else
                    success(0);
            });
            
        });
    },

    add_tag2: function(tag)
    {
        return new Promise ((success, error) =>{
            var sql = "INSERT INTO tags (name) VALUE ?"
            var value = [tag];
            con.query(sql, [[value]], (err, res) => {
                if(err) throw(err);
                success(1);
            });
            
        });
    },

    get_tag_id: function(tag)
    {
        return new Promise ((success, error) =>{
            var sql = "select id FROM tags WHERE name like ?"
            var value = [tag];
            con.query(sql, [[value]], (err, res) => {
                if(err) throw(err);
                success(res);
            });
            
        });
    },

    is_exist_tag_user: function(id_tag, login)
    {
        return new Promise ((success, error) =>{
            var sql = "select id FROM tags_user WHERE id_tag =? AND login =?"
            var value = [tag];
            con.query(sql, [value], (err, res) => {
                if(err) throw(err);
                if(res.length)
                    success(1);
                else
                    success(0);
            });
        });
    },

    add_user_tag: function(login, tag)
    {
        var id_tag="";
        this.get_tag_id(tag)
        .then(tag =>
        {
            if(tag)
            {
                id_tag = tag[0].id;
                this.is_exist_tag_user(id_tag, login)
                .then(
                    exist =>{
                        if(!exist)
                        {
                            return new Promise ((success, error) =>{
                                var sql = "INSERT INTO tags_user (id_tag, login_user) VALUE ?"
                                var value = [id_tag, login];
                                con.query(sql, [[value]], (err, res) => {
                                    if(err) throw(err);
                                    success(1);
                                });
                            });
                        }
                    })
            }
            else
            {
                return("Une erreur s'est produite, veuillez contactez l'admin")
            }
        })
    },

    add_tag: async function(tag, login)
    {
        var tab = tag.split(',');
        len = tab.length;
        var i = 0;
        while (i < len)
        {
            try{
                await this.is_exist(tab[i].trim()).then(
                    res =>{
                        if (res){
                            this.add_user_tag(login, tab[i].trim());
                        }  
                        else{
                            this.add_tag2(tab[i].trim()).catch((err) => console.log('caught it'));
                            this.add_user_tag(login, tab[i].trim());
                        }
                })
            }
            catch(e)
            {
                console.log("erreur");
            }
           
            i++;
        }
    }


};