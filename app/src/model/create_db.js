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
  //con.connect(function(err) 
  //{
   // if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE IF NOT EXISTS customers (name VARCHAR(255), address VARCHAR(255))";

    con.query(sql, function (err, result) 
    {
      if (err) throw err;
      console.log("OK!");
    });
 // });
});



module.exports = router;