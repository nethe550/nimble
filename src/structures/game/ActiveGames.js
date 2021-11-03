const Discord = require('discord.js');
const Nim = require('./Nim.js');

class ActiveGames {
    /**
     * @param {Discord.ThreadChannel[]} prev The previous active games
     */
    constructor(prev=null) {
        this.activeGames = prev || [];
    }

    /**
     * @param {Nim} game 
     * @returns {Nim} game
     */
    add(game) {
        this.activeGames[game.player1.id] = game;

        this.activeGames[game.player1.id].init();
        this.activeGames[game.player1.id].joinThread();

        return this.activeGames[game.player1.id];
    }

    /**
     * @param {Discord.User} user the player1 user
     * @param {boolean} delayCloseThread delay closing the thread?
     * @param {boolean} threadCloseDelay how long to delay the thread close (in seconds)
     * @returns {Nim} the deleted game instance
     */
    async remove(user, delayCloseThread=false, threadCloseDelay=20) {
        try {
            if (this.activeGames[user.id]) {
                this.activeGames[user.id].leaveThread();

                if (!delayCloseThread) this.activeGames[user.id].deleteThread();
                else {
                    const deleteThread = new Promise((resolve) => {
                        setTimeout(() => {
                            this.activeGames[user.id].deleteThread();
                            resolve();
                        }, threadCloseDelay * 1000); // wait before closing thread
                    });
                    await deleteThread;
                }

                const ret = this.activeGames[user.id];
                    delete this.activeGames[user.id];
                    return ret;
            }
        }
        // catches situations where the thread was archived or closed by the user manually
        catch (e) {
            console.warn(e);
        }
        return false;
    }

    /**
     * @param {Discord.User} user 
     * @return {boolean} exists?
     */
    checkAlreadyExists(user) {
        if (this.activeGames[user.id]) return true;
        return false;
    }

    /**
     * @param {Discord.User} user 
     * @returns {Nim} game instance
     */
    getInstance(user) {
        for (let game in this.activeGames) {
            if (user.id == this.activeGames[game].player1.id) return this.activeGames[game];
            else if (this.activeGames[game].player2 && user.id == this.activeGames[game].player2.id) return this.activeGames[game];
        }
        return null;
    }
}

module.exports = ActiveGames;