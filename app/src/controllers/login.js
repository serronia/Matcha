var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();

router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.get('/', function(req, res) {
    req.session.login = "NomUser";
    res.sendFile('/usr/app/src/views/login.html');
    console.log(req.session);
});

router.get('/wrong', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('mauvais mot de passe');
});


router.post('/logintest.html', function(request, response) {
    post = request.body;
    console.log("post = ",post);
    /*if(bcrypt.compareSync('somePassword', hash)) 
    {
        // Passwords match
    } else 
    {
        // Passwords don't match
    }*/
});

module.exports = router;