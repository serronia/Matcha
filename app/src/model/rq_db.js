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

    users_city : function(city_user, login){
        var selectQuery = 'SELECT login, age, city, sexe FROM utilisateur WHERE city=? AND login!=?';
        var val = [city_user, login];
        console.log(val);
        return new Promise ((success, error) =>{
            con.query(selectQuery, val, (error, res, fields) => {
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
                                    res[i].city+"</span></div><img src=\"/default-user-image.png\"><div class=\"bd\"><span>"+
                                    res[i].login+"</span><span>"+res[i].age+"</span></div></div>";
                        }
                        else
                        {
                            var mini = mini + "<div class=\"user_mini\"><div class=\"bd\"><i class=\"fas fa-venus\"></i><span>"+
                                    res[i].city+"</span></div><img src=\"/default-user-image.png\"><div class=\"bd\"><span>"+
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

    mini_user: function(login){
        var selectQuery = 'SELECT * FROM utilisateur WHERE login=?';
        var value = [login];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if (results.length == 1)
                {
                    var ret ="";
                    this.users_city(results[0].city, login).then(res => {
                        console.log("Res = ", res)
                        if (res)
                        {
                          ret = ret + res;
                        }
                        else
                        {
                          ret = "erreur";
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
        var selectQuery = 'SELECT orientation, bio, tag FROM (preference INNER JOIN utilisateur ON preference.id = utilisateur.id_preference) WHERE utilisateur.login=?';
        var value = [login];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if (results.length)
                {
                    console.log("pref dans rq_db = ", results);
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
    
    
};

