'use strict';

// Main entry point for the bot


import Logger from 'colorful-log-levels/logger';
import { logLevels } from 'colorful-log-levels/enums';

import e621 from 'e621-api'
import { e621PostData } from 'e621-api/build/interfaces';
import { e621TagTypes, e621PopularityStrings } from 'e621-api/build/enums';


// definitely going to need a DB for users

let logger = new Logger('../logs', logLevels.error, true);

