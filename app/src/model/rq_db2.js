var con = require('../db');
var rq_db = require('./rq_db');

module.exports={

    like: function(login, login_like){
        var user_id1="";
        var user_id2="";
        rq_db.profil_user(login)
        .then(profil =>
        {
            if(profil)
            {
                user_id1 = profil[0].id;
                rq_db.profil_user(login_like)
                .then(profil =>
                {
                    if(profil)
                    {
                        user_id2 = profil[0].id;
                        var time = new Date(Date.now());
                        return new Promise ((success, error) =>{
                            var sql = "INSERT INTO likes (id_user_1, id_user_2, date) VALUE ?"
                            var value = [user_id1, user_id2, time];
                            con.query(sql, [[value]], (err, res) => {if(err) throw(err)});

                            var sql = "UPDATE details SET nb_like=nb_like+1 WHERE id_user=?"
                            var value = [user_id2];
                            con.query(sql, [[value]], (err, res) => {if(err) throw(err)});

                                success(1);
                            });
                    }
                    else
                    {
                        response.send("Une erreur s'est produite, veuillez contactez l'admin")
                    }
                })
            }
            else
            {
                response.send("Une erreur s'est produite, veuillez contactez l'admin")
            }
        })
        
    },

    is_liked: function(user_id1, user_id2){
        var selectQuery = 'SELECT * FROM likes WHERE id_user_1=? AND id_user_2=?';
        var value = [user_id1, user_id2];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if (results.length == 1)
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

    unlike: function(user_id1, user_id2){
        return new Promise ((success, error) =>{
            var selectQuery = 'DELETE FROM likes WHERE id_user_1=? AND id_user_2=?;';
            var value = [user_id1, user_id2];
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);});
            var sql = "UPDATE details SET nb_like=nb_like-1 WHERE id_user=?"
            var value = [user_id2];
            con.query(sql, [[value]], (err, res) => {if(err) throw(err)});
            success(1);
        });
    },

    is_new_view: function(user_id1, user_id2){
        var selectQuery = 'SELECT * FROM vues WHERE id_user_1=? AND id_user_2=?';
        var value = [user_id1, user_id2];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if(results.length != 0)
                    success(0);
                else
                    success(1);
            }
            );
        });
    },

    add_view: function(login, login_other)
    {
        rq_db.profil_user(login)
        .then(profil =>
        {
            if(profil)
            {
                user_id1 = profil[0].id;
                rq_db.profil_user(login_other)
                .then(profil =>
                {
                    if(profil)
                    {
                        user_id2 = profil[0].id;
                        this.is_new_view(user_id1, user_id2).then(
                            is_new => {
                                if(is_new)
                                {
                                    var time = new Date(Date.now());
                                    return new Promise ((success, error) =>{
                                        var sql = "INSERT INTO vues (id_user_1, id_user_2, date) VALUE ?"
                                        var value = [user_id1, user_id2, time];
                                        con.query(sql, [[value]], (err, res) => {if(err) throw(err)});

                                        var sql = "UPDATE details SET nb_vue=nb_vue+1 WHERE id_user=?"
                                        var value = [user_id2];
                                        con.query(sql, [[value]], (err, res) => {if(err) throw(err)});

                                        success(1);
                                    });
                                }
                            }
                        ) 
                    }
                })
            }
        })
    },

    user_detail: function(login){
        var selectQuery = 'SELECT nb_vue, nb_like, popularity, id_user FROM (details INNER JOIN utilisateur ON utilisateur.id=details.id_user) WHERE login=?';
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

    add_pop: function(pop,id_user){
        return new Promise ((success, error) =>{
            var sql = "UPDATE details SET popularity=? WHERE id_user=?"
            var value = [pop, id_user];
            con.query(sql, value, (err, res) => {if(err) throw(err)});
            success(1);
        });
    },


    users_vue : function(login){
        var base = 'SELECT login, sexe, city, age, utilisateur.id, photo_1 \
                    FROM (utilisateur INNER JOIN photo ON photo.id_user=utilisateur.id) \
                    WHERE utilisateur.id IN \
                        (SELECT id_user_1 FROM (vues INNER JOIN utilisateur ON vues.id_user_2=utilisateur.id ) \
                        WHERE login=? ORDER BY date DESC)';
        var val = [login]
        selectQuery = base;
        return new Promise ((success, error) =>{
            con.query(selectQuery, val, (error, res, fields) => {
                if (error) throw(error);
                if (res.length)
                { 
                    var mini = "";
                    if(res.length >5)
                        j = 5;
                    else
                        j = res.length;
                    var i = 0;
                    while(i < j)
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
                        i++;
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

    users_liked : function(login){
        var base = 'SELECT login, sexe, city, age, utilisateur.id, photo_1 \
        FROM (utilisateur INNER JOIN photo ON photo.id_user=utilisateur.id) \
        WHERE utilisateur.id IN \
            (SELECT id_user_1 FROM (likes INNER JOIN utilisateur ON likes.id_user_2=utilisateur.id ) \
            WHERE login=? ORDER BY date DESC)';
        var val = [login]
        selectQuery = base;
        return new Promise ((success, error) =>{
            con.query(selectQuery, val, (error, res, fields) => {
                if (error) throw(error);
                if (res.length)
                { 
                    var mini = "";
                    if(res.length >5)
                        j = 5;
                    else
                        j = res.length;
                    var i = 0;
                    while(i < j)
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
                        i++;
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



};