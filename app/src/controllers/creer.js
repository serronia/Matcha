var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.get('/', function(req, res) {
    res.sendFile('/usr/app/src/views/creer.html');
    /*req.session.login = "nomUser";
    console.log(req.session);*/
});

router.post('/create.html', function(request, response) {
    var mdp = request.body.mdp;
    console.log("mdp=" + mdp[0]);
    console.log("mdp2=" + mdp[1]);
    if (mdp[0] == mdp[1])
    {
      var regex =  new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
      console.log(regex.test(mdp));
      if (regex.test(mdp))
      {
        request.session.wrong = "";
        response.redirect('/');
      }
      else
      {
        request.session.wrong = "mot de passe invalide";
        console.log(request.session);
        response.redirect('/creer');
      }
    }
    else
    {
      request.session.wrong = "mots de passe different";
      console.log(request.session);
      response.redirect('/creer');
    }
  });

module.exports = router;