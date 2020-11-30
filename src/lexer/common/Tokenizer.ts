import Cursor from './Cursor.ts';
import Token, { SpecialToken } from "./Token.ts";

export default function tokenize(script: string, knownTokens: Token[]): Token[] {
    const cursor: Cursor = new Cursor(script);
    const tokens: Token[] = [];

    while (cursor.withinBounds()) {
        const char: string = cursor.peek();
        for (let token of knownTokens) {
            if (token.value instanceof RegExp) {
                if (token.value.test(char)) {
                    token.collect(cursor, tokens, char);
                    break;
                }
            } else if (token instanceof SpecialToken) {
                // it's a super special token!
                let res: boolean = token.test(cursor, tokens, char);
                if (!res) {
                    continue;
                } else {
                    break;
                }
            } else {
                if (token.value === char) {
                    token.collect(cursor, tokens, char);
                    break;
                }
            }
        }
    }

    return tokens;
}