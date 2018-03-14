'use strict';
// Main entry point for the bot

// Logging system (basic, gets attached to the bot)
import Logger from 'colorful-log-levels/logger';
import { logLevels } from 'colorful-log-levels/enums';

// API interaction for e621
import e621 from 'e621-api'
import { e621PostData } from 'e621-api/build/interfaces';
import { e621TagTypes, e621PopularityStrings } from 'e621-api/build/enums';
import bot from './bot/bot-main';
import { ver } from './config/config';

// should probably put these in bot-main
import rateLimit from 'telegraf-ratelimit';
import session from 'telegraf/session';


// definitely going to need a DB for users from the other project

let logger = new Logger('../logs', logLevels.error, true);

// Set limit to 1 message per 3 seconds using telegraf-ratelimit
const limitConfig = {
    window: 3000,
    limit: 3,
    onLimitExceeded: ((ctx, next) => {
        logger.warn(`${ctx.message.from.username} exceeded the rate limit.`);
        ctx.reply('Rate limit exceeded. This instance will be reported.');
    })
}

bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username;
});

// Put middleware globally fo the bot here
bot.use(
    session(),
    rateLimit(limitConfig),
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

bot.startPolling();
logger.info(`e621WatchBot ${ver} started at: ${new Date().toISOString()}`);

bot.catch((err) => {
    logger.error(err);
    // send a message to the admin list about the error
})