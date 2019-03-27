var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var cookieSession = require('cookie-session');


router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.get('/', function(req, res) {
    res.sendFile('/usr/app/src/views/accueil.html');
    req.session.wrong = "";
    req.session.mail = "";
});

router.post("/trier.html", function(req, res) {
    post = req.body;
    if(post.submit == "Trier")
    {
        req.session.trier=post.tri;
        res.redirect('/');
        
    }
    else
    {
        req.session.trier="";
        res.redirect('/');
    }
  });

router.post("/filtrer.html", function(req, res) {
    post = req.body;
    console.log("post = ", post)
    if(post.submit == "Filtrer")
    {
        req.session.filtrer={"agemin" :post.agemin, "agemax" : post.agemax, "kmmin" :post.kmmin, "kmmax" : post.kmmax, "tag" : post.tag};
        console.log("filter ---  = ", req.session.filtrer);
        res.redirect('/');
    }
    else
    {
        req.session.filtrer="";
        res.redirect('/');
    }
  });

module.exports = router;