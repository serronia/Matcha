var express = require('express');
var app = express();
var http = require('http').Server(app);

var path = require("path");
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Vous êtes à l\'accueil');
});
app.get('/sous-sol', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Vous êtes dans la cave à vins, ces bouteilles sont à moi !');
});

app.get('/etage/1/chambre', function(req, res) {
    res.sendFile(__dirname + '/views/maison.html');
});

app.get('/lorette', function(req, res) {
    res.sendFile(__dirname + '/views/accueil.html');
});


app.listen(8080);