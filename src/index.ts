'use strict';
// Main entry point for the bot

// #region imports
// Logging system (basic, gets attached to the bot)
import Logger from 'colorful-log-levels/logger';
import { logLevels } from 'colorful-log-levels/enums';
// API interaction for e621
import e621 from 'e621-api';
import { e621PostData } from 'e621-api/build/interfaces';
import { e621TagTypes, e621PopularityStrings, e621RelatedTagArrayTypes } from 'e621-api/build/enums';
import bot from './bot/bot-main';
import { ver, prod, debug, adminID } from './config/config';
// Processing timer for getting 
import { elapsedTime, resetTimer } from './lib/timer';
// rate-limiter npm package for telegraf
import rateLimit from 'telegraf-ratelimit';
import session from 'telegraf/session';
import { Message } from 'telegram-typings';
// #endregion

// Note: definitely going to need a DB for users from the other project
// TODO: Create a way to have an event system for the actual tag watching of the bot

/* 
Gaols/Features:
We want this to be a bot that allows users to 'subscribe' to a tag or set
of tags from the e621 site. Support for favcount filters among other things should
be supported. On an update to one or more of the user's tags + preferences 
they will receive a message with the image or set of images/posts
*/
let logger = new Logger('../logs', logLevels.error, true);
let wrapper = new e621('lilithtundrus/tag-watcher-test-0.0.1', 3);

// Set limit to 3 message per 3 seconds using telegraf-ratelimit
const limitConfig = {
    window: 3000,
    limit: 3,
    onLimitExceeded: ((ctx, next) => {
        logger.warn(`${ctx.message.from.username} exceeded the rate limit.`);
        ctx.reply('Rate limit exceeded. This instance will be reported.');
    })
};

bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username;
});

// Put middleware globally fo the bot here
bot.use(
    session(),
    rateLimit(limitConfig),
    require('./bot/commands/index'),
    // Allow for atached .then() to a ctx.reply()
    (ctx, next) => {
        const reply = ctx.reply;
        ctx.reply = (...args) => {
            ctx.session.lastMessage = args;
            reply(...args);
        };
        return next();
    },
);

resetTimer();
if (debug) elapsedTime('Starting bot polling...');
// We're using polling for now since it's a bit simpler for development than webhooks
bot.startPolling();
if (debug) elapsedTime('Bot polling started');

logger.info(`e621WatchBot ${ver} started at: ${new Date().toISOString()}`);

// Attach functions/classes to the bot's context arguments passed to functions
bot.context.time = elapsedTime;
bot.context.resetTimer = resetTimer;
bot.context.logger = logger;
bot.context.wrapper = wrapper;

// Listen for any message sent to the bot
bot.on('message', (ctx) => {
    return ctx.logger.debug(`${ctx.message.from.username} sent ${ctx.message.text} at ${Date.now()}`);
});

bot.catch((err) => {
    bot.sendMessage(adminID, err.toString());
    return logger.error(err);
});