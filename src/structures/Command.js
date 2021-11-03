const Discord = require('discord.js');
const Client = require('./Client.js');

/**
 * 
 * @param {Discord.Message} message 
 * @param {string[]} args 
 * @param {Client} client 
 */
const RunFunction = (message, args, client) => { return; };

class Command {

    /**
     * @typedef {{name: string, description: string, usage: string, permission: Discord.PermissionString, run: RunFunction}} CommandOptions
     * @param {CommandOptions} options 
     */
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.usage = options.usage;
        this.permission = options.permission;
        this.run = options.run;
    }

}

module.exports = Command;