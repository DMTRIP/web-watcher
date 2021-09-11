const { Telegraf, Markup } = require('telegraf');
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');

dotenv.config();

axios.defaults.baseURL = 'http://localhost:8080/';

const Commands = {
    start: 'start',
    addTracking: 'addTracking',
    listTrackings: 'listTrackings',
    healthCheck: 'healthCheck',
};

async function bot() {
    await mongoose.connect(process.env.MONGO_DB_URI);

    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    let prevCommand = '';


    // auth
    bot.use((ctx, next) => {
        const username = ctx?.from?.username;

        if (username === 'dimabasuk') {
            next();
        } else {
            return ctx.reply(`Sorry ${username || ''} you're not dimabasuk`);
        }
    });

    bot.use((ctx, next) => {
        if (Object.values(Commands).includes(ctx.message.text.slice(1))) {
            prevCommand = ctx.message.text;
        }

        next();
    });

    bot.command(Commands.start, (ctx) => {
        ctx.reply('keyboard', Markup
            .keyboard([Commands.addTracking, Commands.listTrackings, Commands.healthCheck].map(command => `/${command}`))
            .resize()
        )
    });

    bot.command(Commands.addTracking, (ctx) => {
        ctx.reply('Fill next json object with valid data');
        ctx.reply({
            resourceUrl: 'string',
            title: 'string',
            cssSelector: 'string',
        });
    });

    bot.command(Commands.listTrackings, async (ctx) => {
       try {
           const response = await axios.get('trackings');

           if (response?.data?.trackings) {
               response.data.trackings.forEach(tracking => {
                   ctx.reply(formTrackingHTML(tracking), { parse_mode: 'html' });
               })
           }
       } catch (error) {
           ctx.reply(error.message);
       }

        function formTrackingHTML(tracking) {
           const { title, resourceUrl, cssSelector, initialSelectorValue, currentValue, isWatching, lastCheckedAt } = tracking;

            return `
===============
<pre>Title: ${title}</pre>
<pre>Resource: ${resourceUrl}</pre>
<pre>LastCheckedAt: ${lastCheckedAt}</pre>
<pre>CssSelector: ${cssSelector}</pre>
<pre>InitialSelectorValue: ${initialSelectorValue}</pre>
<pre>CurrentValue: ${currentValue}</pre>
<pre>IsWatching: ${isWatching}</pre>
===============
            `
        }
    });

    bot.command(Commands.healthCheck, async (ctx) => {
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
    });

    bot.on('message', async (ctx) => {
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

           // switch (ctx.message.text) {
           //     case '/healthCheck':
           //         const response = await axios.get('http://localhost:8080/health-check');
           //
           //         if (response.status === 200) {
           //             ctx.reply('Everything works 👍')
           //         } else {
           //             ctx.reply('The system seems to be down ):');
           //         }
           //         break;
           //     case '/addTracking':
           //         ctx.reply('Fill next json object with valid data');
           //         ctx.reply({
           //             resourceUrl: 'string',
           //             title: 'string',
           //             cssSelector: 'string',
           //         });
           //         break;
           //     default:
           //         return  ctx.reply('Unknown command');
           // }
       } catch (e) {
           ctx.reply(e.message);
       }
    });

    bot.launch().then((res) => {
        console.log('Telegram Bot is running')
    });

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
};

bot();
