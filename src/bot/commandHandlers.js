const { Markup } = require('telegraf');
const axios = require('axios');
const botService = require('./botService');
const { Commands } = require('./commands');

module.exports = {
    handleStart(ctx) {
        ctx.reply('keyboard', Markup
            .keyboard(botService.getKeyboard())
            .resize()
        )
    },
    handleAddTracking(ctx) {
        ctx.reply('Fill next json object with valid data');
        ctx.reply({
            resourceUrl: 'string',
            title: 'string',
            cssSelector: 'string',
        });
    },
    async handleListTrackings(ctx) {
        try {
            const result = await botService.listAllTrackings();

            ctx.reply(result, { parse_mode: 'html' });
        } catch (error) {
            ctx.reply(error.message);
        }
    },
    async handleSystemHealthCheck(ctx) {
        try {
            const response = await axios.get('health-check');

            if (response?.data?.ok === true) {
                ctx.reply('Everything works 👍')
            } else if (response?.data?.ok === false) {
                ctx.reply('The system seems to be down ):');
            }
        } catch (e) {
            ctx.reply(e.message);
        }
    },
    async handleMessage(ctx, prevCommand) {
        try {
            const message = ctx.message.text;

            if(prevCommand.slice(1) === Commands.addTracking) {
                try {
                    const newTrackingInputData = JSON.parse(message);
                    await axios.post('tracking', newTrackingInputData);
                    ctx.reply('Your tracking has been added successfully !!!');
                } catch (e) {
                    ctx.reply('Sth went wrong, could not add your tracking !!!');
                }
            }
        } catch (e) {
            ctx.reply(e.message);
        }
    }
};
