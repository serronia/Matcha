var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
const util = require('util');
var create = require('./user');

router.get('/fake_user', function(req, res)
{
console.log("start");
fetch('https://randomuser.me/api/?results=10')
.then((res) => res.json())
.then((data => {
    let output = 'login';
    console.log(data);
    try{
    var text = JSON.stringify(data);
    console.log("pas err" + text);
    }
    catch(err){
        console.log("err" + err);
    }
    var i = 0;
    while (i < 3)
    {
    console.log(data["results"][i]);
    var user = data["results"][i];
    create.create_user(user["name"]["last"], user["name"]["first"], user["login"]["sha256"], user["dob"]["date"], user["login"]["username"], user["email"]);
    setTimeout(function(i){console.log("waitin"); i++;}, 1000);
    console.log("user a ete creer");
    
    }
}))


//console.log(util.inspect("go" + request + "over", false, null, true /* enable colors */));
//console.log("come on" + request + "over");

res.redirect('localhost:8080');
});

module.exports = router;