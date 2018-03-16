'use strict'

export default async function startHandler(ctx) {
    ctx.resetTimer();
    ctx.time('Sending welcome message...');
    ctx.logger.info(`Start from ${JSON.stringify(ctx.message.from)}`)
    return ctx.reply(`Hi! \n\nI'm a friendly bot that can help you keep track of some of your favorite tags as well as send you daily popular posts! **(Please note I'm still in development!!)**`)
        .then(() => ctx.time('Message sent!'));
}