var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();
router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.get('/', function(req, res) {
    res.sendFile('/usr/app/src/views/creer.html');
    req.session.login = "nomUser";
    console.log(req.session);
});

module.exports = router;