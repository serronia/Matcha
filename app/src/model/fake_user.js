var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
const util = require('util');
var create = require('./user');

router.get('/fake_user', function(req, res)
{
var j = 1;
console.log("start");
fetch('https://randomuser.me/api/?results='+j+'&nat=fr')
.then((res) => res.json())
.then((async data => {
   
    var i = 0;
    while (i < j)
    {
    console.log(data["results"][i]["picture"]["large"]);
    loca = create.random_city();
    var user = data["results"][i];
    user_date = user["dob"]["date"].split('T');
    var age = create.majority(user_date[0]);
    var sexe;
    if(user["gender"] == "female"){sexe=1;console.log("------------------  female")}else{sexe=0;console.log("--------------------  male")};
    console.log("sexe = ", sexe)
    if (age)
    {
        console.log(user)
        console.log(user["picture"])

        if (create.user_exist(user["login"]["username"], user["email"]))
        {
            create.create_user(user["name"]["last"], user["name"]["first"], user["login"]["sha256"], user_date[0], user["login"]["username"], user["email"], sexe);
        create.fake_localisation(user["login"]["username"], user["login"]["sha256"], loca[0], loca[2], loca[3])
        create.add_picture(user["login"]["username"], user["picture"]["large"], 1);
        create.add_picture(user["login"]["username"], user["picture"]["medium"], 2);
        create.add_picture(user["login"]["username"], user["picture"]["thumbnail"], 3);        
/*   create.nb_pic(user["login"]["username"]).then(
            i => {
                console.log("suite a la fonction, ivaut bien = ");
                console.log(i);
            });
 */       
        }
        //  console.log(user["dob"]["date"]);
        console.log("user a ete creer");
        i++;
    }
        
    }
}))
res.redirect('localhost:8080');
});

module.exports = router;