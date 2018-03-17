'use strict'
import e621 from 'e621-api';
import { e621PostData } from 'e621-api/build/interfaces';
import { e621TagTypes, e621PopularityStrings } from 'e621-api/build/enums';
let wrapper = new e621('lilithtundrus/tag-watcher-test-0.0.1', 3);

// We want this to take the user's tag request and keep a watch for that specific tag count to
// change (up, not down due to deletes)

export default async function tagWatchTest(ctx) {
    ctx.resetTimer();
    ctx.time('Running e621 tests...');
    ctx.logger.debug(`TEST from ${JSON.stringify(ctx.message.from.username)}`)
    return wrapper.getTagJSONByName('werewolf')
        .then((data) => {
            return ctx.reply(data)
        })
        .then(() => ctx.time('Message sent!'));
}