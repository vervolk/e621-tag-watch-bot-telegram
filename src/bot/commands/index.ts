'use strict';
import Composer from 'telegraf';
import startHandler from './startHandler';
import processInfHandler from './processInfoHandler';
import tagWatchTest from './tagWatchTest';
const composer = new Composer();

composer.command('start', startHandler);
composer.command('procinfo', processInfHandler);
composer.command('test', tagWatchTest);

export = composer;
