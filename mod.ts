import tokenize from "./src/lexer/common/Tokenizer.ts";
import { Tokens } from "./src/lexer/js/Tokens.ts";

console.log(tokenize(`
    const test = 'no';
    const test2 = 20;
`, Tokens));