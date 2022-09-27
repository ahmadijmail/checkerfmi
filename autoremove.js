require("dotenv").config();
const TelegramBot = require('node-telegram-bot-api')
const axios = require("axios");
const { TOKEN } = process.env;
let bot = new TelegramBot(TOKEN, { polling: true })
let url = "https://api.ifreeicloud.co.uk";

bot.on('message', function (msg) {
    console.log(msg.text);
    let chatID = msg.chat.id;
    let tex = msg.text
    let text2 = tex.split()
    let url = `https://api.ifreeicloud.co.uk`
    let data = {
        appleid: "Kevinchoo2004@gmail.com",
        password: "Eastside673919",
        key: "9S3-CK9-H4G-EWT-XKI-VO9-J9X-QZI",
        subscription: 1,
        action: "remove",
        format: "JSON",
    };


    axios
        .post(url, null, {
            params: {
                appleid: "Kevinchoo2004@gmail.com",
                password: "Eastside673919",
                key: "9S3-CK9-H4G-EWT-XKI-VO9-J9X-QZI",
                subscription: 1,
                action: "remove",
                format: "JSON",
            },

        })
        .then((res) => {
            console.log(res.data);
            bot.sendMessage(chatID, 
           
                res.data.devices.name
            
            )
        })
        .catch((err) => {
            console.log(err);
        });






})