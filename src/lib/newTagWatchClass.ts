import { userSingleRow } from '../db/database';

// We want this class to support just having the user's ID and their tags for this

// This WILL NOT be what handles the /watch command, this is simply hoisting the listeners 
// from the DB

export default class TagWatchInitializer {
    private botTelegramInstance: any
    private dbUserSet: userSingleRow;
    constructor(botTelegramInstance: any, dbUserSet: userSingleRow) {
        this.botTelegramInstance = botTelegramInstance;
        this.dbUserSet = dbUserSet;
    }


    test() {
        setInterval(this.intervalTest.bind(this), 5 * 1000)
    }

    private intervalTest() {
        this.botTelegramInstance.sendMessage(this.dbUserSet.teleid, 'SUPER FOX')
    }
}