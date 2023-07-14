const generateMainKeyboard = () => ({
  reply_markup: {
    keyboard: [
      [{ text: "FMiP ON/OFF 🔎" }],
      [{ text: "iPhone Basic INFO 🔎" }],
      [{ text: "iPhone CARRIER 🔎" }],
      [{ text: "Black List Check 🔎" }],

    ],
    resize_keyboard: true,
  },
});

const generateBackKeyboard = () => ({
  reply_markup: {
    keyboard: [[{ text: "🔙 Back to Service" }]],
    resize_keyboard: true,
  },
});

module.exports = {
  generateMainKeyboard,
  generateBackKeyboard,
};
