'use strict'
import e621 from 'e621-api';
import { e621PostData } from 'e621-api/build/interfaces';
import { e621TagTypes, e621PopularityStrings } from 'e621-api/build/enums';
let wrapper = new e621('lilithtundrus/tag-watcher-test-0.0.1', 3);

// We want this to take the user's tag request and keep a watch for that specific tag count to
// change (up, not down due to deletes)

export default async function relatedTagTest(ctx) {
    ctx.resetTimer();
    ctx.time('Running e621 tests...');
    ctx.logger.debug(`TEST from ${JSON.stringify(ctx.message.from.username)}`)
    console.log(ctx.message.text.substring(9));
    if (ctx.message.text.substring(9).length < 1) {
        return ctx.reply(`Please give a test tag to get the related tags of with the the /related command`)
            .then(() => ctx.time('Message sent!'));
    } else {
        return wrapper.getRelatedTagsByName(ctx.message.text.substring(9))
            .then((data) => {
                console.log(Object.keys(data))
                let key = Object.keys(data)[0];
                console.log(data[key][0])
                if (data[key][0] == undefined) {
                    console.log(data)
                    return ctx.reply(`Sorry, I couldn't get a set of related tags for the tag: ${ctx.message.text.substring(9)}`)
                }
                data[key].forEach(element => {
                    console.log(element[0].name)
                });
                return ctx.reply(data)
            })
            .then(() => ctx.time('Message sent!'));
    }

}