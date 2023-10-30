const {
  generateMainKeyboard,
  generateBackKeyboard,
} = require("./keyboardGenerator");
const {
  performApiRequest,
} = require("./apiUtils");

const mainOptions = ["FMiP ON/OFF 🔎", "iPhone Basic INFO 🔎", 'iPhone CARRIER 🔎', 'Black List Check 🔎'];
let selectedOption = ""; // Define selectedOption in the parent scope


async function handleMessage(bot, msg) {
  try {
    const chatId = msg?.chat?.id;
    if (!chatId) {
      throw new Error("Invalid chat ID");
    }
    const text = msg?.text?.trim();

    if (mainOptions.includes(text)) {
      selectedOption = text;
      const message = `🕒 Delivery: Instant\n✔️ Enter IMEI/SN:`;
      bot.sendMessage(chatId, message, generateBackKeyboard());    
    } else if (text === "🔙 Back to Service") {
      selectedOption = "";
      bot.sendMessage(
        chatId,
        "✔️ Please choose Service:👇﻿",
        generateMainKeyboard()
      );
    } else if (selectedOption !== "") {
      // const imei = text.trim();
      const imeis = text.split('\n').map(imei => imei.trim()); // Split input text into an array of IMEI numbers

      try {
        bot.sendMessage(chatId, 'Please Wait ...');

        const responses = await Promise.all(imeis.map(async imei => {
          const response = await performApiRequest(
            selectedOption,
            imei,
            process.env.API_KEY
          );
          return response; // Keep the responses in an array
        }));
      
        responses.forEach(formattedResponse => {
          bot.sendMessage(chatId, formattedResponse);
        });
      } catch (error) {
        bot.sendMessage(chatId, `${error.message}`);
      }
    }
  } catch (error) {
    console.error("Error handling message:", error);
  }
}

module.exports = {
  handleMessage,
};
