var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
var rq_db = require('../model/rq_db');
var create = require('../model/user');

router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.get('/', function(req, res) {
    if((req.session.login == "NomUser") || (!req.session.login))
      res.redirect('/login');
    else
      res.sendFile('/usr/app/src/views/modif_user.html');
  });

router.get("/auto_compl", function(req, res) {
    rq_db.profil_user(req.session.login)
      .then(profil => {
        if(profil)
        {
          res.send(profil);
        }
        else
        {
          res.send("Une erreur s'est produite, veuillez contactez l'admin")
        }
      })
  });

router.post("/modif.html", function(req, res) {
    post = req.body;
    create.user_exist_modif(req.session.login, post.login, post.mail)
    .then (ret => {
      if (ret == 1)
      {
        rq_db.modif_user(req.session.login, post.login, post.mail, post.genre, post.nom, post.prenom, post.adr, post.arr);
        rq_db.modif_user_tag(req.session.login, post.login);
        if (post.mdp_old && post.mdp)
        {
            rq_db.get_mdp(req.session.login)
            .then(ret => {
                mdp_db = ret[0]['mdp'];
                if(bcrypt.compareSync(post.mdp_old, mdp_db)) 
                {
                    if (post.mdp[0] == post.mdp[1])
                    {
                        var regex =  new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W || '_').*$", "g");   
                        if (regex.test(post.mdp[0])==true)
                        {
                            let hash = bcrypt.hashSync(post.mdp[0], 10);
                            rq_db.updade_mdp(req.session.login, hash);
                            req.session.wrong = "";
                            req.session.mail="Modification enregistrés. Veuillez vous re-connecter";
                            res.redirect('/deco');
                        }
                        else
                        {
                            req.session.wrong = "Mot de passe insufisant.";
                            res.redirect('/modif_user');
                        }
                    }
                    else 
                    {
                        req.session.wrong = "Mots de passe differents";
                        res.redirect('/modif_user');
                    }
                } 
                else 
                {
                    req.session.wrong = "Mauvais mot de passe";
                    res.redirect('/modif_user');
                }
            })
        }
        else
        {
          if (req.session.login != post.login)
          {
              res.redirect('/deco');
          }
          else
          {
            req.session.wrong = "";
            req.session.mail="Modification enregistrés.";
            res.redirect('/profil');
          }
        }
      }
      else
      {
        req.session.wrong = "l'adresse e-mail ou le login existe deja.";
        res.redirect('/modif_user');
      }
    });
  });

module.exports = router;