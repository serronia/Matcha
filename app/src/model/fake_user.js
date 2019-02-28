var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
const util = require('util');
var create = require('./user');

router.get('/fake_user', function(req, res)
{
var j = 25;
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

    if (create.majority(user_date[0]))
        if (create.user_exist(user["login"]["username"], user["email"]))
            create.create_user(user["name"]["last"], user["name"]["first"], user["login"]["sha256"], user_date[0], user["login"]["username"], user["email"]);
        create.fake_localisation(user["login"]["username"], user["login"]["sha256"], loca[0], loca[2], loca[3])
        //  console.log(user["dob"]["date"]);
    console.log("user a ete creer");
    i++;
    }
}))
res.redirect('localhost:8080');
});

module.exports = router;