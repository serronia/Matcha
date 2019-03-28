
var cookieSession = require('cookie-session')
var express = require('express')
var router = express.Router();
var app = express()

router.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

router.get('/', function (req, res, next) {
  // Update views
  req.session.views = (req.session.views || 0) + 1;
  console.log(req.session);

  // Write response
  res.end(req.session.views + ' views')
  console.log("loliol");
})


module.exports = router;