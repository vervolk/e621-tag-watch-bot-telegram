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
// Database wrapper 
import * as db from './db/database';
import TagWatchInitializer from './lib/newTagWatchClass';
// #endregion

// TODO: Create a way to have an event system for the actual tag watching of the bot
// TODO: Create a queuing system for API calls (we don't want to hit that limit)
// TODO: Eventualy improve the architecture of this!
// TODO: Create a way to 'cache' new posts and only send the new items on a 
// user-defined number of favorites
// TODO: Allow the user to have a blacklist
// TODO: on the /unwatch command, support a full removal or a specific tag removal
// TODO: Handle any/all messages sent to the user having a chance for error!!!
// TODO: on ANY input from the USER, clean for SQL statements and multiple-inputs
// on single-input commands
// TODO: Create a response time metric for the DB and a way to graph it 
// TODO: Create a response time metric for the bot and a way to graph it

/* 
Gaols/Features:
We want this to be a bot that allows users to 'subscribe' to a tag or set
of tags from the e621 site. Support for favcount filters among other things should
be supported. On an update to one or more of the user's tags + preferences 
they will receive a message with the image or set of images/posts
*/
let logger = new Logger('../logs', logLevels.error, true);
let wrapper = new e621('lilithtundrus/tag-watcher-test-0.0.1', 3);

// Connect to the DB on startup
db.connect();

// GET each user, find their watches and instate them (delays in between)
db.getAllUserData().then((userRows) => {
    if (userRows.length < 1) {
        bot.telegram.sendMessage(adminID, 'Error: Database user table returned as empty');
        throw Error('Database is empty');
    }
    userRows.forEach((userSet, index) => {
        userSet.watchlist.split(',').forEach((tag, index) => {
            // We'll likely want to delay these to not bump into the API-limit
            let userWatchThread = new TagWatchInitializer(bot.context, bot.telegram, userSet, index);
            return userWatchThread.initializeWatcher();
        });
    });
})

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
// setInterval(sendThreadingTestMessage, 1 * 500);

// function sendThreadingTestMessage() {
//     // resetTimer();
//     logger.debug(`On the main thread at ${new Date().toISOString()}`)
//     // bot.telegram.sendMessage(adminID, new Date().toTimeString())
//     //     .then(() => elapsedTime('Sent message'))
// }

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
bot.context.db = db;

// Listen for any message sent to the bot (does not capture commands)
bot.on('message', (ctx) => {
    return ctx.logger.debug(`${ctx.message.from.username} sent ${ctx.message.text} at ${Date.now()}`);
});

bot.catch((err) => {
    bot.telegram.sendMessage(adminID, err.toString());
    return logger.error(err);
});