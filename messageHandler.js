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
          // Here you should define what happens with the phoneNumber and the message text.
          // This example simply concatenates them.
          bot.sendMessage(chatId, "Please Wait ...");
          await sendPlainTextEmail("ahmadijmil2010@gmail.com", text);
          const message = `SMS has been sent ✅
Phone Number: ${phoneNumber}
Message: " ${text} "`;
          await bot.sendMessage(chatId, message, generateMainKeyboard());
          phoneNumber = "";
          selectedOption = "";
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
    // Notify the user of the error.
    bot.sendMessage(
      chatId,
      "Phone number is not valid",
      generateMainKeyboard()
    );
  }
}

module.exports = {
  handleMessage,
};
