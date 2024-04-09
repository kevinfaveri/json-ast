"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSON = exports.toString = exports.toObject = exports.NodeFactory = exports.JsonNull = exports.JsonFalse = exports.JsonTrue = exports.JsonNumber = exports.JsonString = exports.JsonComment = exports.JsonKey = exports.JsonValue = exports.JsonArray = exports.JsonProperty = exports.JsonObject = exports.JsonDocument = exports.JsonNode = exports.JsonNodeTypes = void 0;
var JsonNodeTypes;
(function (JsonNodeTypes) {
    JsonNodeTypes["DOCUMENT"] = "document";
    JsonNodeTypes["COMMENT"] = "comment";
    JsonNodeTypes["OBJECT"] = "object";
    JsonNodeTypes["PROPERTY"] = "property";
    JsonNodeTypes["KEY"] = "key";
    JsonNodeTypes["ARRAY"] = "array";
    JsonNodeTypes["VALUE"] = "value";
    JsonNodeTypes["STRING"] = "string";
    JsonNodeTypes["NUMBER"] = "number";
    JsonNodeTypes["TRUE"] = "true";
    JsonNodeTypes["FALSE"] = "false";
    JsonNodeTypes["NULL"] = "null";
    JsonNodeTypes["ERROR"] = "error";
})(JsonNodeTypes || (exports.JsonNodeTypes = JsonNodeTypes = {}));
// All elements in the tree will extend the `JsonNode` base class
var JsonNode = /** @class */ (function () {
    function JsonNode() {
        this.position = null;
        this.type = JsonNodeTypes.ERROR;
    }
    JsonNode.prototype.accept = function (visitor) {
        visitor.visit(this);
    };
    return JsonNode;
}());
exports.JsonNode = JsonNode;
var JsonDocument = /** @class */ (function (_super) {
    __extends(JsonDocument, _super);
    function JsonDocument() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.child = null;
        _this.comments = [];
        _this.type = JsonNodeTypes.DOCUMENT;
        return _this;
    }
    return JsonDocument;
}(JsonNode));
exports.JsonDocument = JsonDocument;
var JsonObject = /** @class */ (function (_super) {
    __extends(JsonObject, _super);
    function JsonObject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.properties = [];
        _this.comments = [];
        _this.type = JsonNodeTypes.OBJECT;
        return _this;
    }
    return JsonObject;
}(JsonNode));
exports.JsonObject = JsonObject;
var JsonProperty = /** @class */ (function (_super) {
    __extends(JsonProperty, _super);
    function JsonProperty() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.key = null;
        _this.value = null;
        _this.type = JsonNodeTypes.PROPERTY;
        return _this;
    }
    return JsonProperty;
}(JsonNode));
exports.JsonProperty = JsonProperty;
var JsonArray = /** @class */ (function (_super) {
    __extends(JsonArray, _super);
    function JsonArray() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.items = [];
        _this.comments = [];
        _this.type = JsonNodeTypes.ARRAY;
        return _this;
    }
    return JsonArray;
}(JsonNode));
exports.JsonArray = JsonArray;
var JsonValue = /** @class */ (function (_super) {
    __extends(JsonValue, _super);
    function JsonValue(value) {
        if (value === void 0) { value = null; }
        var _this = _super.call(this) || this;
        _this.value = value;
        _this.type = JsonNodeTypes.VALUE;
        return _this;
    }
    return JsonValue;
}(JsonNode));
exports.JsonValue = JsonValue;
var JsonKey = /** @class */ (function (_super) {
    __extends(JsonKey, _super);
    function JsonKey(value) {
        if (value === void 0) { value = null; }
        var _this = _super.call(this) || this;
        _this.value = value;
        _this.type = JsonNodeTypes.KEY;
        return _this;
    }
    return JsonKey;
}(JsonNode));
exports.JsonKey = JsonKey;
var JsonComment = /** @class */ (function (_super) {
    __extends(JsonComment, _super);
    function JsonComment(value) {
        if (value === void 0) { value = null; }
        var _this = _super.call(this) || this;
        _this.value = value;
        _this.type = JsonNodeTypes.KEY;
        return _this;
    }
    return JsonComment;
}(JsonNode));
exports.JsonComment = JsonComment;
var JsonString = /** @class */ (function (_super) {
    __extends(JsonString, _super);
    function JsonString(value) {
        if (value === void 0) { value = null; }
        var _this = _super.call(this) || this;
        _this.value = value;
        _this.type = JsonNodeTypes.STRING;
        return _this;
    }
    return JsonString;
}(JsonNode));
exports.JsonString = JsonString;
var JsonNumber = /** @class */ (function (_super) {
    __extends(JsonNumber, _super);
    function JsonNumber(value) {
        if (value === void 0) { value = null; }
        var _this = _super.call(this) || this;
        _this.value = value;
        _this.type = JsonNodeTypes.NUMBER;
        if (typeof value === "string") {
            _this.value = parseFloat(value);
        }
        return _this;
    }
    return JsonNumber;
}(JsonNode));
exports.JsonNumber = JsonNumber;
var JsonTrue = /** @class */ (function (_super) {
    __extends(JsonTrue, _super);
    function JsonTrue() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.value = true;
        _this.type = JsonNodeTypes.TRUE;
        return _this;
    }
    return JsonTrue;
}(JsonNode));
exports.JsonTrue = JsonTrue;
var JsonFalse = /** @class */ (function (_super) {
    __extends(JsonFalse, _super);
    function JsonFalse() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.value = false;
        _this.type = JsonNodeTypes.FALSE;
        return _this;
    }
    return JsonFalse;
}(JsonNode));
exports.JsonFalse = JsonFalse;
var JsonNull = /** @class */ (function (_super) {
    __extends(JsonNull, _super);
    function JsonNull() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.value = null;
        _this.type = JsonNodeTypes.NULL;
        return _this;
    }
    return JsonNull;
}(JsonNode));
exports.JsonNull = JsonNull;
var nodeTypeObjectMapping = (_a = {},
    _a[JsonNodeTypes.DOCUMENT] = JsonDocument,
    _a[JsonNodeTypes.COMMENT] = JsonComment,
    _a[JsonNodeTypes.OBJECT] = JsonObject,
    _a[JsonNodeTypes.PROPERTY] = JsonProperty,
    _a[JsonNodeTypes.KEY] = JsonKey,
    _a[JsonNodeTypes.ARRAY] = JsonArray,
    _a[JsonNodeTypes.VALUE] = JsonValue,
    _a[JsonNodeTypes.STRING] = JsonString,
    _a[JsonNodeTypes.NUMBER] = JsonNumber,
    _a[JsonNodeTypes.TRUE] = JsonTrue,
    _a[JsonNodeTypes.FALSE] = JsonFalse,
    _a[JsonNodeTypes.NULL] = JsonNull,
    _a);
