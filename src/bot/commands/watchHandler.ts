'use strict';
import TagWatchInitializer from '../../lib/newTagWatchClass';


// export default async function watcHandler(ctx) {
//     // TODO: Figure out how to use fiber to thread out the watch for each user!

//     ctx.resetTimer();
//     ctx.time('Running watch handler...');
//     ctx.logger.debug(`/watch from ${JSON.stringify(ctx.message.from.username)}`)
//     // Get the tag to search split away from the command
//     let tagString: string = ctx.message.text.substring(7);
//     if (tagString.length < 1) {
//         return ctx.reply(`Please give a test tag to watch for you`)
//             .then(() => ctx.time('Message sent!'));
//     } else {
//         // make sure the tag exists first
//         // internally get the count
//         // call the watcher class (I guess?)
//         return ctx.wrapper.getTagJSONByName(tagString)
//             .then((data) => {
//                 // an empty array is returned on no result
//                 if (data.length < 1) {
//                     return ctx.reply(`Sorry, I couldn't find a tag named '${tagString}'. Make sure you aren't using ther shorthand for the tag!`)
//                         .then(() => ctx.time('Message sent!'));
//                 }
//                 return ctx.reply(`Setting up hard coded event listener`)
//                     .then(() => {
//                         let tagWatcher = new TagWatcher(ctx, data[0].count);
//                         return tagWatcher.subscribe();
//                     })
//             })
//             .then(() => ctx.time('Message sent!'));
//     }
// }

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
