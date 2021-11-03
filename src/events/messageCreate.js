const Event = require('../structures/Event');

module.exports = new Event('messageCreate', (client, message) => {
    // ignore bot messages
    if (message.author.bot) return;

    // ignore messages without the prefix
    if (!message.content.startsWith(client.prefix)) return;

    // extract args from raw message string
    const args = message.content.substring(client.prefix.length).split(/ +/);

    // dynamically find command from name
    const command = client.commands.find(cmd => cmd.name == args[0]);
    
    // respond with failiure if command is not found
    if (!command) return message.reply(`Invalid command '${args[0]}'.`);

    // check if user has command's required permission
    const permission = message.member.permissions.has(command.permission);

    // respond with failiure if member doesn't have permission
    if (!permission) return message.reply(`Insufficient permission. (Missing '${command.permission}')`);

    // execute command
    command.run(message, args, client);
});