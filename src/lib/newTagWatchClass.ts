'use strict';
import { userSingleRow } from '../db/database';
import Fiber from 'fibers';

// We want this class to support just having the user's ID and their tags for this

// This WILL NOT be what handles the /watch command, this is simply hoisting the listeners 
// from the DB
export default class TagWatchInitializer {
    private teleCtx: any;
    private botTelegramInstance: any
    private dbUserSet: userSingleRow;
    constructor(teleCtx: any, botTelegramInstance: any, dbUserSet: userSingleRow) {
        this.teleCtx = teleCtx;
        this.botTelegramInstance = botTelegramInstance;
        this.dbUserSet = dbUserSet;
    }

    test() {
        console.log(this.dbUserSet)
        let watchlist = this.dbUserSet.watchlist.split(',')
        setInterval(this.intervalTest.bind(this, watchlist[0]), 5 * 1000)
    }

    private async intervalTest(tag: string) {
        console.log(`Private function for ${tag}`);
        let test = Fiber(() => {
            console.log(`Fiber function for ${tag}`);
            // console.log(BEH);
            let originalCount: number;
            return this.getOriginalCount(tag)
                .then((count: number) => {
                    this.teleCtx.wrapper.getTagJSONByName(tag)
                        .then((data) => {
                            console.log(data[0])
                            // if (data[0].count !== BEH) {
                            //     // update the counter
                            //     BEH = data[0].count;
                            //     // blacklist test
                            //     return this.teleCtx.reply(`You've got new data for ${this.tag}`)
                            //         .then(() => {
                            //             // get the post (I think)
                            //             this.teleCtx.wrapper.getE621PostIndexPaginate(this.tag, 0, 1, 1)
                            //                 .then((response) => {
                            //                     if (response[0][0].tags.includes('canine') == false) {
                            //                         let reply = this.teleCtx.wrapper.generateE621PostUrl(response[0][0].id)
                            //                         return this.teleCtx.reply(reply);
                            //                     } else {
                            //                         return this.teleCtx.reply(`Post includes test blacklist 'canine', skipping`);
                            //                     }
                            //                 })
                            //         })
                            // } else {
                            //     this.teleCtx.logger.debug(`No new data for ${this.tag} listener`);
                            // }
                        })
                })
        })
        test.run();
        console.log('Back to private function');
        // this.botTelegramInstance.sendMessage(this.dbUserSet.teleid, this.dbUserSet.watchlist);
    }

    private async getOriginalCount(e621Tag: string) {
        return this.teleCtx.wrapper.getTagJSONByName(e621Tag)
            .then((data) => {
                return data[0].count;
            })
    }
}