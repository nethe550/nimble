const { readdirSync } = require('fs');
const Discord = require('discord.js');

const Command = require('./Command.js');
const Event = require('./Event.js');

const ActiveGames = require('./game/ActiveGames.js');

const config = require('../../config.json');

class Client extends Discord.Client {

    constructor() {
        super({
            intents: [
                Discord.Intents.FLAGS.GUILDS,
                Discord.Intents.FLAGS.GUILD_MESSAGES
            ],
            // prevent user @ pings
            allowedMentions: { repliedUser: false }
        });

        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.commands = new Discord.Collection();
        this.prefix = config.prefix;

        this.copyright = 'Nimble © 2021-2022';

        /**
         * @type {ActiveGames}
         */
        this.activeGames = new ActiveGames();
    }

    start(token) {
        console.log('='.repeat(32));
        console.log('\tCommands');

        // dynamically load commands
        readdirSync("./src/commands").filter(file => file.endsWith('.js'))
        .forEach(file => {
            /**
             * @type {Command}
             */
            const command = require(`../commands/${file}`);
            console.info(`     - Loaded command '${command.name}'.`)
            this.commands.set(command.name, command);
        });

        console.log('='.repeat(32));
        console.log('\tEvents');

        // dynamically load events
        readdirSync('./src/events').filter(file => file.endsWith('.js'))
            .forEach(file => {
                /**
                 * @type {Event}
                 */
                const event = require(`../events/${file}`);
                console.info(`     - Loaded event '${event.event}'.`);
                this.on(event.event, event.run.bind(null, this));
            });

        // connect bot to API
        this.login(token);

        console.log('='.repeat(32));
    }

    isCommand(name) {
        return this.commands.has(name);
    }

    getCommand(name) {
        return this.commands.get(name);
    }

    static formatString(str) {
        return str.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    }

}

module.exports = Client;