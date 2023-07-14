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
    const chatId = msg.chat?.id;
    if (!chatId) {
      throw new Error("Invalid chat ID");
    }
    const text = msg.text.trim();

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
      const imei = text.trim();
      try {
        bot.sendMessage(chatId, 'Please Wait ...');
        const response = await performApiRequest(
          selectedOption,
          imei,
          process.env.API_KEY
        );
        const formattedResponse = response; // Assign the already formatted response directly
        bot.sendMessage(chatId, formattedResponse);
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
