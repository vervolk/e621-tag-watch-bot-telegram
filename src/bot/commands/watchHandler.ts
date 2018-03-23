'use strict';
import TagWatchInitializer from '../../lib/newTagWatchClass';
import { userSingleRow } from '../../db/database';

// TODO: Validate any tags that are given to this
// TODO: We'll want to actually find a way to thread these like the ones at the start
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
            .then((userData: userSingleRow) => {
                // Update their tag watch set (somehow)
                let watchlist = userData.watchlist.split(',');
                watchlist.push(ctx.message.text.substring(7));
                return ctx.db.modifyUserWatchList(ctx.message.from.id, watchlist.join(','))
                .then((results) => {
                    // console.log(results)
                    return ctx.reply(`Got it, adding '${ctx.message.text.substring(7)} to your watch list'`);
                })
                .catch((err) => {
                    ctx.telegram.sendMessage()
                    console.log(err)
                })
                // create a new thread for that watch set
            })
            .catch((err) => {
                // User is not in the DB
                // add the user
                return ctx.db.addUser(ctx.message.from.id, tagString, '')
                    .then((result) => {
                        // then get their object to pass into the watch thread
                        return ctx.db.getUserDataByID(ctx.message.from.id)
                            .then((userData) => {
                                // create and initialize the thread for watching
                                let userWatchThread = new TagWatchInitializer(ctx, ctx.telegram, userData, 0);
                                userWatchThread.initializeWatcher();
                                // let the user know
                                return ctx.reply(`Adding you to the database @${ctx.message.from.username}! You're now watching the tag:  ${ctx.message.text.substring(7)}`);
                            })
                    })
            })
    }
}
