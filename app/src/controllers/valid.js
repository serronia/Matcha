var express = require('express');
var router = express.Router();
console.log("dans valid contr");

router.get('/', function(request, response) {
    response.setHeader('Content-Type', 'text/plain');
    response.send('bienvenur valid');
    /*console.log("naniiiiii ");
    console.log("location machin : "+location.href);
    console.log("req url : "+request.url);*/
    //console.log(p1);
  });

module.exports = router;