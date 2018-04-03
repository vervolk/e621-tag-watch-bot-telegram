'use strict';
import Composer from 'telegraf';
import startHandler from './startHandler';
import processInfHandler from './processInfoHandler';
import tagWatchTest from './tagWatchTest';
import relatedTagTest from './relatedTest';
import watchHandler from './watchHandler';
import unwatchHandler from './unwatchHandler';
import blacklistHandler from './blacklistHandler'

const composer = new Composer();

composer.command('start', startHandler);
composer.command('procinfo', processInfHandler);
composer.command('test', tagWatchTest);
composer.command('related', relatedTagTest);
composer.command('watch', watchHandler);
composer.command('unwatch', unwatchHandler);
composer.command('blacklist', blacklistHandler);


export = composer;
