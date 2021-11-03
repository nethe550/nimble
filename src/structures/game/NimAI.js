class NimAI {
    constructor(size, remaining) {
        this.size = size;
        this.remaining = remaining;
    }

    updateBoard(remaining) {
        this.remaining = remaining;
    }

    makeTurn() {
        // yeah, its really that simple
        return this.remaining % 4;

    }
}

module.exports = NimAI;