'use strict'
import e621 from 'e621-api';
import { e621PostData } from 'e621-api/build/interfaces';
import { e621TagTypes, e621PopularityStrings } from 'e621-api/build/enums';
let wrapper = new e621('lilithtundrus/tag-watcher-test-0.0.1', 3);

export default async function tagWatchTest(ctx) {
    ctx.resetTimer();
    ctx.time('Running e621 tests...');
    ctx.logger.debug(`TEST from ${JSON.stringify(ctx.message.from.username)}`)
    return wrapper.getE621PostIndexPaginate('werewolf order:favcount -flash -video', 0, 1, 3)
        .then((e621PageSet) => {
            return ctx.reply(e621PageSet[0][0].file_url)
        })
        .then(() => ctx.time('Message sent!'));
}