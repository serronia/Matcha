var express = require('express');
var cookieSession = require('cookie-session');
var router = express.Router();
var bodyParser = require("body-parser");
var rq_db = require('../model/rq_db');

router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function(req, res) {
    res.sendFile('/usr/app/src/views/profil.html');
});

router.post('/profil_modif.html', function(request, response)
{
    post = request.body;
    console.log("post = ", post)
    rq_db.update_pref(post.atti, post.bio, post.tag, request.session.login);
    request.session.mail = "Modifications enregistrées";
    response.redirect('/profil');

});

router.get('/login/:p1', function(request, response){
    console.log("p1 = ", request.params.p1);
    request.session.other_user = request.params.p1; 
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
          res.send("/default-user-image.png")
        }
      })
  });

module.exports = router;