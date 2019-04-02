var cookieSession = require('cookie-session')
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const fs = require('fs');
var rq_db3 = require('../model/user');
var formidable = require('formidable');

router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

router.get('/', function(req, res) {
    if((req.session.login == "NomUser") || (!req.session.login))
      res.redirect('/login');
    else
      res.sendFile('/usr/app/src/views/modif_photo.html');
});

router.post('/modif.html',function(req, res) {
    var form = new formidable.IncomingForm();
    var sizeLimitBytes = 2999999;
    form.parse(req, function (err, fields, files) {
        if (form.bytesReceived > sizeLimitBytes)
        {
            req.session.wrong = "L'image est trop grosse, veuillez en choisir une autre";
            res.redirect('/modif_photo');
        }
        else
        {
            if(files.filetoupload.type != "image/png" && files.filetoupload.type != "image/jpeg")
            {
                req.session.wrong = "Veuillez choisir une image jpg ou png";
                res.redirect('/modif_photo');
            }
            else if(!files.filetoupload._writeStream._writableState.needDrain)
            {
                req.session.wrong = "Veuillez upload une image";
                res.redirect('/modif_photo');
            }
            else
            {
                var oldpath = files.filetoupload.path;
                var photo = fs.readFileSync(oldpath);
                var img = "data:image/png;base64," +  Buffer.from(photo).toString('base64');
                rq_db3.nb_pic(req.session.login).then(
                    nb_photo =>{
                        rq_db3.add_picture(req.session.login, img, nb_photo).then(
                            ret => {
                                req.session.wrong = "";
                                res.redirect('/modif_photo');
                            }
                        )
                    }
                )
            }
            
        }
    })
});

module.exports = router;