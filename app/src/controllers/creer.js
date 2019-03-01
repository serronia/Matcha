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

function create_user(post) {
  mdp=post.mdp[0];
  create.user_exist(post.login, post.mail)
  .then (ret => {
    console.log(ret)
    if (ret == 1) {
      create.create_user(post.nom, post.prenom, mdp, post.naissance, post.login, post.mail);
      mail.send('activation', post.mail, post.login);
      console.log(post);
      return(1)
    }
    else (ret == 0)
    {
      return(0);
    };
  })

}

router.post('/create.html', function(request, response) {
    var mdp = request.body.mdp;
    var exist = "1";
    if (mdp[0] == mdp[1])
    {
      var regex =  new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");   
      if (regex.test(mdp[0])==true)
      {
        request.session.wrong = "";
        create_user(request.body).then(ret => {
            console.log("ret ="+ret);
            if (ret == 1)
            {
              console.log("naniii");
              request.session.mail = "Un mail de confirmation vient de vous etre envoyé";
              console.log(request.session.mail);
              response.redirect('/login');
            }
            else
            {
              console.log("louper");
              request.session.wrong = "l'adresse e-mail ou le login existe deja.";
              response.redirect('/creer');
            }
          }
        );
        console.log("exist");
        console.log(exist);
        /*if(exist)
        {
          request.session.mail = "Un mail de confirmation vient de vous etre envoyé";
          console.log(request.session.mail);
          response.redirect('/login');
        }
        else
        {
          request.session.wrong = "l'adresse e-mail ou le login existe deja.";
          response.redirect('/creer');
        }   */  
        
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