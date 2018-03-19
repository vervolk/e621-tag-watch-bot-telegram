
// This class will  be async and spawn a child process to work as a listenner for tags
// by periodically scanning e621 for posts with the tags provided
let Fiber = require('fibers');


export default class TagWatcher {
    private teleCtx: any;
    private originalCount: number;
    private tag: string;
    constructor(teleCtx: any, originalCount: number) {
        this.teleCtx = teleCtx;
        this.originalCount = originalCount
        this.tag = this.teleCtx.message.text.substring(7);
    }
    subscribe() {
        setInterval(this.fiberTest.bind(this), 15 * 1000)
    }

    private fiberTest() {
        console.log(`Private function for ${this.tag}`);
        let test = Fiber(() => {
            console.log(`Fiber function for ${this.tag}`);
            console.log(this.originalCount);
            this.teleCtx.wrapper.getTagJSONByName(this.tag)
                .then((data) => {
                    console.log(data[0])
                    if (data[0].count !== this.originalCount) {
                        // update the counter
                        this.originalCount = data[0].count
                        return this.teleCtx.reply(`You've got new data for ${this.tag}`)
                            .then(() => {
                                // get the post (I think)
                                this.teleCtx.wrapper.getE621PostIndexPaginate(this.tag, 0, 1, 1)
                                    .then((response) => {
                                        let reply = this.teleCtx.wrapper.generateE621PostUrl(response[0][0].id)
                                        return this.teleCtx.reply(reply);
                                    })
                            })
                    } else {
                        this.teleCtx.logger.debug(`No new data for ${this.tag} listener`);
                    }
                })
        })
        test.run();
        console.log('Back to private function');
    }
}