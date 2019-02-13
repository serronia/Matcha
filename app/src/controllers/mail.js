var nodemailer = require('nodemailer');
module.exports={
    send: function(Reason, mailDest, login){
        var text_mail = "";
        var clef = "";

        if (Reason == "activation")
        {
            clef = "123";
            text_mail = "Bienvenue sur Matcha,\n \
            Pour activer votre compte, veuillez cliquer sur le lien ci dessous\n \
            ou le copier/coller dans votre navigateur internet.\n\
            \n\n\
            http://localhost:8008/valid?log="+ login + '&cle='+ clef+
            "\n\n\
            ---------------\n\
            Ceci est un mail automatique, Merci de ne pas y répondre.';";
        }
        else
        {
            text_mail = "Bienvenue sur Matcha,\
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
