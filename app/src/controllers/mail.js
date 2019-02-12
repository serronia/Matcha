var nodemailer = require('nodemailer');
module.exports={
    send: function(Reason, mailDest){

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
            text: 'That was easy!'
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
