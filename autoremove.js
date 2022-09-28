// require("dotenv").config();
// const TelegramBot = require("node-telegram-bot-api");
// const axios = require("axios");
// const TOKEN = "5121643234:AAGwJ9BMQAwMhAbbcQVegGf2hfq_xm3zNFs";
// let bot = new TelegramBot(TOKEN, { polling: true });
// let url = "https://api.ifreeicloud.co.uk";

// bot.on("message", function (msg) {
//   console.log(msg.text);
//   let chatID = msg.chat.id;
//   let tex = msg.text;
//   let text2 = tex.split();
//   let url = `https://api.ifreeicloud.co.uk`;
//   let data = {
//     appleid: "Kevinchoo2004@gmail.com",
//     password: "Eastside673919",
//     key: "9S3-CK9-H4G-EWT-XKI-VO9-J9X-QZI",
//     subscription: 1,
//     action: "remove",
//     format: "JSON",
//   };

//   axios
//     .post(url, null, {
//       params: {
//         appleid: "Pcimanny@yahoo.com",
//         password: "Mateo2018!",
//         key: "9S3-CK9-H4G-EWT-XKI-VO9-J9X-QZI",
//         subscription: 1,
//         action: "remove",
//         format: "JSON",
//       },
//     })
//     .then((res) => {
//       console.log(res.data);

//       if (res.data.success == true) {
//         bot.sendMessage(
//           chatID,
//           res.data.devices.map(
//             (element) =>
//               `Name:${element.name}
//        Model: ${element.model}
//        Status: ${element.unlocked}
//        OFFON: ${element.status}
//        `
//           )
//         );

//         console.log(result);

//         // let name = true;
//         // let model = res.data.devices.map((element) => element.model);
//         // let status = res.data.devices.map((element) => element.unlocked);
//         // let onOrOff = res.data.devices.map((element) => element.status);
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
