var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.sendFile('/usr/app/src/views/login.html');
});

router.get('/wrong', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('mauvais mot de passe');
});

module.exports = router;