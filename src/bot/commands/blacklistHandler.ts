'use strict';

// Allow a user to add/removed tags from their blacklist

export default async function blacklistHandler(ctx) {
    ctx.logger.debug(`/blacklist from ${JSON.stringify(ctx.message.from.username)}`);
    let tagString: string = ctx.message.text.trim().substring(10);
    console.log(tagString)
}