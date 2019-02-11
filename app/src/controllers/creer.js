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
    req.session.login = "nomUser";
    console.log(req.session);
});

router.post('/create.html', function(request, response) {
    var mail = request.body.mail;
    console.log("p1=" + mail);
    response.redirect('/');
  });

module.exports = router;