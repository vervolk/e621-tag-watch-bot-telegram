

// For now just have this remove the person sending the message

export default async function watcHandler(ctx) {

    // GET or CREATE the user in the DB and add the tag send through watch by the
    // user.
    // start a new watcher thread for the user and the tag
    ctx.logger.debug(`/unwatch from ${JSON.stringify(ctx.message.from.username)}`);

    return ctx.db.removeUser(ctx.message.from.id)
        .then(() => {
            ctx.reply(`You are no longer in the database (later you'll be able to unwatch specific tags)`)
        })
        // TODO: Make this better eventually
        .catch((err) => {
            return ctx.reply('Looks like something went wrong')
        })

}