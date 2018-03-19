'use strict';
import TagWatcher from '../../lib/tagWatchClass'

export default async function watcHandler(ctx) {
    ctx.resetTimer();
    ctx.time('Running watch handler...');
    ctx.logger.debug(`/watch from ${JSON.stringify(ctx.message.from.username)}`)
    // Get the tag to search split away from the command
    let tagString: string = ctx.message.text.substring(7);
    if (tagString.length < 1) {
        return ctx.reply(`Please give a test tag to watch for you`)
            .then(() => ctx.time('Message sent!'));
    } else {
        // make sure the tag exists first
        // internally get the count
        // call the watcher class (I guess?)
        return ctx.wrapper.getTagJSONByName(tagString)
            .then((data) => {
                // an empty array is returned on no result
                if (data.length < 1) {
                    return ctx.reply(`Sorry, I couldn't find a tag named '${tagString}'. Make sure you aren't using ther shorthand for the tag!`)
                        .then(() => ctx.time('Message sent!'));
                }
                return ctx.reply(`Setting up hard coded event listener`)
                    .then(() => {
                        let tagWatcher = new TagWatcher(ctx, data[0].count);
                        return tagWatcher.subscribe();
                    })
            })
            .then(() => ctx.time('Message sent!'));
    }
}