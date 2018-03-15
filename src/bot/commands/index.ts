'use strict';
import Composer from 'telegraf';
import startHandler from './startHandler';

const composer = new Composer();


composer.command('start', startHandler);

export = composer;
