class Errors {

    static game = {
        generic: `Failed to start game.`,
        exists: `You already have a game running.`,
        unspecified: {
            size: `Missing size argument.`,
            player1: `Missing player 1 argument.`,
            take: {
                size: `You need to specify an amount to take.`
            }
        },
        invalid: {
            subcommand: `Invalid sub-command.`,
            size: `Size argument not a number.`,
            player1: `Player 1 argument must be a user mention "@".`,
            take: {
                size: `Amount argument not a number.`,
                instance: `Couldn't find your game instance. Try starting a new game.`
            }
        },
        failed: {
            thread: `Failed to initialize thread`,
            stop: `Failed to stop game.`
        }
    }

}

module.exports = Errors;