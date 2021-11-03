const Discord = require('discord.js');
const Client = require('../structures/Client.js');
const Command = require('../structures/Command.js');

module.exports = new Command({
    name: 'help',
    description: 'Displays relevant information for Nimble.',
    usage: 'help [command_name:str]',
    permission: 'SEND_MESSAGES',
    
    run(message, args, client) {
        
        // if specific command specified
        if (args[1]) {
            
            // args[1] validation
            // if args[1] is command
            const getCommand = () => {
                return client.commands.find(command => command.name == args[1]);
            }

            const command = getCommand();

            if (!command) return message.channel.send(`Unknown command. (${args[1]})`);

            const options = {
                title: `Help (${client.prefix})`,
                description: `\`${Client.formatString(args[1])}\` Command:`,
                url: 'https://the-index.info/',
                timestamp: message.createdTimestamp,
                color: 'RANDOM',
                author: {
                    name: client.user.username,
                    url: 'https://the-index.info/',
                    iconURL: client.user.avatarURL({ dynamic: true })
                },
                thumbnail: client.user.avatarURL({ dynamic: true }),
                footer: client.copyright,
                fields: [
                    {
                        name: Client.formatString(command.name),
                        value: `\t${command.description}\n\tUsage: \n\`${typeof(command.usage) == 'string' ? command.usage : command.usage.join('\n')}\``,
                        inline: false
                    }
                ]
            }

            return message.channel.send({
                embeds: [new Discord.MessageEmbed(options)]
            });

        }
        else {
            const options = {
                title: `Help (${client.prefix})`,
                description: 'Nimble Commands:',
                url: 'https://the-index.info/',
                timestamp: message.createdTimestamp,
                color: 'RANDOM',
                author: {
                    name: client.user.username,
                    url: 'https://the-index.info/',
                    iconURL: client.user.avatarURL({ dynamic: true })
                },
                thumbnail: client.user.avatarURL({ dynamic: true }),
                footer: client.copyright,
                fields: []
            }
    
            client.commands.forEach(command => {
                const childEmbed = {
                    name: Client.formatString(command.name),
                    value: `\t${command.description}\n\tUsage: \n\`${typeof(command.usage) == 'string' ? command.usage : command.usage.join('\n')}\``,
                    inline: false
                }
                options.fields.push(childEmbed);
            });
    
            return message.channel.send({
                embeds: [new Discord.MessageEmbed(options)]
            });
        }


    }
});