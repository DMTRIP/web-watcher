const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');
const { verifyUserMiddleWare } = require('./verifyUserMiddleWare');
const { Commands } = require('./commands');
const commandHandlers = require('./commandHandlers');

dotenv.config();

axios.defaults.baseURL = 'http://localhost:8080/';

async function bot() {
    await mongoose.connect(process.env.MONGO_DB_URI);

    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    let prevCommand = '';

    // auth
    bot.use(verifyUserMiddleWare);

    bot.use((ctx, next) => {
        if (Object.values(Commands).includes(ctx.message.text.slice(1))) {
            prevCommand = ctx.message.text;
        }

        next();
    });

    bot.command(Commands.start, commandHandlers.handleStart);
    bot.command(Commands.addTracking, commandHandlers.handleAddTracking);
    bot.command(Commands.listTrackings, commandHandlers.handleListTrackings);
    bot.command(Commands.healthCheck, commandHandlers.handleSystemHealthCheck);
    bot.on('message', ctx => commandHandlers.handleMessage(ctx, prevCommand));

    bot.launch().then((res) => {
        console.log('Telegram Bot is running')
    });

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
};

bot();
