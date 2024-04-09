import { IJsonValue, JsonArray, JsonComment, JsonDocument, JsonFalse, JsonKey, JsonNode, JsonNodeType, JsonNull, JsonObject, JsonProperty, JsonString, JsonTrue } from "./ast";
export interface IVisit {
    document(docNode: JsonDocument): void;
    object(objectNode: JsonObject): void;
    property(propertyNode: JsonProperty): void;
    key(keyNode: JsonKey): void;
    array(arrayNode: JsonArray): void;
    value(valueNode: IJsonValue): void;
    comment(commentNode: JsonComment): void;
    string(stringNode: JsonString): void;
    number(numberNode: JsonNode): void;
    boolean(booleanNode: JsonTrue | JsonFalse): void;
    null(nullNode: JsonNull): void;
}
export declare abstract class Visitor implements IVisit {
    stop: boolean;
    visit(node: JsonNodeType): void;
    document(docNode: JsonDocument): void;
    object(objectNode: JsonObject): void;
    property(propertyNode: JsonProperty): void;
    key(keyNode: JsonKey): void;
    array(arrayNode: JsonArray): void;
    value(valueNode: IJsonValue): void;
    comment(commentNode: JsonComment): void;
    string(stringNode: JsonString): void;
    number(numberNode: JsonNode): void;
    boolean(booleanNode: JsonTrue | JsonFalse): void;
    null(nullNode: JsonNull): void;
}
