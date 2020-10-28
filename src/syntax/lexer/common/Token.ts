import type Cursor from "./Cursor.ts";

export default class Token {
    public readonly name: string;
    // after tokenized, this will be a string.
    public readonly value: string|RegExp|null;
    public readonly special: boolean;
    public readonly position?: number;

    public constructor(name: string, value: string|RegExp|null, special: boolean, position?: number) {
        this.name = name;
        this.value = value;
        this.special = special;
        this.position = position;
    }

    public collect(cursor: Cursor, tokens: Token[], char: string): void {
        if (!this.special) {
            tokens.push(new Token(this.name, this.value, this.special, cursor.pos));
        } else {
            this.gather(cursor, tokens, char);
        }
    }

    public gather(cursor: Cursor, tokens: Token[], char: string): void {}
}

export class SpecialToken extends Token {
    public constructor(name: string) {
        super(name, null, true);
    }

    /**
     * Similar to "collect" but, returns whether the char
     * matches the current special token.
     */
    public test(cursor: Cursor, tokens: Token[], char: string): boolean {
        return false;
    }
}