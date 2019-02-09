var con = require('../db');

module.exports={
    create_user: function(nom, prenom, mdp, naissance, login, mail){
    var sql = "INSERT INTO `utilisateur` (nom, prenom, mail, mdp, login, age) VALUE ?"
    var value = [nom, prenom, mail, mdp, login, 12];
    con.query(sql, [[value]], (err, res) => {if(err) throw(err)} );
    console.log("create fake done (normalement)");
    return (0);
    }

};