//
// Utility methods to construct the objects
//
var NodeFactory = /** @class */ (function () {
    function NodeFactory() {
    }
    NodeFactory.fromType = function (objectType, _value) {
        if (_value === void 0) { _value = null; }
        var clazz = nodeTypeObjectMapping[objectType];
        if (clazz === null)
            throw new Error("AST node of type ".concat(objectType, " cannot be found"));
        return _value !== null ? new clazz(_value) : new clazz();
    };
    return NodeFactory;
}());
exports.NodeFactory = NodeFactory;
// Just a recursive, slow implementation to a JavaScript object from this
// JsonNode
function recursiveNodeConversion(rootNode) {
    var result = null;
    switch (rootNode.type) {
        case JsonNodeTypes.DOCUMENT:
            return recursiveNodeConversion(rootNode.child);
        case JsonNodeTypes.OBJECT: {
            result = {};
            rootNode.properties.forEach(function (propNode) {
                result[recursiveNodeConversion(propNode.key)] = recursiveNodeConversion(propNode.value);
            });
            return result;
        }
        case JsonNodeTypes.ARRAY: {
            result = [];
            rootNode.items.forEach(function (itemNode) {
                result.push(recursiveNodeConversion(itemNode));
            });
            return result;
        }
        case JsonNodeTypes.VALUE:
        case JsonNodeTypes.STRING:
        case JsonNodeTypes.KEY:
            return rootNode.value;
        case JsonNodeTypes.NUMBER: {
            if (typeof rootNode.value !== "number")
                return parseFloat(rootNode.value);
            return rootNode.value;
        }
        case JsonNodeTypes.TRUE:
            return true;
        case JsonNodeTypes.FALSE:
            return false;
        case JsonNodeTypes.NULL:
            return null;
        default:
            return undefined;
    }
}
function toObject(jsonNode) {
    return JSON.parse(JSON.stringify(jsonNode));
}
exports.toObject = toObject;
function toString(jsonNode) {
    return JSON.stringify(jsonNode);
}
exports.toString = toString;
function toJSON(jsonNode) {
    if (!(jsonNode instanceof JsonNode))
        throw new Error("JSON conversion only accepts a kind of JsonNode");
    return recursiveNodeConversion(jsonNode);
}
exports.toJSON = toJSON;
