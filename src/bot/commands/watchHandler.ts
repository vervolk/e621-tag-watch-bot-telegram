'use strict';

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
                        setInterval(testInterval.bind(ctx), 5000)
                    })

            })
            .then(() => ctx.time('Message sent!'));
    }
}


function testInterval() {
    console.log(this)
    this.wrapper.getTagJSONByName(this.message.text.substring(7))
        .then((data) => {
            return this.reply(data)
        })
}