import type Cursor from "../common/Cursor.ts";
import Token, { SpecialToken } from "../common/Token.ts";

export class Numeric extends SpecialToken {
    public constructor() {
        super('Numeric');
    }

    public test(cursor: Cursor, tokens: Token[], char: string): boolean {
        const reg: RegExp = /[0-9]/;
        let number: string = '';

        if (!reg.test(char)) return false;

        if (cursor.nextIs('.')) {
            // floating point
            number = `${char}.${cursor.peek()}`;
        } else if (reg.test(cursor.getCharAt(cursor.pos))) {
            number = `${char}${cursor.getCharAt(cursor.pos)}`;
        } else {
            return false;
        }

        const iter = cursor.read();
        let curr = iter.next();
        while (!curr.done) {
            if (reg.test(curr.value)) {
                number += curr.value;
                curr = iter.next();
            } else {
                break;
            }
        }
        tokens.push(new Token('Numeric', number, false, cursor.pos));
        return true;
    }
}

export class BoolLiteral extends Token {
    public constructor() {
        super('BoolLiteral', /(true|false)/m, false);
    }
}

export class KeyWord extends SpecialToken {
    public constructor() {
        super('KeyWord');
    }

    public test(cursor: Cursor, tokens: Token[], char: string): boolean {
        const keywords: string[] = [
            'await',
            'async',
            'break',
            'case',
            'catch',
            'class',
            'continue',
            'const',
            'debugger',
            'default',
            'delete',
            'do',
            'else',
            'enum',
            'export',
            'extends',
            'finally',
            'for',
            'function',
            'if',
            'in',
            'instanceof',
            'import',
            'let',
            'new',
            'of',
            'return',
            'super',
            'switch',
            'this',
            'throw',
            'try',
            'typeof',
            'var',
            'void',
            'while',
            'with',
            'yield'
        ];
        const cachedPos: number = cursor.pos;
        const iter = cursor.read()
        const MAX_PEEK: number = 9;
        let keyword: string = char;
        let curr = iter.next();

        while (!curr.done) {
            if (cachedPos + MAX_PEEK < cursor.pos) {
                // token is invalid, continue.
                break;
            } else {
                try {
                    keyword += curr.value;

                    if (keywords.includes(keyword)) {
                        break;
                    }

                    curr = iter.next();
                } catch {
                    break;
                }
            }
        }

        if (!keywords.includes(keyword)) {
            cursor.pos = cachedPos;
            return false;
        } else {
            tokens.push(new Token('KeyWord', keyword, false, cursor.pos));
            return true;
        }
    }
}

export class StringLiteral extends Token {
    public constructor() {
        super('StringLiteral', /(\'|")/m, true);
    }

    public gather(cursor: Cursor, tokens: Token[], char: string): void {
        let str: string = cursor.peek();

        if ((this.value as RegExp).test(str) && char === str) {
            tokens.push(new Token('StringLiteral', "", false, cursor.pos));
            return;
        }

        const iter = cursor.read();
        let curr = iter.next();

        while (!curr.done) {
            // we need to check for the end or a end of number
            if (curr.value === char) {
                break;
            } else {
                if (/\\/.test(curr.value)) {
                    if (cursor.nextIs(char)) {
                        str += curr.value + char;
                    } else {
                        const ahead: string = cursor.getCharAt(cursor.pos);
                        str += curr.value + ahead;
                    }
                } else {
                    str += curr.value;
                }
                curr = iter.next();
            }
        }
        tokens.push(new Token('StringLiteral', str, false, cursor.pos));
    }
}

export const Tokens: Token[] = [
    new KeyWord,
    new Numeric,
    new BoolLiteral,
    new StringLiteral,
];