'use strict';

import Logger from 'colorful-log-levels/logger';
import { logLevels } from 'colorful-log-levels/enums';

import e621 from 'e621-api'
import { e621PostData } from 'e621-api/build/interfaces';
import { e621TagTypes, e621PopularityStrings } from 'e621-api/build/enums';


let logger = new Logger('../logs', logLevels.error, true);

logger.info('AAA')

// First argument is your user agent, the second is the page limit per search result (pageLimit * 50 = maximum number of results returned)
let wrapper = new e621('Node-test-1.0', 3);

wrapper.getPopularPosts(e621PopularityStrings.daily)
    .then((data) => {
        console.log(data[0].file_url);
    })