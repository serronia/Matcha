var express = require('express');
var cookieSession = require('cookie-session');
var router = express.Router();
var bodyParser = require("body-parser");
var rq_db = require('../model/rq_db');

router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function(req, res) {
    res.sendFile('/usr/app/src/views/profil.html');
});

router.post('/profil_modif.html', function(request, response)
{
    post = request.body;
    console.log("post = ", post)
    rq_db.update_pref(post.atti, post.bio, post.tag, request.session.login);
    request.session.mail = "Modifications enregistrées";
    response.redirect('/profil');

});

module.exports = router;