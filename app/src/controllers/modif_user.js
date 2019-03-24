var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
var rq_db = require('../model/rq_db');

router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.get('/', function(req, res) {
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
    console.log(post);
    rq_db.modif_user(req.session.login, post.login, post.mail, post.genre, post.nom, post.prenom, post.adr);
    if (post.mdp_old && post.mdp)
    {
        rq_db.get_mdp(req.session.login).then(ret => {
            console.log("post.mdp_old = ", post.mdp_old, "mdp_db= ", mdp_db);
            mdp_db = ret[0]['mdp'];
            if(bcrypt.compareSync(post.mdp_old, mdp_db)) 
            {
                if (mdp[0] == mdp[1])
                {
                    var regex =  new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");   
                    if (regex.test(mdp[0])==true)
                    {
                        rq_db.updade_mdp(req.session.login, post.mdp[0]);
                    }
                }
                else 
                {
                    request.session.wrong = "Mots de passe differents";
                    res.redirect('/modif_user');
                }
                request.session.wrong = "";
            } 
            else 
            {
                request.session.wrong = "Mauvais mot de passe";
                res.redirect('/modif_user');
            }
        })
    }
    if (req.sessionlogin != post.login)
    {
        res.redirect('/deco');
    }
    res.redirect('/profil');
  });

module.exports = router;