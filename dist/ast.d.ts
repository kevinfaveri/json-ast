import { JsonPosition } from "./position";
import { Visitor } from "./visitor";
export declare enum JsonNodeTypes {
    DOCUMENT = "document",
    COMMENT = "comment",
    OBJECT = "object",
    PROPERTY = "property",
    KEY = "key",
    ARRAY = "array",
    VALUE = "value",
    STRING = "string",
    NUMBER = "number",
    TRUE = "true",
    FALSE = "false",
    NULL = "null",
    ERROR = "error"
}
export interface IJsonNode {
    position: JsonPosition;
    type: JsonNodeTypes;
    accept(visitor: Visitor): void;
}
export interface IJsonValue extends IJsonNode {
    value: any;
    type: JsonNodeTypes;
}
export declare abstract class JsonNode implements IJsonNode {
    position: JsonPosition;
    readonly type: JsonNodeTypes;
    accept(visitor: Visitor): void;
}
export declare class JsonDocument extends JsonNode {
    child: any;
    readonly comments: JsonComment[];
    readonly type: JsonNodeTypes.DOCUMENT;
}
export declare class JsonObject extends JsonNode {
    readonly properties: JsonProperty[];
    readonly comments: JsonComment[];
    readonly type: JsonNodeTypes.OBJECT;
}
export declare class JsonProperty extends JsonNode {
    key: JsonKey;
    value: JsonValue;
    readonly type: JsonNodeTypes.PROPERTY;
}
export declare class JsonArray extends JsonNode {
    readonly items: any[];
    readonly comments: JsonComment[];
    readonly type: JsonNodeTypes.ARRAY;
}
export declare class JsonValue extends JsonNode implements IJsonValue {
    value: any;
    readonly type: JsonNodeTypes.VALUE;
    constructor(value?: any);
}
export declare class JsonKey extends JsonNode implements IJsonValue {
    value: string;
    readonly type: JsonNodeTypes.KEY;
    constructor(value?: string);
}
export declare class JsonComment extends JsonNode implements IJsonValue {
    value: string;
    readonly type: JsonNodeTypes.KEY;
    constructor(value?: string);
}
export declare class JsonString extends JsonNode implements IJsonValue {
    value: string;
    readonly type: JsonNodeTypes.STRING;
    constructor(value?: string);
}
export declare class JsonNumber extends JsonNode implements IJsonValue {
    value: number;
    readonly type: JsonNodeTypes.NUMBER;
    constructor(value?: number);
}
export declare class JsonTrue extends JsonNode implements IJsonValue {
    readonly value: true;
    readonly type: JsonNodeTypes.TRUE;
}
export declare class JsonFalse extends JsonNode implements IJsonValue {
    readonly value: false;
    readonly type: JsonNodeTypes.FALSE;
}
export declare class JsonNull extends JsonNode implements IJsonValue {
    readonly value: any;
    readonly type: JsonNodeTypes.NULL;
}
export type JsonNodeType = JsonDocument | JsonComment | JsonObject | JsonProperty | JsonKey | JsonArray | JsonValue | JsonString | JsonNumber | JsonTrue | JsonFalse | JsonNull;
export declare class NodeFactory {
    static fromType<T extends JsonNode>(objectType: JsonNodeTypes, _value?: any): T;
}
export declare function toObject<T extends Record<string, unknown>>(jsonNode: JsonNode): T;
export declare function toString(jsonNode: JsonNode): string;
export declare function toJSON<T>(jsonNode: JsonNodeType): T;
