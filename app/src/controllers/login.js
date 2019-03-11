var cookieSession = require('cookie-session')
var express = require('express');
var bodyParser = require("body-parser");
var router = express.Router();
const bcrypt = require('bcrypt');
var db = require('../model/rq_db');

router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.get('/', function(req, res) {
    res.sendFile('/usr/app/src/views/login.html');
});


router.post('/logintest.html', function(request, response)
{
    console.log("before");

    post = request.body;
    db.get_mdp(post.login).then(ret => {
        console.log('ret = ',ret)
        if (ret) 
        {
            mdp = ret[0]['mdp'];
            actif = ret[0]['actif'];
            if (actif)
            {
                if(bcrypt.compareSync(post.passwd, mdp)) 
                {
                    console.log('match OK :)')
                    console.log(request.session);
                    request.session.login = post.login;
                    request.session.wrong = "";
                    response.redirect('/');
                } 
                else 
                {
                    request.session.wrong = "Mauvais mot de passe";
                    console.log('match KO :\'(')
                    response.redirect('/login');
                }
            }
            else
            {
                request.session.wrong = "Votre compte n'est pas actif";
                console.log('actif KO :\'(')
                response.redirect('/login');
            }
            
        }
        else
        {
            request.session.wrong = "Login incorrect";
            response.redirect('/login');
        };
      })
});

module.exports = router;