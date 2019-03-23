var cookieSession = require('cookie-session');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require("path");
var rq_db = require('./model/rq_db');

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
  res.send(req.session.mail);
});


app.get("/mini_user", function(req, res) {
  rq_db.mini_user(req.session.login)
    .then(tab => {
      if(tab)
      {
        console.log("tab dans app.js = ", tab);
        res.send(tab);
      }
      else
      {
        res.send("Une erreur s'est produite, veuillez contactez l'admin")
      }
      
    })
});



var HomeControllers = require('./controllers/home');
var loginController = require('./controllers/login');
var ProfilControllers = require('./controllers/profil');
var CreerControllers = require('./controllers/creer');
var Install = require('./model/create_db');
var Fake_User = require('./model/fake_user');
var ValidatorController = require('./controllers/valid');
var DecoController = require('./controllers/deco');




app.use('/', Fake_User);
app.use('/', HomeControllers);
app.use('/', Install);
app.use('/valid', ValidatorController);
app.use('/login', loginController);
app.use('/profil', ProfilControllers);
app.use('/creer', CreerControllers);
app.use('/deco', DecoController);
 
app.listen(8080);