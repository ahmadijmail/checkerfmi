const {
  generateMainKeyboard,
  generateBackKeyboard,
} = require("./keyboardGenerator");
const { performApiRequest } = require("./apiUtils");

const mainOptions = [
  "FMiP ON/OFF 🔎",
  "iPhone Basic INFO 🔎",
  "iPhone CARRIER 🔎",
  "Black List Check 🔎",
  "Phone number lookup 🔎",
];
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
      const message = `🕒 Delivery: Instant\n✔️ Enter IMEI/SN (one per line):`;
      bot.sendMessage(chatId, message, generateBackKeyboard());
    } else if (text === "🔙 Back to Service") {
      selectedOption = "";
      bot.sendMessage(
        chatId,
        "✔️ Please choose Service:👇",
        generateMainKeyboard()
      );
    } else if (selectedOption !== "") {
      const imeis = text.split('\n').map(imei => imei.trim()).filter(imei => imei !== '');
      if (imeis.length === 0) {
        bot.sendMessage(chatId, "No valid IMEI/SN entered.");
        return;
      }

      try {
        bot.sendMessage(chatId, "Please Wait ...");
        for (const imei of imeis) {
          try {
            const formattedResponse = await performApiRequest(
              selectedOption,
              imei,
              process.env.API_KEY
            );
            bot.sendMessage(chatId, formattedResponse);
          } catch (error) {
            bot.sendMessage(chatId, `${imei}: ${error.message}`);
          }
        }
      } catch (error) {
        bot.sendMessage(chatId, `Error processing IMEI/SN: ${error.message}`);
      }
    }
  } catch (error) {
    console.error("Error handling message:", error);
  }
}



module.exports = {
  handleMessage,
};
