'use strict';

import Telegraf from 'telegraf';

import { botToken } from '../config/config';

const bot = new Telegraf(botToken);


export default bot;