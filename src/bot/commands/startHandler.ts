'use strict'

export default async function startHandler(ctx) {
    ctx.resetTimer();
    ctx.time('Sending welcome message...');
    ctx.logger.info(`Start from ${JSON.stringify(ctx.message.from)}`)
    return ctx.reply(`Hello fren! I'm just a small bot, if you happen to find me, fow now I'm not yet working.`)
        .then(() => ctx.time('Message sent!'));
}