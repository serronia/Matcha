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
//si la db plante car une table est buger, utilise ca pour la table qui bug

  /*  var sql = "DROP TABLE `utilisateur`";
    con.query(sql, function (err, result) 
    {
      if (err) throw err;
      console.log("utilisateur deleted");
    });
  */  

    var sql = "CREATE TABLE IF NOT EXISTS utilisateur (id INT(255) not null auto_increment primary key,\
              nom VARCHAR(255) not null, prenom VARCHAR(255) not null, mail VARCHAR(255) not null UNIQUE,\
              mdp VARCHAR(255) not null, login VARCHAR(255) not null UNIQUE, naissance DATE,\
              age INT(255) NOT NULL, sexe BOOLEAN NOT NULL DEFAULT 1,\
              city VARCHAR(255), latitude DOUBLE(255, 25), longitude DOUBLE(255, 25),\
              last_connection DATETIME, actif BOOLEAN NOT NULL DEFAULT FALSE, \
              clef VARCHAR(64) NOT NULL DEFAULT '')";
    con.query(sql, function (err, result) 
    {
    if (err) throw err;
    console.log("[SQL][TABLE] \"utilsateur\" exist or created!");
    });

    var sql = "CREATE TABLE IF NOT EXISTS preference (id INT(255) not null auto_increment primary key, id_user INT(255) UNIQUE,\
              genre ENUM('hommme', 'femme') not null, orientation ENUM('homme', 'femme', 'bi') not null default 'bi',\
              bio VARCHAR(255), tag VARCHAR(255), FOREIGN KEY (id_user) REFERENCES utilisateur(id))";
    con.query(sql, function (err, result) 
    {
      if (err) throw err;
      console.log("[SQL][TABLE] \"preference\" exist or created!");
    });

    var sql = "CREATE TABLE IF NOT EXISTS photo (id INT(255) not null auto_increment primary key, id_user INT(255) UNIQUE,\
              photo_1 VARCHAR(255), photo_2 VARCHAR(255),\
              photo_3 VARCHAR(255), photo_4 VARCHAR(255), photo_5 VARCHAR(255),\
              FOREIGN KEY (id_user) REFERENCES utilisateur(id))";
    con.query(sql, function (err, result) 
    {
      if (err) throw err;
      console.log("[SQL][TABLE] \"photo\" exist or created!");
    });
    var sql = "CREATE TABLE IF NOT EXISTS likes (id INT(255) not null auto_increment primary key,\
               id_user_1 INT(255) not null, id_user_2 INT(255) not null)";
    con.query(sql, function (err, result) 
    {
      if (err) throw err;
      console.log("[SQL][TABLE] \"likes\" exist or created!");
    });
    var sql = "CREATE TABLE IF NOT EXISTS chat (id INT(255) not null auto_increment primary key,\
               id_user_1 INT(255) not null, id_user_2 INT(255) not null, id_echange INT(255) not null)";
    con.query(sql, function (err, result) 
    {
      if (err) throw err;
      console.log("[SQL][TABLE] \"chat\" exist or created!");
    });
    var sql = "CREATE TABLE IF NOT EXISTS echange (id INT(255) not null auto_increment primary key,\
               message VARCHAR(255) not null, date datetime not null, user_id INT(255) not null)";
    con.query(sql, function (err, result) 
    {
      if (err) throw err;
      console.log("[SQL][TABLE] \"echange\" exist or created!");
    });
    var sql = "CREATE TABLE IF NOT EXISTS tags (id INT(255) not null auto_increment primary key,\
               name VARCHAR(255) not null)";
    con.query(sql, function (err, result) 
    {
      if (err) throw err;
      console.log("[SQL][TABLE] \"tags\" exist or created!");
    });

    res.redirect('localhost:8080');
});


module.exports = router;