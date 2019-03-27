var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();
var rq_db = require('../model/rq_db');
var rq_db2 = require('../model/rq_db2');

router.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))


router.get('/', function(request, response){
  rq_db2.like(request.session.login, request.session.other_user)
    response.redirect('/profil/login/'+request.session.other_user);
  });

router.get('/is_liked', function(request, response){
  rq_db.profil_user(request.session.login)
  .then(profil =>
    {
      if(profil)
      {
          user_id1 = profil[0].id;
          rq_db.profil_user(request.session.other_user)
          .then(profil =>
          {
              if(profil)
              {
                user_id2 = profil[0].id;
                rq_db2.is_liked(user_id1, user_id2)
                    .then(is_liked => {
                      if(is_liked)
                      {
                        response.send("1");
                      }
                      else
                      {
                        response.send("0")
                      }
                  });
                }
                else
                {
                  response.send("Une erreur s'est produite, veuillez contactez l'admin")
                }
            })
        }
        else
        {
            response.send("Une erreur s'est produite, veuillez contactez l'admin")
        }
    });
  });

  router.get('/unlike', function(request, response){
    rq_db.profil_user(request.session.login)
    .then(profil =>
      {
        if(profil)
        {
            user_id1 = profil[0].id;
            rq_db.profil_user(request.session.other_user)
            .then(profil =>
            {
                if(profil)
                {
                  user_id2 = profil[0].id;
                  rq_db2.unlike(user_id1, user_id2)
                      .then(unlike => {response.redirect("/profil/login/"+request.session.other_user)
                    });
                  }
                  else
                  {
                    response.send("Une erreur s'est produite, veuillez contactez l'admin")
                  }
              })
          }
          else
          {
              response.send("Une erreur s'est produite, veuillez contactez l'admin")
          }
      });
    });
module.exports = router;