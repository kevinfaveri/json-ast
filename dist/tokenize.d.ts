import { JsonToken, ParseSettings } from "./types";
export declare enum JsonTokenTypes {
    COMMENT = "COMMENT",// // ... \n\r? or /* ... */
    LEFT_BRACE = "LEFT_BRACE",// {
    RIGHT_BRACE = "RIGHT_BRACE",// }
    LEFT_BRACKET = "LEFT_BRACKET",// [
    RIGHT_BRACKET = "RIGHT_BRACKET",// ]
    COLON = "COLON",//  :
    COMMA = "COMMA",// ,
    STRING = "STRING",//
    NUMBER = "NUMBER",//
    TRUE = "TRUE",// true
    FALSE = "FALSE",// false
    NULL = "NULL",// null
    IDENTIFIER = "IDENTIFIER"
}
export declare function tokenize(source: string, settings?: ParseSettings): JsonToken[];
