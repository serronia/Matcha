var nodemailer = require('nodemailer');
var add_cle = require('../model/user');
const uuidv4 = require('uuid/v4')
const uuidv3 = require('uuid/v3')

module.exports={
    send: function(Reason, mailDest, login){
        var text_mail = "";
        var clef = "";

        if (Reason == "activation")
        {
            const UNI = uuidv4()
            var clef = uuidv3(login, UNI);
            add_cle.valid(login,clef, 0);
            text_mail = "Bienvenue sur Matcha,\n \
            Pour activer votre compte, veuillez cliquer sur le lien ci dessous\n \
            ou le copier/coller dans votre navigateur internet.\n\
            \n\n\
            http://localhost:8080/valid/"+ login + '/'+ clef+
            "\n\n\
            ---------------\n\
            Ceci est un mail automatique, Merci de ne pas y répondre.';";
        }
        else if (Reason == "reset")
        {
            const UNI = uuidv4()
            var clef = uuidv3(login, UNI);
            add_cle.valid(login,clef, 1);
            text_mail = "Bienvenue de nouveau sur Matcha,\
            Pour changer votre mot de passe cliquez sur le lien ci-dessous\n\
            ou le copier/coller dans votre navigateur internet.\n\
            \n\n\
            http://localhost:8080/reset/"+login+'/'+ clef+
            "\n\n\
            ---------------\
            Ceci est un mail automatique, Merci de ne pas y répondre.\n";

        }
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'matcha.auto@gmail.com',
                pass: 'jdarko4ever'
            }
        });

        var mailOptions = {
            from: 'Matcha@gmail.com',
            to: mailDest,
            subject: Reason,
            text: text_mail
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}
