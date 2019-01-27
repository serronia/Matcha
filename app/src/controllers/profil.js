var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write('"' + tot +'"');
    res.sendFile('/usr/app/src/views/part1.html');
    res.sendFile('/usr/app/src/views/part2.html');
    res.sendFile('/usr/app/src/views/part3.html');
});

module.exports = router;