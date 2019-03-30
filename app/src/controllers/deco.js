var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();
var rq_db2 = require('../model/rq_db2');


router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.get('/', function(req, res) {
    rq_db2.add_date_deco(req.session.login, true);
    req.session.login = "NomUser";
    res.redirect('/login');
});


module.exports = router;