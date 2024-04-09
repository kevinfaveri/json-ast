interface PositionLocation {
    line: number;
    column: number;
    char: number;
}
export declare class JsonPosition {
    private readonly startLine;
    private readonly startColumn;
    private readonly startChar;
    private readonly endLine;
    private readonly endColumn;
    private readonly endChar;
    constructor(startLine: number, startColumn: number, startChar: number, endLine: number, endColumn: number, endChar: number);
    get start(): PositionLocation;
    get end(): PositionLocation;
    get human(): string;
}
export {};
