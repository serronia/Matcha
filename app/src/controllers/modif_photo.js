var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const fs = require('fs');
var rq_db2 = require('../model/rq_db2');
var formidable = require('formidable');

router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.get('/', function(req, res) {
    res.sendFile('/usr/app/src/views/modif_photo.html');
});

router.post('/modif.html',function(req, res) {
    console.log("body = ",req.body);
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.path;
        console.log("old path = ", oldpath);
        var photo = fs.readFileSync(oldpath);
        var img = [["data:image/png;base64," +  Buffer.from(photo).toString('base64')]];
        console.log("photo -- 64 = ", img);
    });
    /*var photo = fs.readFileSync(path);
    var img = [["data:image/png;base64," +  Buffer.from(photo).toString('base64')]];
    console.log("hpoto -- 64 = ", img);
    //user.add_image; + penser nb pic !!*/
});

module.exports = router;