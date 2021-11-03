const Command = require('../structures/Command.js');

module.exports = new Command({
    name: 'ping',
    description: 'Pings the bot and the Discord API.',
    usage: 'ping',
    permission: 'SEND_MESSAGES',
    
    async run(message, args, client) {

        const msg = await message.reply(`API Ping: ${client.ws.ping}ms.`);

        msg.edit(`API Ping: ${client.ws.ping}ms.\nMessage Ping: ${msg.createdTimestamp - message.createdTimestamp}ms.`);
    }
});