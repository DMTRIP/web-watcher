const { Telegram } = require('telegraf');
const config = require('../config');

const telegram = new Telegram(config.telegramBotToken);
const chatId = config.telegramChatId;

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
