var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();
var db = require('../model/user');

router.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))


router.get('/:p1/:p2', function(request, response){
    var login = request.params.p1; 
    var cle = request.params.p2;
    db.get_cle_db(login)
    .then (ret => {
      if (ret)
      {
        if(ret[0]["clef"] == cle)
        {
          request.session.mail = "Votre compte est bien activé";
          db.valid(login, "",1);
          response.redirect('/login');
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
  

module.exports = router;