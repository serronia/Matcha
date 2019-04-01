var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();
var rq_db2 = require('../model/rq_db2');

router.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))


router.get('/', function(request, response){
  rq_db2.ban(request.session.login, request.session.other_user);
    response.redirect('/');
  });

router.get('/fake', function(request, response){
    rq_db2.ban(request.session.login, request.session.other_user);
    rq_db2.fake(request.session.login, request.session.other_user);
    response.redirect('/');
});
    
module.exports = router;