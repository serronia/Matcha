var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.sendFile('/usr/app/src/views/accueil.html');
});

module.exports = router;