require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { handleMessage } = require("./messageHandler");
const { generateMainKeyboard } = require("./keyboardGenerator");

const botToken = process.env.BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });

bot.getUpdates({ offset: -1 }).then(() => {
  console.log('Cleared previous updates, ready to start fresh!');
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "✔️ Please choose Service:👇﻿", generateMainKeyboard());
});

bot.on("message", (msg) => handleMessage(bot, msg));
