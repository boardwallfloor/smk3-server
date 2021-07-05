
const nodemailer = require('nodemailer');
const fs = require("fs");
const ejs = require("ejs")
const debug = require('debug')('email')

exports.sendEmail =  (results) => {
    // Generate SMTP service account from ethereal.email
    nodemailer.createTestAccount( async (err, account) => {
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
        }

        debug('Credentials obtained, sending message...');

        // Create a SMTP transporter object
        // let transporter = nodemailer.createTransport({
        //     host: account.smtp.host,
        //     port: account.smtp.port,
        //     secure: account.smtp.secure,
        //     auth: {
        //         user: account.user,
        //         pass: account.pass
        //     }
        // });

        var transporter = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "a780fa0c965b5f",
            pass: "ba3b146d87a065"
          }
        });
        debug("Finding Template")
        // const data = await ejs.renderFile('../config/emailTemplate.ejs');
        const data = await ejs.renderFile(__dirname + "/emailTemplate.ejs", { results: results })

        debug("Template found, forming message")
        // Message object
        let message = {
            from: 'Sender Name <sender@example.com>',
            to: `Recipient ${results.remindee.email}`,
            subject: 'Remider to file SM3 report',
            text: 'Hello to myself!',
            html: data
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                debug('Error occurred. ' + err.message);
                return process.exit(1);
            }

            debug('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            // debug('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        debug("Email Sent!")
        });
    });
}