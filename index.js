require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require("node-telegram-bot-api");
const { handleMessage } = require("./messageHandler");
const { generateMainKeyboard } = require("./keyboardGenerator");

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
  console.error('Bot token must be provided in BOT_TOKEN environment variable!');
  process.exit(1);
}

const bot = new TelegramBot(botToken);
const app = express();
const PORT = process.env.PORT || 3000;

// Configure body-parser to handle post requests
app.use(bodyParser.json());

const webhookUrl = `https://${process.env.Domain}/bot${botToken}`;
bot.setWebHook(webhookUrl);

// Define a route that handles incoming webhook requests
app.post(`/bot${botToken}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "✔️ Please choose Service:👇", generateMainKeyboard());
});

bot.on("message", (msg) => handleMessage(bot, msg));

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
