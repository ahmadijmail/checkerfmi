const {
  generateMainKeyboard,
  generateBackKeyboard,
} = require("./keyboardGenerator");
const {
  fetchCarrierNameAndGateway,
  sendPlainTextEmail,
} = require("./apiUtils");

const mainOptions = ["New Order 🆕"];
let selectedOption = ""; // Define selectedOption in the parent scope
let phoneNumber = "";

async function handleMessage(bot, msg) {
  const chatId = msg?.chat?.id;

  try {
    if (!chatId) {
      throw new Error("Invalid chat ID");
    }

    const text = msg?.text?.trim();
    if (!text) {
      throw new Error("No text provided");
    }

    switch (selectedOption) {
      case "":
        if (mainOptions.includes(text)) {
          selectedOption = text;
          return await bot.sendMessage(
            chatId,
            "☎️ Enter Phone Number",
            generateBackKeyboard()
          );
        } else {
          await bot.sendMessage(
            chatId,
            "✔️ Please choose Service:👇",
            generateMainKeyboard()
          );
        }
        break;

      case "New Order 🆕":
        if (text === "🔙 Back to Service") {
          phoneNumber = "";
          selectedOption = "";
          return await bot.sendMessage(
            chatId,
            "✔️ Please choose Service:👇",
            generateMainKeyboard()
          );
        }
        if (phoneNumber) {
          bot.sendMessage(chatId, "Please Wait ...");
          await sendPlainTextEmail(phoneNumber, text);
          const message = `SMS has been sent ✅
Phone Number: ${phoneNumber}
Message: " ${text} "`;
          await bot.sendMessage(chatId, message, generateMainKeyboard());
          phoneNumber = "";
          selectedOption = "";
          console.log(message);

        } else {
          phoneNumber = await fetchCarrierNameAndGateway(text);

          await bot.sendMessage(
            chatId,
            "Enter the message",
            generateBackKeyboard()
          );
        }
        break;

      default:
        // Handle other cases or reset the option.
        selectedOption = "";
        phoneNumber = "";
        await bot.sendMessage(
          chatId,
          "Invalid option selected.",
          generateMainKeyboard()
        );
        break;
    }

  } catch (error) {
    phoneNumber = "";
    selectedOption = "";
    console.error("Error handling message:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';

    bot.sendMessage(
      chatId,
      errorMessage ,
      generateMainKeyboard()
    );
  }
}

module.exports = {
  handleMessage,
};
