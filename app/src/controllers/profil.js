var express = require('express');
var cookieSession = require('cookie-session');
var router = express.Router();
var bodyParser = require("body-parser");
var rq_db = require('../model/rq_db');
var rq_db2 = require('../model/rq_db2');

router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function(req, res) {
  if((req.session.login == "NomUser") || (!req.session.login))
    res.redirect('/login');
  else
    res.sendFile('/usr/app/src/views/profil.html');
});

router.post('/profil_modif.html', function(request, response)
{
    post = request.body;
    rq_db.update_pref(post.atti, post.bio, post.tag, request.session.login);
    request.session.mail = "Modifications enregistrées";
    response.redirect('/profil');

});

router.get('/login/:p1', function(request, response){
    request.session.other_user = request.params.p1; 
    rq_db2.add_view(request.session.login, request.session.other_user);
    response.sendFile('/usr/app/src/views/profil_other.html');
  });

router.get('/get_profil', function(request, response){
    var login = request.session.other_user;
    rq_db.profil_user(login)
        .then(profil =>
        {
            if(profil)
            {
                response.send(profil);
            }
            else
            {
                response.send("Une erreur s'est produite, veuillez contactez l'admin")
            }
        })
  });

router.get("/user_pref", function(req, res) {
    rq_db.pref_user(req.session.other_user)
      .then(pref => {
        if(pref)
        {
          res.send(pref);
        }
        else
        {
          res.send("Une erreur s'est produite, veuillez contactez l'admin")
        }
      })
  });

router.get("/user_photo", function(req, res) {
    rq_db.photo_user(req.session.other_user)
      .then(photo => {
        if(photo)
        {
          res.send(photo);
        }
        else
        {
          res.send("erreur")
        }
      })
  });

  router.get("/user_detail", function(req, res) {
    rq_db2.user_detail(req.session.other_user)
      .then(detail => {
        if(detail)
        {
          pop = detail[0].nb_vue + detail[0].nb_like*15;
          rq_db2.add_pop(pop, detail[0].id_user);
          res.send(detail[0]);
        }
        else
        {
          res.send("erreur")
        }
      })
  });

  router.get("/users_vue", function(req, res) {
    rq_db2.users_vue(req.session.login)
      .then(vues => {
        if(vues)
        {
          res.send(vues);
        }
        else
        {
          res.send("")
        }
      })
  });

  router.get("/users_like", function(req, res) {
    rq_db2.users_liked(req.session.login)
      .then(like => {
        if(like)
        {
          res.send(like);
        }
        else
        {
          res.send("")
        }
      })
  });
  
  router.get("/current_user_detail", function(req, res) {
    rq_db2.user_detail(req.session.login)
      .then(detail => {
        if(detail)
        {
          pop = detail[0].nb_vue + detail[0].nb_like*15;
          rq_db2.add_pop(pop, detail[0].id_user);
          res.send(detail[0]);
        }
        else
        {
          res.send("")
        }
      })
  });
  
  

module.exports = router;