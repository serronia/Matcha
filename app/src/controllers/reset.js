var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var rq_db = require('../model/rq_db');
var mail = require('./mail');
var db = require('../model/user');
const bcrypt = require('bcrypt');

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function(req, res) {
    res.sendFile('/usr/app/src/views/reset.html');
});

router.get('/:p1/:p2', function(request, response){
    var login = request.params.p1; 
    var cle = request.params.p2;
    db.get_cle_db(login)
    .then (ret => {
      if (ret)
      {
        if(ret[0]["clef"] == cle)
        {
          db.valid(login, "",1);
          request.session.reset = login;
          response.redirect('/reset/new');
        }
        else
        {
          request.session.mail = "Un probleme est survenu, contactez l'administrateur";
          response.redirect('/login');
        }
        return(1)
      }
      else
      {
        request.session.mail = "Un probleme est survenu, contactez l'administrateur";
        response.redirect('/login');
        return(0);
      };
    })
  });

router.post('/env', function(request, response)
{
    post = request.body;
    console.log("post = ", post)
    rq_db.verif_mail(post.mail, post.login).then(ok => {
        if(ok)
        {
            mail.send('reset', post.mail, post.login);
            request.session.mail = "Un mail de reset vient de vous etre envoyé";
            request.session.wrong = "";
            response.redirect('/reset');
        }
        else
        {
            request.session.mail = "";
            request.session.wrong = "L'e-mail et le login ne correspondent pas.";
            response.redirect('/reset');
        }
    })
});

router.get('/new', function(request, response){
    request.session.mail = "";
    request.session.wrong = "";
    response.sendFile('/usr/app/src/views/reset_new.html');
  });


  router.post('/new.html', function(request, response)
  {
    post = request.body;
    console.log("post = ", post);
    if (post.mdp[0] == post.mdp[1])
    {
        var regex =  new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");   
        if (regex.test(post.mdp[0])==true)
        {
            request.session.wrong = "";
            let hash = bcrypt.hashSync(post.mdp[0], 10);
            rq_db.updade_mdp(request.session.reset, hash);
            response.redirect('/login');
        }
    }
  });



module.exports = router;