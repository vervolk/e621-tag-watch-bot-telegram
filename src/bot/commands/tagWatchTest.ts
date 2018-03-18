'use strict';
// We want this to take the user's tag request and keep a watch for that specific tag count to
// change (up, not down due to deletes)

export default async function tagWatchTest(ctx) {
    ctx.resetTimer();
    ctx.time('Running e621 tests...');
    ctx.logger.debug(`TEST from ${JSON.stringify(ctx.message.from.username)}`);
    // Get the tag to watch split away from the command
    let tagString: string = ctx.message.text.substring(6);
    if (tagString.length < 1) {
        return ctx.reply(`Please give a test tag to get the count of along with the /test command`)
            .then(() => ctx.time('Message sent!'));
    } else {
        // Attempt to get the tag data
        return ctx.wrapper.getTagJSONByName(tagString)
            .then((data) => {
                // an empty array is returned on no result
                if (data.length < 1) {
                    return ctx.reply(`Sorry, I couldn't get a count for the tag: ${tagString}`)
                        .then(() => ctx.time('Message sent!'));
                }
                return ctx.reply(`Count: ${data[0].count}`);
            })
            .then(() => ctx.time('Message sent!'));
    }
}