var con = require('../db');

module.exports={
    majority: function(user_date){
        actual_date = new Date();
        actual_date = actual_date.toISOString().split('T');
        user_date = Date.parse(user_date);
        actual_date = Date.parse(actual_date);
        dif = (actual_date - user_date) / (1000 * 60 * 60 * 24 * 365);
        if (dif < 18){
            console.log("il est pas majeur");
            return (0);
        }
        console.log("il est majeur");
        return (1);
    },
    create_user: function(nom, prenom, mdp, naissance, login, mail){
        console.log("nassance =  ",naissance[0]);
        user_date = naissance.split('-');
        console.log("user_date =  ",user_date[0]);
        if (this.majority(user_date[0]))
        {console.log("------------------   miaou  ----------------")}
        var sql = "INSERT INTO `utilisateur` (nom, prenom, mail, mdp, login, age) VALUE ?"
        var value = [nom, prenom, mail, mdp, login, naissance];
        
        con.query(sql, [[value]], (err, res) => {if(err) throw(err)});
        console.log("create fake done (normalement)");
        return (0);
    },

    fake_localisation: function(login, mdp, city, latitude, longitude){
        var sql = "UPDATE `utilisateur` SET city=?, latitude=?, longitude=? WHERE login = ? AND mdp = ?";
        var value = [city, latitude, longitude, login, mdp];
        con.query(sql, value, (err, res) => {if(err) throw(err)});
        console.log("city, longi, lati ok");
        return (0);
    },

    user_exist: function(login, mail)
    {
        var sql = "SELECT * FROM `utilisateur` WHERE login =? OR mail =?";
        var value = [login, mail];
        return new Promise ((success, error) =>{
            con.query(sql, value, (err, res) => {if (err) throw(err);
                if (res[0])
                { 
                    console.log("exist!!!!!");
                    success(0);
                }
                else 
                {
                    console.log(res);
                    console.log("pas exist!!!!!!!!!!");
                    success(1);
                }
            });
        });
    },

   
    rand_int: function(i){
        var int = Math.random() * i;
	    int = Math.floor(int);
	    return (int);
    },

    random_city: function(){
        var city = [
            ["Paris", "75001", "48.84495494047618", "2.376084880952381"],
            ["Saint-Ay", "45130", "47.860911", "1.752895"],
            ["Orleans", "45000", "47.903914", "1.902856"],
            ["Orleans", "45000", "47.901519", "1.907513"],
            ["Paris", "75009", "48.878500", "2.348276"],
            ["Paris", "75005", "48.843674", "2.353916"],
            ["Paris", "75017", "48.888758", "2.310995"],
            ["Lyon", "69002", "45.739428", "4.818012"],
            ["Lyon", "69005", "45.751808", "45.751808"],
            ["lyon", "69401", "45.760756", "4.852178"],
            ["Marseille", "13008", "43.276430", "5.378462"],
            ["Marseille", "13003", "43.309650", "5.384995"],
            ["Toulon", "83000", "43.123331", "5.930767"],
            ["Rennes", "35000", "48.115595", "-1.675276"],
            ["Nancy", "54000", "48.693798", "6.186916"],
            ["Toulouse", "31000", "43.605553", "1.435772"],
            ["Caen", "14000", "49.179240", "-0.373033"],
            ["Nice", "06300", "43.695197", "7.269949"],
            ["Tours", "37000", "47.377760", "0.675022"],
            ["Blois", "41000", "47.590098", "1.321244"],
            ["Giens", "45500", "47.695641", "2.639129"]]
            var int = Math.random() * 21;
	        int = Math.floor(int);
        return (city[int]);
    },

    valid: function(login,clef,actif){
        var sql = "UPDATE `utilisateur` SET clef=?, actif=? WHERE login=?";
        var value = [clef, actif, login];
        con.query(sql, value, (err, res) => {if(err) throw(err)});
        console.log("ok pour valid");
        return (0);
    },

    get_cle_db: function(login){
        var selectQuery = 'SELECT clef FROM utilisateur where login=?';
        var value = [login];
        
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if ( results.length == 1)
                { 
                    var firstResult = results[ 0 ];
                    console.log('cle:lololilol ' + firstResult['clef']);
                    success(results);
                } 
                else
                {
                    console.log("Pas de données");
                    success(0);
                }
            }
            );
        });
    }
    
};