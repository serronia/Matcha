var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
/*var expresss = require('express');
var app = express();*/

require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
var maison = require('./views/maison.html');


var server = http.createServer(function(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  var page = url.parse(req.url).pathname;
  console.log(page);
  res.writeHead(200, {"Content-Type": "text/html"});
  res.write('<!DOCTYPE html>'+
    '<html>'+
    '    <head>'+
    '        <meta charset="utf-8" />'+
    '        <title>Ma page Node.js !</title>'+
    '        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">'+
    '        <link rel="stylesheet" href="bla.css">'+
    '    </head>'+ 
    '    <body style="display: flex;">');
  if (page == '/')
  {
    res.write('<p>Vous êtes à l\'accueil, que puis-je pour vous ?<p>');
  }
  else if (page == '/sous-sol')
  {
      res.write('<p>Vous êtes dans la cave à vins, ces bouteilles sont à moi !<p>');
  }
  else if (page == '/etage/1/chambre')
  {
      res.write('<p>Hé ho, c\'est privé ici !<p>');
      var params = querystring.parse(url.parse(req.url).query);
      if ('prenom' in params && 'nom' in params) {
          res.write('Vous vous appelez ' + params['prenom'] + ' ' + params['nom']);
      }
      else {
          res.write('Vous devez bien avoir un prénom et un nom, non ?');
      }
  }
  else if (page == '/lorette')
  {
      res.write(maison);
      //res.sendFile('./views/maison.html');
  }
  else
  {
    res.write('<p style="color: red;">404 erreur page not found</p>');
  }
  res.write('</body>'+
'</html>');
  res.end();
});
server.listen(8080);
