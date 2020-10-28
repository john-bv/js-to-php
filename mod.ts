import tokenize from "./src/syntax/common/Tokenizer.ts";
import { Tokens } from "./src/syntax/js/Tokens.ts";

console.log(tokenize(`
    const test = 'no';
    const test2 = 20;
`, Tokens));