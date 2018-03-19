'use strict';

export default async function relatedTagTest(ctx) {
    ctx.resetTimer();
    ctx.time('Running e621 related tests...');
    ctx.logger.debug(`/related from ${JSON.stringify(ctx.message.from.username)}`)
    // Get the tag to search split away from the command
    let tagString: string = ctx.message.text.substring(9);
    if (tagString.length < 1) {
        return ctx.reply(`Please give a test tag to get the related tags of with the the /related command`)
            .then(() => ctx.time('Message sent!'));
    } else {
        // Attempt to get the tag's related data
        return ctx.wrapper.getRelatedTagsByName(tagString)
            .then((data) => {
                if (data.length == 0) {
                    return ctx.reply(`Sorry, I couldn't get a set of related tags for the tag: ${ctx.message.text.substring(9)}`)
                }
                let messageArray = [];
                data.forEach(element => {
                    messageArray.push(`Tag: ${element[0]}, 24HR Popularity index: ${element[1]}`)
                });
                return ctx.reply(messageArray.join('\n'))
            })
            .then(() => ctx.time('Message sent!'));
    }
}