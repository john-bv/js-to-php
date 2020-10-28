import tokenize from "./src/syntax/lexer/common/Tokenizer.ts";
import { Tokens } from "./src/syntax/lexer/js/Tokens.ts";

console.log(tokenize(`
    const test = 'no';
    const test2 = 20;
`, Tokens));