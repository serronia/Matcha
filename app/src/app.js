var cookieSession = require('cookie-session')
var express = require('express');
var app = express();
var cookieSession = require('cookie-session')
var http = require('http').Server(app);
var path = require("path");
app.use(express.static(path.join(__dirname, 'public')));



var HomeControllers = require('./controllers/home');
var loginController = require('./controllers/login');
var ProfilControllers = require('./controllers/profil');
var Install = require('./model/create_db');
var CmptControllers = require('./controllers/count');

app.use('/', Install);
app.use('/', HomeControllers);
app.use('/login', loginController);
app.use('/profil', ProfilControllers);
app.use('/cmpt', CmptControllers);




app.listen(8080);