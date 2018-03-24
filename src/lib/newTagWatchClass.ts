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
    private tagCount: number;
    private indexToWatch: number
    /**
     * Creates an instance of TagWatchInitializer.
     * @param {*} teleCtx Telegram bot context object
     * @param {*} botTelegramInstance The bot instance object
     * @param {userSingleRow} dbUserSet User's DB info
     * @param {number} indexToWatch 
     * @memberof TagWatchInitializer
     */
    constructor(teleCtx: any, botTelegramInstance: any, dbUserSet: userSingleRow, indexToWatch: number) {
        this.teleCtx = teleCtx;
        this.botTelegramInstance = botTelegramInstance;
        this.dbUserSet = dbUserSet;
        this.tagCount = 0;
        this.indexToWatch = indexToWatch;
    }

    /**
     * initialize a SINGLE tag watch for the given user
     * @returns void
     * @memberof TagWatchInitializer
     */
    initializeWatcher() {
        let originalCount: number = 0;
        console.log(this.dbUserSet);
        let watchlist = this.dbUserSet.watchlist.split(',')
        return this.getOriginalCount(watchlist[this.indexToWatch])
            .then((count: number) => {
                this.tagCount = count
                setInterval(this.setWatchInterval.bind(this, watchlist[this.indexToWatch]), 10 * 1000)
            })
    }

    private async setWatchInterval(tag: string) {
        console.log(`Private function for ${tag}`);
        let test = Fiber(() => {
            console.log(`Fiber function for ${tag}`);
            return this.teleCtx.wrapper.getTagJSONByName(tag)
                .then((data) => {
                    // Debugging
                    console.log(data[0]);
                    // Debugging
                    console.log(this.tagCount);
                    if (data[0].count !== this.tagCount) {
                        // update the counter
                        this.tagCount = data[0].count;
                        return this.botTelegramInstance.sendMessage(this.dbUserSet.teleid, `You've got new data for ${tag}`)
                            .then(() => {
                                // get the post
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
                        // Debugging
                        this.teleCtx.logger.debug(`No new data for ${tag} listener`);
                    }
                })
        })
        test.run();
        test = undefined;
        console.log('Back to private function');
        // this.botTelegramInstance.sendMessage(this.dbUserSet.teleid, this.dbUserSet.watchlist);
    }

    private async getOriginalCount(e621Tag: string) {
        let awaitChain = await this.teleCtx.wrapper.getTagJSONByName(e621Tag)
            .then((data) => {
                return data[0].count - 1;
            });
        return awaitChain;
    }
}