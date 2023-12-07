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

// Start Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Define a route for the base URL
app.get('/', (req, res) => {
  res.send("It's working!"); // This message will be sent when someone hits the base URL
});

job.start(); // Start the cron job

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "✔️ Please choose Service:👇﻿", generateMainKeyboard());
});

bot.on("message", (msg) => handleMessage(bot, msg) );
