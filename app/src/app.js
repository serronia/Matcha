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

app.get("/wrong", function(req, res) {
  res.send(req.session.wrong);
});

app.get("/mail_alert", function(req, res) {
  console.log("mail dans app js : "+req.session.mail);
  res.send(req.session.mail);
});

var HomeControllers = require('./controllers/home');
var loginController = require('./controllers/login');
var ProfilControllers = require('./controllers/profil');
var CreerControllers = require('./controllers/creer');
var Install = require('./model/create_db');
var CmptControllers = require('./controllers/count');
var Fake_User = require('./model/fake_user');
var ValidatorController = require('./controllers/valid');



app.use('/', Install);
app.use('/', Fake_User);
app.use('/', HomeControllers);
app.use('/valid', ValidatorController);
app.use('/login', loginController);
app.use('/profil', ProfilControllers);
app.use('/cmpt', CmptControllers);
app.use('/creer', CreerControllers);
 
app.listen(8080);