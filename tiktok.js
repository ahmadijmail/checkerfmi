"use strict";
const nodemailer = require("nodemailer");

require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const TOKEN = "5121643234:AAGwJ9BMQAwMhAbbcQVegGf2hfq_xm3zNFs";
let bot = new TelegramBot(TOKEN, { polling: true });

// async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();

//   // create reusable transporter object using the default SMTP transport
  
// }

// main().catch(console.error);




bot.on("message", function (msg) {
    let tex = msg.text;
    let transporter = nodemailer.createTransport({
        host: "smtp.iphone-lnc.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "apple@iphone-lnc.com", // generated ethereal user
          pass: "QC#ggdI3", // generated ethereal password
        },
        tls: { 
            rejectUnauthorized: false 
        }
      });
    
      // send mail with defined transport object
      let info =  transporter.sendMail({
        from: 'apple@iphone-lnc.com', // sender address
        to: "ahmadijmail@yahoo.com", // list of receivers
      //  subject: "Hello", // Subject line
        text: tex, // plain text body
      //  html: tex, // html body
      });
    
      console.log("Message sent: %s",  info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});
