'use strict';
import TagWatchInitializer from '../../lib/newTagWatchClass';

export default async function watcHandler(ctx) {

    // GET or CREATE the user in the DB and add the tag send through watch by the
    // user.
    // start a new watcher thread for the user and the tag
    ctx.logger.debug(`/watch from ${JSON.stringify(ctx.message.from.username)}`)


    // Get the tag to search split away from the command
    let tagString: string = ctx.message.text.substring(7);
    if (tagString.length < 1) {
        return ctx.reply(`Please give a test tag to watch for you`)
            .then(() => ctx.time('Message sent!'));
    } else {
        return ctx.db.getUserDataByID(ctx.message.from.id)
            .then((userData) => {
                // Update their tag watch set (somehow)
                console.log(userData)
            })
            .catch((err) => {
                // User is not in the DB
                // add the user
                ctx.db.addUser(ctx.message.from.id, tagString, '')
                    .then((result) => {
                        // then get their object to pass into the watch thread
                        return ctx.db.getUserDataByID(ctx.message.from.id)
                            .then((userData) => {
                                let userWatchThread = new TagWatchInitializer(ctx, ctx.telegram, userData, 0);
                                userWatchThread.initializeWatcher();

                                return ctx.reply(`Adding you to the database @${ctx.message.from.username}, you're now watching the tag:  ${ctx.message.text.substring(7)}`)
                            })
                    })
            })
    }

}
