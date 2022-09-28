require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();
const axios = require("axios");
const { TOKEN, ID } = process.env;
let bot = new TelegramBot(TOKEN, { polling: true });
let url = "https://api.ifreeicloud.co.uk";

app.get("/", function (req, res) {
  res.send("working");
});

app.listen(process.env.PORT);

bot.on("message", function (msg) {
  console.log(msg.text);
  let chatID = ID;
  let tex = msg.text;
  let serviceid = tex.split(" ");
  console.log(serviceid);
  axios
    .post(
      url,
      null,
      {
        params: {
          service: serviceid[0] == "info" ? 120 : 4,
          imei: serviceid[0] == "info" ? serviceid[1] : tex,
          key: "9S3-CK9-H4G-EWT-XKI-VO9-J9X-QZI",
        },
      },
      bot.sendMessage(chatID, "Please Wait ...")
    )
    .then((res) => {
      if (serviceid[0] != "info") {
        if (res.data.success == false) {
          bot.sendMessage(chatID, res.data.error);
        } else {
          bot.sendMessage(
            chatID,
            `IMEI: ${res.data.object.imei}
              FMI: ${
res.data.object.fmiOn == false ? "FMI: OFF ✅ " : "FMI: ON 🔴"
              } `
          );
        }
      }
      if (serviceid[0] == "info") {
        console.log(res.data);
        if (res.data.success == false) {
          bot.sendMessage(chatID, res.data.error);
        } else {
          bot.sendMessage(
            chatID,
            `
Model: ${res.data.object.modelDescription?res.data.object.modelDescription:res.data.object.model}
IMEI: ${res.data.object.imei}
IMEI2: ${res.data.object.imei2}
Serial: ${res.data.object.imei}
iCloud Lock: ${res.data.object.fmiON == true ? " ON 🔴 " : " OFF ✅ "} 
iCloud Status: ${ res.data.object.lostMode == true? " Lost 🔴 " : " Clean ✅" } 
blacklistStatus: ${res.data.object.blacklistStatus == "Clean"? "  Clean   ✅": "BlackListed 🔴 "}
replacedStatus: ${res.data.object.replacedDevice}
Warranty Status: ${res.data.object.warrantyStatus}
Estimated Purchase Date: ${res.data.object.estimatedPurchaseDate}
simLock: ${res.data.object.simLock == false ? "Unlocked" : "Locked"}   
               `
          );
        }
      }
    });
});
