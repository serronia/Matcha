var con = require('../db');
var fetch = require('node-fetch');


module.exports={
    majority: function(user_date){
        actual_date = new Date();
        actual_date = actual_date.toISOString().split('T');
        user_date = Date.parse(user_date);
        actual_date = Date.parse(actual_date);
        dif = (actual_date - user_date) / (1000 * 60 * 60 * 24 * 365.25);
        if (dif < 18){
            return (0);
        }
        return (dif);
    },
    
    create_user: function(nom, prenom, mdp, naissance, login, mail, sexe){
        user_date = naissance.split('-');
        var age = this.majority(user_date[0]);
        return new Promise ((success, error) =>{
            if (age)
            {
                var sql = "INSERT INTO `utilisateur` (nom, prenom, mail, mdp, login, naissance, age, sexe) VALUE ?"
                var value = [nom, prenom, mail, mdp, login, naissance, age, sexe];
                con.query(sql, [[value]], (err, res) => {if(err) throw(err)});
                this.add_pic_n_pref_table(login); 
                console.log("create user done (normalement)");
                success (1);
            }
            else
            {
                success (0);
            }
        });
    },

    add_pic_n_pref_table: function(login){
        var selectQuery = 'SELECT id FROM utilisateur WHERE login=?';
        var value = [login];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if (results.length)
                {
                        var sql = "INSERT INTO `photo` (id_user) VALUE ?"
                        var value = [results[0].id];
                        con.query(sql, [[value]], (err, res) => {if(err) throw(err)});

                        var sql = "INSERT INTO `preference` (id_user) VALUE ?"
                        var value = [results[0].id];
                        con.query(sql, [[value]], (err, res) => {if(err) throw(err)});

                        var sql = "INSERT INTO `details` (id_user, popularity) VALUE ?"
                        var value = [results[0].id, 0];
                        con.query(sql, [[value]], (err, res) => {if(err) throw(err)});
                }
            })
        })
    },

    add_picture: function(login, picture, nb_pic){
        var selectQuery = 'SELECT id FROM utilisateur WHERE login=?';
        var value = [login];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if (results.length)
                {
                    if (nb_pic > 0)
                    {
                        var sql = "UPDATE `photo` SET photo_"+nb_pic+"=? WHERE id_user= ? ";
                        var value = [picture, results[0].id];
                        con.query(sql, value, (err, res) => {if(err) throw(err)});
                    }
                    
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

    nb_pic: function(login) {
        var selectQuery = 'SELECT id FROM utilisateur WHERE login=?';
        var value = [login];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                success(results);
            })
        }).then (data => {
            var i = 1;
            if (data[0]) {
                var sql = "SELECT * FROM photo WHERE id_user=?";
                var value = [data[0].id];
                return new Promise ((success, error) =>{
                    con.query(sql, value, (error, results, fields) => {
                        if (error) throw(error);
                        var photo = "photo_" + i;
                        while (results[0][photo] != null)
                        {
                            i++;
                            photo = "photo_"+i;
                        }
                    success(i);
                    })
                    
                })
            }
        }); 
    },


    coordonate_to_city:function(lat, long){
        return new Promise((succes, error) =>{
            fetch('http://www.mapquestapi.com/geocoding/v1/reverse?key=35fgkEqAPweOWLLCo1akTH1TFCbTOeIz&location='+lat+','+long)
            .then((res) => res.json())
            .then((async data =>{
                /*console.log("debut de api geoloc");
                console.log(data.results[0].locations[0].adminArea5);*/
                var city = data.results[0].locations[0].adminArea5;
                //console.log(data.results[0].locations[0].postalCode[4]);
                var codepostal = data.results[0].locations[0].postalCode[4];
                //console.log("fin de l'api geoloc");
                loc = {0:{city:city, code_postal:codepostal}}
                succes(loc);
            }))

        });
    },

    city_to_coordinate:function(city){
        return new Promise((succes, error) =>{
            fetch('http://www.mapquestapi.com/geocoding/v1/address?key=35fgkEqAPweOWLLCo1akTH1TFCbTOeIz&location='+city)
            .then((res) => res.json())
            .then((async data =>{
                /*console.log("------------------  data et data latlng = ")
                console.log(data["results"][0]["locations"][0]["latLng"]);
                console.log("lat = ", data.results[0].locations[0].latLng.lat);
                console.log("lng = ", data.results[0].locations[0].latLng.lng);*/
                var lat = data.results[0].locations[0].latLng.lat;
                var lng = data.results[0].locations[0].latLng.lng;
                loc = {0:{lat:lat, lng:lng}}
                succes(loc);
            }))

        });
    },

    add_city: function(city, arr, lat, lng, login){
        return new Promise ((success, error) =>{
            var sql = "UPDATE `utilisateur` SET city=?, arr=?, latitude=?,longitude=?  WHERE login=?";
            var value = [city, arr, lat, lng, login];
            con.query(sql, value, (err, res) => {if(err) throw(err)});
            success (1);
        });
    },

    fake_localisation: function(login, mdp, city, latitude, longitude){
        var sql = "UPDATE `utilisateur` SET city=?, latitude=?, longitude=? WHERE login = ? AND mdp = ?";
        var value = [city, latitude, longitude, login, mdp];
        con.query(sql, value, (err, res) => {if(err) throw(err)});
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
        return (0);
    },
    
    geoloc:function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
          } else { 
            x.innerHTML = "Geolocation is not supported by this browser.";
          }
        },

    get_cle_db: function(login)
    {
        var selectQuery = 'SELECT clef FROM utilisateur where login=?';
        var value = [login];
        
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                if ( results.length == 1)
                {
                    var firstResult = results[ 0 ];
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