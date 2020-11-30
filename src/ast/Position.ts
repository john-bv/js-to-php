export default class Position {
    public line: number = 0;
    public column: number = 0;

    public get lineValid(): boolean {
        return this.line > 0;
    }

    public get columnValid(): boolean {
        return this.column > 0;
    }

    public contains(pos: Position): boolean {
        return this.line <= pos.line && this.column >= pos.column;
    }
}

export class Span {
    #start: Position;
    #end: Position;

    public constructor(start: Position, end: Position) {
        this.#start = start;
        this.#end = end;
    }

    public get start(): Position {
        return this.#start;
    }

    public get end(): Position {
        return this.#end;
    }

    public set start(pos: Position) {
        if (pos.columnValid && pos.lineValid) {
            this.#start = pos;
        }
    }

    public set end(pos: Position) {
        if (pos.columnValid && pos.lineValid) {
            this.#end = pos;
        }
    }

    public contains(span: Span) {
        return this.start.contains(span.start) && this.end.contains(span.end);
    }
}