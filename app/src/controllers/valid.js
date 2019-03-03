var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();
console.log("dans valid contr");
var db = require('../model/user');

router.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))


router.get('/:p1/:p2', function(request, response) {
    var login = request.params.p1; 
    var cle = request.params.p2;
    console.log("login = ",login);
    console.log("cle = ",cle);
    db.get_cle_db(login)
    .then (ret => {
      if (ret)
      {
        console.log("res=  ",ret);
        console.log("res[0][clef]=  ",ret[0]["clef"]);
        if(ret[0]["clef"] == cle)
        {
          request.session.mail = "Votre compte est bien activé";
          db.valid(login, "",1);
        }
        else
        {
          request.session.mail = "Un probleme est survenu, contactez l'administrateur";
        }
        return(1)
      }
      else
      {
        request.session.mail = "Un probleme est survenu, contactez l'administrateur";
        return(0);
      };
    })
    response.redirect('/login');
  });
  

module.exports = router;