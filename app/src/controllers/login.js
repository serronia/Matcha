var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Page de log--------------- avec possiblité de creéer un compte');
});

router.get('/etage/1/chambre', function(req, res) {
    res.sendFile('/usr/app/src/views/maison.html');
});

module.exports = router;