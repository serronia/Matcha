var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();
var rq_db3 = require('../model/rq_db_recherche');
var rq_db = require('../model/rq_db');


router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.get('/', function(req, res) {
    if((req.session.login == "NomUser") || (!req.session.login))
      res.redirect('/login');
    else
      res.sendFile('/usr/app/src/views/matchs.html');
});

router.get('/matchs_with_me', function(req, res) {
    rq_db.profil_user(req.session.login)
    .then(profil =>
    {
        if(profil)
        {
            user_id1 = profil[0].id;
            if(profil)
            {
                rq_db3.matchs_with_me(user_id1).then(
                    match =>{
                        res.send(match);
                        res.redirect('/matchs');
                    });
            }
            else
            {
                res.send("erreur");
                res.redirect('/matchs');
            }
        }
        else
        {
            res.send("erreur");
            res.redirect('/matchs');
        }
    });
});


module.exports = router;