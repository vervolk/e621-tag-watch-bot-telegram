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
    console.log(ctx.message.text.substring(6));
    if (ctx.message.text.substring(6).length < 1) {
        return ctx.reply(`Please give a test tag to get the count of along with the /test command`)
            .then(() => ctx.time('Message sent!'));
    } else {
        return wrapper.getTagJSONByName(ctx.message.text.substring(6))
            .then((data) => {
                if (data.length < 1) {
                    return ctx.reply(`Sorry, I couldn't get a count for the tag: ${ctx.message.text.substring(6)}`)
                }
                return ctx.reply(`Count: ${data[0].count}`)
            })
            .then(() => ctx.time('Message sent!'));
    }   

}