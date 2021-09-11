const { Telegram } = require('telegraf');
const dotenv = require('dotenv');

dotenv.config();

const telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);
const chatId = process.env.TLEGRAM_CHAT_ID;

exports.notifyUser = async function notifyUser(tracking) {
    await telegram.sendMessage(chatId, formNotificationHtml(tracking), { parse_mode: 'html' });
};

function formNotificationHtml(tracking) {
    const { title, previousValue, resourceUrl, currentValue } = tracking;

    return `
<pre>title: ${title}</pre>
<pre>resource: ${resourceUrl}</pre>
<pre>previousValue: ${previousValue}</pre>
<pre>newValue: ${currentValue}</pre>
    `
}
