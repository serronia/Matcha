var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();
router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.get('/', function(req, res) {
    console.log("Getting user login")
    req.session.login = "NomUser";
    res.sendFile('/usr/app/src/views/login.html');
    console.log(req.session);
});

router.get('/wrong', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('mauvais mot de passe');
});
module.exports = router;