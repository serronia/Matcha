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
        res.send(tab);
      }
      else
      {
        res.send("Une erreur s'est produite, veuillez contactez l'admin")
      }
      
    })
});

app.get("/user_profil", function(req, res) {
  rq_db.profil_user(req.session.login)
    .then(profil => {
      if(profil)
      {
        res.send(profil);
      }
      else
      {
        res.send("Une erreur s'est produite, veuillez contactez l'admin")
      }
    })
});

app.get("/user_pref", function(req, res) {
  rq_db.pref_user(req.session.login)
    .then(pref => {
      if(pref)
      {
        res.send(pref);
      }
      else
      {
        res.send("Une erreur s'est produite, veuillez contactez l'admin")
      }
    })
});


app.get("/user_photo", function(req, res) {
  rq_db.photo_user(req.session.login)
    .then(photo => {
      if(photo)
      {
        res.send(photo);
      }
      else
      {
        res.send("/default-user-image.png")
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
var Modif_UserController = require('./controllers/modif_user');
var ResetController = require('./controllers/reset');



app.use('/', Fake_User);
app.use('/', HomeControllers);
app.use('/', Install);
app.use('/valid', ValidatorController);
app.use('/login', loginController);
app.use('/profil', ProfilControllers);
app.use('/creer', CreerControllers);
app.use('/deco', DecoController);
app.use('/modif_user', Modif_UserController);
app.use('/reset', ResetController);
 
app.listen(8080);