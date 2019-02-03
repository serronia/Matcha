var express = require('express');
var router = express.Router();
/*
var mysql = require('mysql');
var database_var = process.env.DB_NAME;
var con = mysql.createConnection(
    {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
    });
*/
var con = require('../db');



router.get('/db', function(req, res)
{
  console.log("first" + con + res);
    console.log("Connected!");
    var sql = "CREATE TABLE IF NOT EXISTS utilisateur (id INT(255) not null auto_increment primary key, nom VARCHAR(255) not null, prenom VARCHAR(255) not null, mail VARCHAR(255) not null, mdp VARCHAR(255) not null, id_photo INT(255) not null, login VARCHAR(255) not null, age INT(255) not null, id_preference INT(255) not null, last_connection DATETIME)";
    con.query(sql, function (err, result) 
    {
      if (err) throw err;
      console.log("OK!");
    });
    var sql = "CREATE TABLE IF NOT EXISTS preference (id INT(255) not null auto_increment primary key, genre ENUM('hommme', 'femme') not null, orientation ENUM('homme', 'femme', 'bi') not null, bio VARCHAR(255) not null, latitude DOUBLE(255, 25) not null, longitude DOUBLE(255, 25) not null, tag VARCHAR(255) not null)";
    con.query(sql, function (err, result) 
    {
      if (err) throw err;
      console.log("OK!");
    });
    res.redirect('localhost:8080');
});


module.exports = router;