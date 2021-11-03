const { MessageMentions: { USERS_PATTERN } } = require('discord.js');
const Command = require('../structures/Command.js');
const Nim = require('../structures/game/Nim.js');
const Errors = require('../structures/game/helpers/Errors.js');

function getUserFromMention(client, mention) {
    const matches = mention.match(USERS_PATTERN);
    if (!matches) return null;

    let match = matches[0];

    match = match.slice(2, -1);
    
    if (match.startsWith('!')) match = match.slice(1);

    return client.users.cache.get(match);
}

module.exports = new Command({
    name: 'game',
    description: 'Interact with a Nim game.',
    usage: [
        'game start <size:range(8:int,64:int)> <player1:str> [player2:str|cpu:bool]',
        'game stop <player1:str>',
        'game take <amount:range(1:int,3:int)>'
    ],
    permission: 'SEND_MESSAGES',
    
    async run(message, args, client) {

        // args[1] validation
        // no sub-command specified
        if (!args[1]) return message.channel.send(`${Errors.game.invalid.subcommand} ('${args[1]}')\n*See \`${client.prefix}help\` for help.*`);

        const sub_command = args[1];

        // switch sub-command
        switch (sub_command) {

            // 'start' sub-command
            case 'start':

                // args[2] validation
                // no size specified
                if (!args[2]) return message.channel.send(`${Errors.game.unspecified.size} (${args[2]})\n*See \`${client.prefix}help\` for help.*`);

                // non-number size parameter
                if (isNaN(parseInt(args[2]))) return message.channel.send(`${Errors.game.invalid.size} (${args[2]})\n*See \`${client.prefix}help\` for help.*`);    

                const size = args[2];
                
                // args[3] validation
                // no player 1 specified
                if (!args[3]) return message.channel.send(`${Errors.game.unspecified.player1} (${args[3]})\n*See \`${client.prefix}help\` for help.*`);

                // game already exists for player 1
                if (client.activeGames.checkAlreadyExists(args[3])) return message.channel.send(`${Errors.game.exists} (${args[3]})`);

                // player 1 parameter is not a user @
                if (!args[3].startsWith('<@') || !args[3].endsWith('>')) return message.channel.send(`${Errors.game.invalid.player1} (${args[3]})`);

                const player1 = args[3];

                // args[4] validation
                let player2;
                {
                    // player 2 / cpu parameter not specified, default to cpu
                    if (!args[4]) player2 = 'cpu';
    
                    // player 2 parameter is not a user @
                    else if (!args[4].startsWith('<@') && args[4].indexOf('cpu') == -1) return message.channel.send(`Failed to start game. See \`${client.prefix}help\` for help. (Invalid player2 or cpu argument)`);
    
                    else player2 = args[4];
                }

                // create game options
                const options = {
                    client: client,
                    size: size > 0 ? size : Nim.defaultSize,
                    channel: null,
                    player1: getUserFromMention(client, player1),
                    player2: getUserFromMention(client, player2),
                    cpu: player2 === 'cpu'
                };

                try {
                    // attempt to create new private thread
                    options.channel = await message.startThread({
                        name: `nim-${options.player1.id}`,
                        autoArchiveDuration: 60,
                        type: 'GUILD_PRIVATE_THREAD',
                        reason: 'A game of Nim created by ' + options.player1.tag
                    });

                    // add user(s) to thread
                    options.channel.members.add(options.player1.id);
                    if (!options.cpu) options.channel.members.add(options.player2.id);

                    // notify user of new game
                    message.channel.send(`Starting new game as **\`nim-${options.player1.id}\`**...`);

                    // create new game and add game to active games
                    client.activeGames.add(new Nim(options));
                }
                catch (e) {
                    console.error(e);
                    return message.channel.send(`${Errors.game.generic} (${Errors.game.failed.thread})`);
                }
                break;

            case 'take':

                // args[2] validation
                // amount parameter not specified
                if (!args[2]) return message.channel.send(`${Errors.game.unspecified.take.size}\n*See \`${client.prefix}help\` for help.*`);

                // non-number amount parameter
                if (isNaN(parseInt(args[2]))) return message.channel.send(`${Errors.game.invalid.take.size} (${args[2]})\n*See \`${client.prefix}help\` for help.*`);

                const instance = client.activeGames.getInstance(message.author);

                // instance validation
                // failed to find game instance
                if (!instance) return message.channel.send(`${Errors.game.invalid.take.instance}\n*See \`${client.prefix}help\` for help.*`);

                // check if it is user's turn
                if (instance.isTurn(message.author)) {

                    // change game amount by size specified
                    instance.changeAmount(parseInt(args[2]));

                    // if playing against cpu
                    if (instance.cpu) {
                        // play bot moves
                        const amt = instance.AI.makeTurn();
                        message.channel.send(`Nimble takes ${amt}.`);
                        instance.changeAmount(amt);
                    }
                }
                // player2's turn
                else {
                    // delete out-of-turn command from player1
                    if (message.content) setTimeout(() => message.delete(), 3000); // wait 3 seconds before deleting
                }
                break;

            case 'stop':
                try {
                    client.activeGames.remove(message.author);
                    message.channel.send(`Stopped game.`);
                }
                catch (e) {
                    console.error(e);
                    return message.channel.send(`${Errors.game.failed.stop}\nError: *${e.message}*`);
                }

        }

    }
});