exports.verifyUserMiddleware = (ctx, next) => {
    const username = ctx?.from?.username;

    if (username === 'dimabasuk') {
        next();
    } else {
        return ctx.reply(`Sorry ${username || ''} you're not dimabasuk`);
    }
};
