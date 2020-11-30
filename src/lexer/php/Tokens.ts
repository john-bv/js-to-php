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
            '__halt_compiler()',
            'abstract',
            'and',
            'array',
            'as',
            'break',
            'callable',
            'case',
            'catch',
            'class',
            'clone',
            'const',
            'continue',
            'declare',
            'default',
            'die',
            'do',
            'echo',
            'else',
            'elseif',
            'empty',
            'enddeclare',
            'endfor',
            'endforeach',
            'endif',
            'enendswitch',
            'endwhile',
            'eval',
            'exit',
            'extends',
            'final',
            'finally',
            'fn',
            'for',
            'foreach',
            'function',
            'global',
            'goto',
            'if',
            'implements',
            'include',
            'include_once',
            'instanceof',
            'insteadof',
            'interface',
            'isset',
            'list',
            'namespace',
            'new',
            'or',
            'print',
            'private',
            'protected',
            'public',
            'require',
            'require_once',
            'return',
            'static',
            'switch',
            'throw',
            'trait',
            'try',
            'unset',
            'use',
            'var',
            'while',
            'xor',
            'yield',
            'from'
        ];
        const cachedPos: number = cursor.pos;
        const iter = cursor.read()
        const MAX_PEEK: number = 17;
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