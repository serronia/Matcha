var cookieSession = require('cookie-session')
var express = require('express')
var router = express.Router();
function Connection(){
    router.get('/', function(req, res) {
            if(req.session.login)
            {
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write("<div>"+req.session.login+"</div>");
                return (req.session.login);
            }
            else
            {
                return ("Profil");
            }
        
    });
}
module.exports = router;