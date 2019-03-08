var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();


router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.get('/', function(req, res) {
    req.session.login = "NomUser";
    res.redirect('/login');
});


module.exports = router;