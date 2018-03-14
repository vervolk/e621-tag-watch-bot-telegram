'use strict';

// Main entry point for the bot


import Logger from 'colorful-log-levels/logger';
import { logLevels } from 'colorful-log-levels/enums';

import e621 from 'e621-api'
import { e621PostData } from 'e621-api/build/interfaces';
import { e621TagTypes, e621PopularityStrings } from 'e621-api/build/enums';
import bot from './bot/bot-main';
import {ver} from './config/config';

// definitely going to need a DB for users

let logger = new Logger('../logs', logLevels.error, true);

bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username;
});

bot.startPolling();

logger.info(`e621WatchBot ${ver} started at: ${new Date().toISOString()}`);

