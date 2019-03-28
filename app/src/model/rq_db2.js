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
                console.log("res dans is new = ", results);
                if (error) throw(error);
                console.log("res.length = ", results.length);
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
                    console.log("result =  = ", results);
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
};