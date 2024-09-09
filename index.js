require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require("node-telegram-bot-api");
const { handleMessage } = require("./messageHandler");
const { generateMainKeyboard } = require("./keyboardGenerator");

const botToken = process.env.BOT_TOKEN;
const authorizedUserId = process.env.USER_ID;

if (!botToken) {
  console.error('Bot token must be provided in BOT_TOKEN environment variable!');
  process.exit(1);
}

if (!authorizedUserId) {
  console.error('Authorized user ID must be provided in AUTHORIZED_USER_ID environment variable!');
  process.exit(1);
}

const bot = new TelegramBot(botToken);
const app = express();
const PORT = process.env.PORT || 3000;

// Configure body-parser to handle post requests
app.use(bodyParser.json());

const webhookUrl = `https://${process.env.DOMAIN}/bot${botToken}`;
bot.setWebHook(webhookUrl);

// Define a route that handles incoming webhook requests
app.post(`/bot${botToken}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Middleware to validate user
const validateUser = (msg, callback) => {
  if (msg.from.id.toString() === authorizedUserId) {
    callback();
  } else {
    bot.sendMessage(msg.chat.id, "⛔ Unauthorized access.");
  }
};

// Start command handler
bot.onText(/\/start/, (msg) => {
  validateUser(msg, () => {
    bot.sendMessage(msg.chat.id, "✔️ Please choose Service:👇", generateMainKeyboard());
  });
});

// General message handler
bot.on("message", (msg) => {
  validateUser(msg, () => {
    handleMessage(bot, msg);
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
