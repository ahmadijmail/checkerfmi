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

    axios
        .post(url, null, {
            params: {
                service: 4,
                imei: tex,
                key: "9S3-CK9-H4G-EWT-XKI-VO9-J9X-QZI",
            },
            
        } , 
        bot.sendMessage(chatID, "Please Wait ...")
        ).then((res) => {

            if(res.data.success==false){
                bot.sendMessage(chatID, res.data.error)
            }else {
                console.log(res.data);
                if(res.data.object.fmiOn == false){
                    bot.sendMessage(chatID, 
                        `IMEI: ${res.data.object.imei}
FMI: OFF ✅ ` )
                }

                if(res.data.object.fmiOn == true){
                    bot.sendMessage(chatID, 
                        `IMEI: ${res.data.object.imei} 
FMI: ON 🔴`)
                }
              

            } })

})