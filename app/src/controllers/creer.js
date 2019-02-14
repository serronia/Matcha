var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var create = require('../model/user');
var mail = require('./mail');
const bcrypt = require('bcrypt');

router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.get('/', function(req, res) {
    res.sendFile('/usr/app/src/views/creer.html');
});

function create_user(post)
{
  const mdp = bcrypt.hashSync(post.mdp[0], 10);
  create.create_user(post.nom, post.prenom, mdp, post.naissance, post.login, post.mail);
  mail.send('activation', post.mail, post.login);
  console.log(post);
}

router.post('/create.html', function(request, response) {
    var mdp = request.body.mdp;
    if (mdp[0] == mdp[1])
    {
      var regex =  new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");   
      if (regex.test(mdp[0])==true)
      {
        request.session.wrong = "";
        create_user(request.body);
        request.session.mail = "Un mail de confirmation vient de vous etre envoyé";
        console.log(request.session.mail);
        response.redirect('/login');
      }
      else
      {
        request.session.wrong = "mot de passe invalide";
        response.redirect('/creer');
      }
    }
    else
    {
      request.session.wrong = "mots de passe different";
      response.redirect('/creer');
    }
  });

module.exports = router;