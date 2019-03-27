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
                        return new Promise ((success, error) =>{
                            var sql = "INSERT INTO likes (id_user_1, id_user_2) VALUE ?"
                            var value = [user_id1, user_id2];
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
        var selectQuery = 'DELETE FROM likes WHERE id_user_1=? AND id_user_2=?;';
        var value = [user_id1, user_id2];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                success(1);
            }
            );
        });
    }
};