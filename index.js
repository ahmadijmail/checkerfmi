require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();
const axios = require("axios");
const { TOKEN, ID, KEY, ID2 } = process.env;
let bot = new TelegramBot(TOKEN, { polling: true });
let time = require("moment");
let url = "https://api.ifreeicloud.co.uk";

app.get("/", function (req, res) {
  res.send("working");
});

app.listen(process.env.PORT);

bot.on("message", function (msg) {
  let chatID = msg.chat.id;

  if (msg.chat.id == ID || msg.chat.id == ID2) {
    console.log(msg.text);
    let tex = msg.text;
    let serviceid = tex.split(" ");
    
    axios
      .post(
        url,
        null,
        {
          params: {
            service:
              serviceid[0] == "info" || serviceid[0] == "Info"
                ? 120
                : serviceid[0] == "b" || serviceid[0] == "B"
                ? 9
                : 4,
            imei:
              serviceid[0] == "info" || serviceid[0] == "b" || serviceid[0] == "B"
                ? serviceid[1]
                : tex,
            key: KEY,
          },
        },
        
      )
      .then((res) => {
        console.log(res);
        if (serviceid.length == 1) {
          if (res.data.success == false) {
            bot.sendMessage(chatID, res.data.error);
          } else {
            bot.sendMessage(
              chatID,
              `IMEI: ${res.data.object.imei}
${
  res.data.object.fmiOn == false
    ? "Find My: OFF ✅ "
    : res.data.object.fmiOn == true
    ? "Find My: ON 🔴"
    : "Check with another checker"
}
Time: ${time().format("YYYY-MM-DD HH:mm:SS")}              
© Powered By AI
              `
            );
          }
        }
        if (serviceid[0] == "info" || serviceid[0] == "Info") {
          if (res.data.success == false) {
            bot.sendMessage(chatID, res.data.error);
          } else {
            bot.sendMessage(
              chatID,
              `
Model: ${
                res.data.object.modelDescription
                  ? res.data.object.modelDescription
                  : res.data.object.model
              }
IMEI: ${res.data.object.imei}
IMEI2: ${res.data.object.imei2}
Serial: ${res.data.object.serial}
iCloud Lock: ${
                res.data.object.fmiON == true
                  ? " ON 🔴 "
                  : res.data.object.fmiON == false
                  ? " OFF ✅ "
                  : "Double Check"
              } 
iCloud Status: ${
                res.data.object.lostMode == true
                  ? " Lost 🔴 "
                  : res.data.object.lostMode == false
                  ? " Clean ✅"
                  : "Double Check"
              } 
blacklistStatus: ${
                res.data.object.blacklistStatus == "Clean"
                  ? "  Clean   ✅"
                  : "BlackListed 🔴 "
              }
replacedStatus: ${res.data.object.replacedDevice}
Warranty Status: ${res.data.object.warrantyStatus}
Estimated Purchase Date: ${res.data.object.estimatedPurchaseDate}
carrier: ${res.data.object.carrier}
BlackList: ${res.data.object.blacklistStatus}
simLock: ${res.data.object.simLock == false ? "Unlocked" : "Locked"}   
               `
            );
          }
        }

      
        if (serviceid[0] == "b" || serviceid[0] == "B") {
if(res.data.object.blacklistRecords>0){
    bot.sendMessage(
        chatID,
        `IMEI: ${res.data.object.imei}        
BlackList Date: ${res.data.object.history[0].date}            
BlackList By: ${res.data.object.history[0].by} 🔴
BlackList Country: ${res.data.object.history[0].Country}                              
        `
      );
} bot.sendMessage(
    chatID,
    `IMEI: ${res.data.object.imei}        
BlackList Status: Clean ✅                       
    `
  );

        }
      });

  
  } else bot.sendMessage(chatID, "NOT ALLOWED");
});
