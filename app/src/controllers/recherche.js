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

module.exports = router;