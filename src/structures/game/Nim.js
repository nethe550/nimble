const Discord = require('discord.js');
const Client = require('../Client.js');
const NimAI = require('./NimAI.js');

class Nim {

    defaultSize = 12;

    /**
     * @typedef {{client: Client, size: Number, channel: Discord.ThreadChannel, player1: Discord.User, player2: Discord.User, cpu: boolean}} GameOptions
     * @param {GameOptions} options 
     */
    constructor(options) {
        this.client = options.client;
        this.size = this.clamp(options.size, 8, 64);
        this.remaining = this.size;
        this.channel = options.channel;
        this.player1 = options.player1;
        this.cpu = options.cpu;

        this.turn = true; // player1: true | player2: false

        if (!this.cpu) this.player2 = options.player2;

        this.pieceChar = '⏺';

        if (this.cpu) {
            this.AI = new NimAI(this.size, this.remaining);
        }

        this.init();
        this.drawBoard();
    }

    init() {
        this.gameData = {
            title: `Nim (${this.player1.username} vs ${this.player2 && this.player2.username ? this.player2.username : "CPU"})`,
            description: `Remaining: ${this.remaining}`,
            url: 'https://the-index.info/',
            timestamp: Date.now(),
            color: 'RANDOM',
            author: {
                name: this.client.user.username,
                url: 'https://the-index.info/',
                iconURL: this.client.user.avatarURL({ dynamic: true })
            },
            footer: this.client.copyright,
            fields: [
                {
                    name: "Game:",
                    value: `${this.pieceChar.repeat(this.remaining) != '' ? this.pieceChar.repeat(this.remaining) : this.getWinner()}`,
                    inline: false
                }
            ]
        }
        this.embed = new Discord.MessageEmbed(this.gameData);
    }

    shutdown() {
        this.channel.send(`Exiting game in 20 seconds...`);
        this.client.activeGames.remove(this.player1, true);
    }

    getWinner() {
        let str = '';
        if (this.remaining <= 0) {
            if (this.turn) str = `${this.player1.username} wins!`;
            else str = `${this.player2 ? this.player2.username : 'CPU'} wins!`;
            this.shutdown();
            return str;
        }
    }

    drawBoard() {
        if (this.channel) {
            this.channel.send({ embeds: [this.embed] });
        }
    }

    updateBoard() {
        if (this.cpu && this.AI) {
            this.AI.updateBoard(this.remaining);
        } 

        this.gameData.description = `Remaining: ${this.remaining}`;
        this.gameData.timestamp = Date.now();
        this.gameData.fields[0].value = `${this.pieceChar.repeat(this.remaining) != '' ? this.pieceChar.repeat(this.remaining) : this.getWinner()}`;
        this.embed = new Discord.MessageEmbed(this.gameData);
    }

    /**
     * @param {Number} amt 
     * @returns {Number} clamped amount
     */
    clamp(amt, min, max) {
        if (amt < min) return min;
        if (amt > max) return max;
        else return amt;
    }

    /**
     * @param {Number} amount
     */
    changeAmount(amount) {
        amount = this.clamp(amount, 1, 3);

        if (this.remaining - amount >= 0) {
            this.remaining -= amount;
            this.updateBoard();
        }
        else {
            this.channel.send(`Can't take ${amount} from ${this.remaining}!`);
            this.drawBoard();
            return;
        }
        
        this.turn = !this.turn;
        this.drawBoard();
    }

    joinThread() {
        if (this.channel.joinable) this.channel.join();
    }

    leaveThread() {
        this.channel.leave();
    }

    deleteThread() {
        this.channel.delete();
    }

    /**
     * @param {Discord.User} user 
     * @returns {boolean} is user's turn?
     */
    isTurn(user) {
        if (this.turn && this.player1.id == user.id) return true;
        if (!this.turn && this.player2 && this.player2.id == user.id) return true;
        return false;
    }
}

module.exports = Nim;