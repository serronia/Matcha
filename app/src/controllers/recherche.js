var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var cookieSession = require('cookie-session');
var rq_db_recherche = require('../model/rq_db_recherche');

router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.get('/', function(req, res) {
    res.sendFile('/usr/app/src/views/recherche.html');
    req.session.wrong = "";
    req.session.mail = "";
});

router.get('/mini_user', function(req, res) {
    rq_db_recherche.mini_user(req.session.login, req.session.trier, req.session.filtrer)
    .then(tab => {
      if(tab)
      {
        res.send(tab);
      }
      else
      {
        res.send("Une erreur s'est produite, veuillez contactez l'admin")
      }
      
    })
});

router.post("/trier.html", function(req, res) {
  post = req.body;
  if(post.submit == "Trier")
  {
      req.session.trier=post.tri;
      res.redirect('/recherche');
      
  }
  else
  {
      req.session.trier="";
      res.redirect('/recherche');
  }
});

router.post("/filtrer.html", function(req, res) {
  post = req.body;
  console.log("post = ", post)
  if(post.submit == "Filtrer")
  {
    if(post.genre == "genre_femme")
      sexe = 1;
    else if(post.genre == "genre_homme")
      sexe = 0;
    else
      sexe = 3;

      req.session.filtrer={"agemin" :post.agemin, "agemax" : post.agemax, "kmmin" :post.kmmin, "kmmax" : post.kmmax, "tag" : post.tag, "pop":post.pop, "sexe":sexe};
      console.log("filter ---  = ", req.session.filtrer);
      res.redirect('/recherche');
  }
  else
  {
      req.session.filtrer="";
      res.redirect('/recherche');
  }
});

module.exports = router;