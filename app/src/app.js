var cookieSession = require('cookie-session');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require("path");

app.use(express.static(path.join(__dirname, 'public')));
//app.use(cookieSession({login: 'none' }));

var router = express.Router();

router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))
  
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))


app.get("/user", function(req, res) {
    res.send(req.session.login);
});

var HomeControllers = require('./controllers/home');
var loginController = require('./controllers/login');
var ProfilControllers = require('./controllers/profil');
var CreerControllers = require('./controllers/creer');
var Install = require('./model/create_db');
var CmptControllers = require('./controllers/count');

app.use('/', Install);
app.use('/', HomeControllers); 
app.use('/login', loginController);
app.use('/profil', ProfilControllers);
app.use('/cmpt', CmptControllers);
app.use('/creer', CreerControllers);
 
/*app.post('/create.html', function(request, response) {
  var body = request.body.mail;
  console.log("p1=" + body );
  response.redirect('/');
});*/
app.listen(8080);