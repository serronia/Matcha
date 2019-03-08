var con = require('../db');

module.exports={
    get_mdp: function(login){
        var selectQuery = 'SELECT mdp FROM utilisateur where login=?';
        var value = [login];
        return new Promise ((success, error) =>{
            con.query(selectQuery, value, (error, results, fields) => {
                if (error) throw(error);
                console.log("res = ", results);
                if ( results.length == 1)
                { 
                    var firstResult = results[0];
                    console.log('mdp: ' + firstResult['mdp']);
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