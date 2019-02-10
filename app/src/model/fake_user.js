var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
const util = require('util');
var create = require('./user');

function sleep(ms){
    return new Promise (resolve => setTimeout(resolve, ms));
}



router.get('/fake_user', function(req, res)
{
var j = 1100;
console.log("start");
fetch('https://randomuser.me/api/?results='+j+'&nat=fr')
.then((res) => res.json())
.then((async data => {
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
    while (i < j)
    {
    console.log(data["results"][i]);
    var user = data["results"][i];
    create.create_user(user["name"]["last"], user["name"]["first"], user["login"]["sha256"], user["dob"]["date"], user["login"]["username"], user["email"]);
    console.log("waitin");
    await sleep(2500);
    console.log("2 sec after");
    console.log("user a ete creer");
    i++;
    }
}))


//console.log(util.inspect("go" + request + "over", false, null, true /* enable colors */));
//console.log("come on" + request + "over");

res.redirect('localhost:8080');
});

module.exports = router;