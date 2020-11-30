export default class Cursor {
    // Position in the current feed
    #position: number;
    // Feed
    #script: string;

    public constructor(script: string) {
        this.#position = -1;
        this.#script = script;
    }

    public get pos(): number {
        return this.#position;
    }

    public set pos(num: number) {
        if (num > this.#script.length) {
            throw new Error('Cursor is at EOF.');
        } else {
            this.#position = num;
        }
    }

    /**
     * Checks whether the position is within the script
     */
    public withinBounds(): boolean {
        return this.#position < this.#script.length;
    }

    /**
     * Reads the next character
     */
    public peek(): string {
        return this.#script[++this.pos];
    }

    /**
     * Reads the next character
     */
    public unpeek(): string {
        return this.#script[--this.pos];
    }

    /**
     * Gets a char at a specific pos, will not update pos
     */
    public getCharAt(pos: number): string {
        if (pos < this.#script.length) {
            return this.#script[pos];
        } else {
            return '';
        }
    }

    /**
     * Compares the given character to the next, and checks if it matches.
     * @param peek - Character or predicate to peek
     */
    public nextIs(peek: string|RegExp): boolean {
        if (peek instanceof RegExp) {
            return peek.test(this.peek());
        } else {
            return this.peek() === peek;
        }
    }

    /**
     * Reads the current script until the EOF.
     */
    public *read(): Generator<string, boolean, boolean>{
        while (this.pos < this.#script.length) {
            try {
                yield this.peek();
            } catch {
                return false;
            }
        }
        return true;
    }

    /**
     * Reads the current script until the EOF, and returns all tokens read.
     */
    public readUntilEOF() {
        const iter = this.read();
        const char = iter.next();
        const chars: string[] = [];
        while (!char.done) {
            chars.push(char.value);
        }
        return chars;
    }
}