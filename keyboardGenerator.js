const generateMainKeyboard = () => ({
  reply_markup: {
    keyboard: [
      [{ text: "New Order 🆕" }],
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
