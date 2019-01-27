/*var cookieSession = require('cookie-session')
var express = require('express')

var app = express()

app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.get('/', function (req, res, next) {
  // Update views
  req.session.views = (req.session.views || 0) + 1

  // Write response
  res.end(req.session.views + ' views')
})

app.listen(3000)*/

var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
    res.sendFile('/usr/app/src/views/accueil.html');
});

module.exports = router;