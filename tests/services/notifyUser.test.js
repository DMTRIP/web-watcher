jest.mock('telegraf');
jest.mock('../../src/config', () => ({
    telegramBotToken: 'TELEGRAM_BOT_TOKEN',
    telegramChatId: 'TLEGRAM_CHAT_ID',
}));

const Telegraf = require('telegraf');
const { notifyUser } = require('../../src/services/notifyUser');

describe('notifyUser', () => {
    it('should notify user via telegram bot', async function () {
        const tracking = {
            title: 'title',
            previousValue: 'previousValue',
            resourceUrl: 'resourceUrl',
            currentValue: 'currentValue',
        };
        const message = `
<pre>title: ${tracking.title}</pre>
<pre>resource: ${tracking.resourceUrl}</pre>
<pre>previousValue: ${tracking.previousValue}</pre>
<pre>newValue: ${tracking.currentValue}</pre>
    `;
        const sendMessage = jest.fn();

        Telegraf.Telegram.mockReturnValue(() => ({
            sendMessage,
        }));

        await notifyUser(tracking);

        expect(Telegraf.Telegram).toHaveBeenCalledWith('TELEGRAM_BOT_TOKEN');
        expect(Telegraf.Telegram.mock.instances[0].sendMessage).toHaveBeenCalledWith('TLEGRAM_CHAT_ID', message, { parse_mode: 'html' })
    });
});
