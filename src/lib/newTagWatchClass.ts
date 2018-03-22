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
    private tagCount: number
    constructor(teleCtx: any, botTelegramInstance: any, dbUserSet: userSingleRow) {
        this.teleCtx = teleCtx;
        this.botTelegramInstance = botTelegramInstance;
        this.dbUserSet = dbUserSet;
        this.tagCount = 0
    }

    test() {
        let originalCount: number = 0;
        console.log(this.dbUserSet)
        let watchlist = this.dbUserSet.watchlist.split(',')
        return this.getOriginalCount(watchlist[0])
            .then((count: number) => {
                this.tagCount = count
                setInterval(this.intervalTest.bind(this, watchlist[0]), 10 * 1000)
            })
    }

    private async intervalTest(tag: string) {
        console.log(`Private function for ${tag}`);
        let test = Fiber(() => {
            console.log(`Fiber function for ${tag}`);
            this.teleCtx.wrapper.getTagJSONByName(tag)
                .then((data) => {
                    console.log(data[0])
                    console.log(this.tagCount)
                    if (data[0].count !== this.tagCount) {
                        // update the counter
                        this.tagCount = data[0].count;
                        return this.botTelegramInstance.sendMessage(this.dbUserSet.teleid, `You've got new data for ${tag}`)
                            .then(() => {
                                // get the post (I think)
                                this.teleCtx.wrapper.getE621PostIndexPaginate(tag, 0, 1, 1)
                                    .then((response) => {
                                        // blacklist test
                                        // if (response[0][0].tags.includes('canine') == false) {
                                        let reply = this.teleCtx.wrapper.generateE621PostUrl(response[0][0].id)
                                        return this.botTelegramInstance.sendMessage(this.dbUserSet.teleid, reply);
                                        // } else {
                                        //     return this.botTelegramInstance.sendMessage(this.dbUserSet.teleid, `Post includes test blacklist 'canine', skipping`);
                                        // }
                                    })
                            })
                    } else {
                        this.teleCtx.logger.debug(`No new data for ${tag} listener`);
                    }
                })
        })
        test.run();
        console.log('Back to private function');
        // this.botTelegramInstance.sendMessage(this.dbUserSet.teleid, this.dbUserSet.watchlist);
    }

    private async getOriginalCount(e621Tag: string) {
        return this.teleCtx.wrapper.getTagJSONByName(e621Tag)
            .then((data) => {
                return data[0].count - 1;
            })
    }
}