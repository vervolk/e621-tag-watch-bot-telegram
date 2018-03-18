'use strict'
import e621 from 'e621-api';
import { e621PostData } from 'e621-api/build/interfaces';
import { e621TagTypes, e621PopularityStrings, e621RelatedTagArrayTypes } from 'e621-api/build/enums';
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
                console.log(data[0][e621RelatedTagArrayTypes.name])
                if (data.length == 0) {
                    return ctx.reply(`Sorry, I couldn't get a set of related tags for the tag: ${ctx.message.text.substring(9)}`)
                }
                let messageArray = [];
                data.forEach(element => {
                    console.log(element[0])
                    messageArray.push(element[0])
                });
                return ctx.reply(messageArray.join('\n'))
            })
            .then(() => ctx.time('Message sent!'));
    }

}