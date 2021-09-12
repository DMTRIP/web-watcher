const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.TLEGRAM_CHAT_ID,
};
