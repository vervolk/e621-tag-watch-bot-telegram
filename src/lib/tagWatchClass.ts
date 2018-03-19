
// This class will  be async and spawn a child process to work as a listenner for tags
// by periodically scanning e621 for posts with the tags provided


export default class TagWatcher {
    private teleCtx: any;
    private originalCount: number
    constructor(teleCtx: any, originalCount: number) {
        this.teleCtx = teleCtx;
        this.originalCount = originalCount
    }
    subscribe() {
        setInterval(this.subscribeTest.bind(this), 15 * 1000)
    }

    private subscribeTest() {
        // this is where we spawn a new process and set a check interval
        console.log(this.originalCount)
        this.teleCtx.wrapper.getTagJSONByName(this.teleCtx.message.text.substring(7))
            .then((data) => {
                console.log(data[0])
                if (data[0].count !== this.originalCount) {
                    // update the counter
                    this.originalCount = data[0].count
                    return this.teleCtx.reply(`You've got new data aaaaa`)
                        .then(() => {
                            // get the post (I think)
                            this.teleCtx.wrapper.getE621PostIndexPaginate('fox', 0, 1, 1)
                                .then((response) => {
                                    let reply = this.teleCtx.wrapper.generateE621PostUrl(response[0][0].id)
                                    return this.teleCtx.reply(reply)
                                })
                        })
                } else {
                    this.teleCtx.logger.debug('No new data on the listener')
                }
            })
    }
}