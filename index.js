require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { handleMessage } = require("./messageHandler");
const { generateMainKeyboard } = require("./keyboardGenerator");
const express = require('express');
const { job } = require("./cron");

const botToken = process.env.BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });
const app = express();
const port = process.env.PORT || 3000; // You can set the port in your environment variables or default to 3000



job.start(); // Start the cron job

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "✔️ Please choose Service:👇﻿", generateMainKeyboard());
});

bot.on("message", (msg) => handleMessage(bot, msg) );
