"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
var ast_1 = require("./ast");
var error_1 = require("./error");
var junker_1 = require("./junker");
var parseErrorTypes_1 = require("./parseErrorTypes");
var position_1 = require("./position");
var tokenize_1 = require("./tokenize");
// import util from 'util';
var objectStates = {
    _START_: 0,
    OPEN_OBJECT: 1,
    KEY: 2,
    COLON: 3,
    VALUE: 4,
    COMMA: 5,
};
var arrayStates = {
    _START_: 0,
    OPEN_ARRAY: 1,
    VALUE: 2,
    COMMA: 3,
};
var defaultSettings = {
    verbose: true,
    junker: false,
};
function parseValue(source, tokenList, index, settings) {
    // value: object | array | STRING | NUMBER | TRUE | FALSE | NULL | COMMENT
    var token = tokenList[index];
    var tokenType;
    switch (token.type) {
        case tokenize_1.JsonTokenTypes.STRING:
            tokenType = ast_1.JsonNodeTypes.STRING;
            break;
        case tokenize_1.JsonTokenTypes.NUMBER:
            tokenType = ast_1.JsonNodeTypes.NUMBER;
            break;
        case tokenize_1.JsonTokenTypes.TRUE:
            tokenType = ast_1.JsonNodeTypes.TRUE;
            break;
        case tokenize_1.JsonTokenTypes.FALSE:
            tokenType = ast_1.JsonNodeTypes.FALSE;
            break;
        case tokenize_1.JsonTokenTypes.NULL:
            tokenType = ast_1.JsonNodeTypes.NULL;
            break;
        case tokenize_1.JsonTokenTypes.COMMENT:
            tokenType = ast_1.JsonNodeTypes.COMMENT;
            break;
        default:
            break;
    }
    if (tokenType) {
        index++;
        var value = ast_1.NodeFactory.fromType(tokenType, token.value);
        if (settings.verbose) {
            value.position = token.position;
        }
        return { value: value, index: index };
    }
    else {
        var objectOrValue = 
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        parseObject(source, tokenList, index, settings) || parseArray(source, tokenList, index, settings);
        if (objectOrValue) {
            return objectOrValue;
        }
        else {
            (0, error_1.error)((0, parseErrorTypes_1.unexpectedToken)(source.substring(token.position.start.char, token.position.end.char), token.position.start.line, token.position.start.column), source, token.position.start.line, token.position.start.column);
        }
    }
}
function parseObject(source, tokenList, index, settings) {
    var startToken;
    var property;
    var object = ast_1.NodeFactory.fromType(ast_1.JsonNodeTypes.OBJECT);
    var state = objectStates._START_;
    var token;
    while (index < tokenList.length) {
        token = tokenList[index];
        if (token.type === tokenize_1.JsonTokenTypes.COMMENT) {
            var comment = ast_1.NodeFactory.fromType(ast_1.JsonNodeTypes.COMMENT, token.value);
            if (settings.verbose) {
                comment.position = token.position;
            }
            object.comments.push(comment);
            index++;
            continue;
        }
        switch (state) {
            case objectStates._START_:
                if (token.type === tokenize_1.JsonTokenTypes.LEFT_BRACE) {
                    startToken = token;
                    state = objectStates.OPEN_OBJECT;
                    index++;
                }
                else {
                    return null;
                }
                break;
            case objectStates.OPEN_OBJECT:
                if (token.type === tokenize_1.JsonTokenTypes.STRING) {
                    property = ast_1.NodeFactory.fromType(ast_1.JsonNodeTypes.PROPERTY);
                    property.key = ast_1.NodeFactory.fromType(ast_1.JsonNodeTypes.KEY, token.value);
                    if (settings.verbose) {
                        property.key.position = token.position;
                    }
                    state = objectStates.KEY;
                    index++;
                }
                else if (token.type === tokenize_1.JsonTokenTypes.RIGHT_BRACE) {
                    if (settings.verbose) {
                        object.position = new position_1.JsonPosition(startToken.position.start.line, startToken.position.start.column, startToken.position.start.char, token.position.end.line, token.position.end.column, token.position.end.char);
                    }
                    index++;
                    return { value: object, index: index };
                }
                else {
                    (0, error_1.error)((0, parseErrorTypes_1.unexpectedToken)(source.substring(token.position.start.char, token.position.end.char), token.position.start.line, token.position.start.column), source, token.position.start.line, token.position.start.column);
                }
                break;
            case objectStates.KEY:
                if (token.type === tokenize_1.JsonTokenTypes.COLON) {
                    state = objectStates.COLON;
                    index++;
                }
                else {
                    (0, error_1.error)((0, parseErrorTypes_1.unexpectedToken)(source.substring(token.position.start.char, token.position.end.char), token.position.start.line, token.position.start.column), source, token.position.start.line, token.position.start.column);
                }
                break;
            case objectStates.COLON:
                var value = parseValue(source, tokenList, index, settings);
                index = value.index;
                property.value = value.value;
                object.properties.push(property);
                state = objectStates.VALUE;
                break;
            case objectStates.VALUE:
                if (token.type === tokenize_1.JsonTokenTypes.RIGHT_BRACE) {
                    if (settings.verbose) {
                        object.position = new position_1.JsonPosition(startToken.position.start.line, startToken.position.start.column, startToken.position.start.char, token.position.end.line, token.position.end.column, token.position.end.char);
                    }
                    index++;
                    return { value: object, index: index };
                }
                else if (token.type === tokenize_1.JsonTokenTypes.COMMA) {
                    state = objectStates.COMMA;
                    index++;
                }
                else {
                    (0, error_1.error)((0, parseErrorTypes_1.unexpectedToken)(source.substring(token.position.start.char, token.position.end.char), token.position.start.line, token.position.start.column), source, token.position.start.line, token.position.start.column);
                }
                break;
            case objectStates.COMMA:
                if (token.type === tokenize_1.JsonTokenTypes.STRING) {
                    property = ast_1.NodeFactory.fromType(ast_1.JsonNodeTypes.PROPERTY);
                    property.key = ast_1.NodeFactory.fromType(ast_1.JsonNodeTypes.KEY, token.value);
                    if (settings.verbose) {
                        property.key.position = token.position;
                    }
                    state = objectStates.KEY;
                    index++;
                }
                else if (token.type === tokenize_1.JsonTokenTypes.COMMA || token.type === tokenize_1.JsonTokenTypes.RIGHT_BRACE) {
                    // Allow trailing commas
                    state = objectStates.VALUE;
                    // index++;
                    continue;
                }
                else {
                    (0, error_1.error)((0, parseErrorTypes_1.unexpectedToken)(source.substring(token.position.start.char, token.position.end.char), token.position.start.line, token.position.start.column), source, token.position.start.line, token.position.start.column);
                }
                break;
        }
    }
    (0, error_1.error)((0, parseErrorTypes_1.unexpectedEnd)());
}
function parseArray(source, tokenList, index, settings) {
    var startToken;
    var array = ast_1.NodeFactory.fromType(ast_1.JsonNodeTypes.ARRAY);
    var state = arrayStates._START_;
    var token;
    while (index < tokenList.length) {
        token = tokenList[index];
        if (token.type === tokenize_1.JsonTokenTypes.COMMENT) {
            var comment = ast_1.NodeFactory.fromType(ast_1.JsonNodeTypes.COMMENT, token.value);
            if (settings.verbose) {
                comment.position = token.position;
            }
            array.comments.push(comment);
            index++;
            continue;
        }
        switch (state) {
            case arrayStates._START_:
                if (token.type === tokenize_1.JsonTokenTypes.LEFT_BRACKET) {
                    startToken = token;
                    state = arrayStates.OPEN_ARRAY;
                    index++;
                }
                else {
                    return null;
                }
                break;
            case arrayStates.OPEN_ARRAY:
                if (token.type === tokenize_1.JsonTokenTypes.RIGHT_BRACKET) {
                    if (settings.verbose) {
                        array.position = new position_1.JsonPosition(startToken.position.start.line, startToken.position.start.column, startToken.position.start.char, token.position.end.line, token.position.end.column, token.position.end.char);
                    }
                    index++;
                    return { value: array, index: index };
                }
                else {
                    var value_1 = parseValue(source, tokenList, index, settings);
                    index = value_1.index;
                    array.items.push(value_1.value);
                    state = arrayStates.VALUE;
                }
                break;
            case arrayStates.VALUE:
                if (token.type === tokenize_1.JsonTokenTypes.RIGHT_BRACKET) {
                    if (settings.verbose) {
                        array.position = new position_1.JsonPosition(startToken.position.start.line, startToken.position.start.column, startToken.position.start.char, token.position.end.line, token.position.end.column, token.position.end.char);
                    }
                    index++;
                    return { value: array, index: index };
                }
                else if (token.type === tokenize_1.JsonTokenTypes.COMMA) {
                    state = arrayStates.COMMA;
                    index++;
                }
                else {
                    (0, error_1.error)((0, parseErrorTypes_1.unexpectedToken)(source.substring(token.position.start.char, token.position.end.char), token.position.start.line, token.position.start.column), source, token.position.start.line, token.position.start.column);
                }
                break;
            case arrayStates.COMMA:
                // Allow for trailing commas and too many commas
                if (token.type === tokenize_1.JsonTokenTypes.COMMA || token.type === tokenize_1.JsonTokenTypes.RIGHT_BRACKET) {
                    state = arrayStates.VALUE;
                    continue;
                }
                var value = parseValue(source, tokenList, index, settings);
                index = value.index;
                array.items.push(value.value);
                state = arrayStates.VALUE;
                break;
        }
    }
    (0, error_1.error)((0, parseErrorTypes_1.unexpectedEnd)());
}
function parseDocument(source, tokenList, index, settings) {
    // value | COMMENT*
    var token = tokenList[index];
    var tokenType = token.type;
    var doc = ast_1.NodeFactory.fromType(ast_1.JsonNodeTypes.DOCUMENT);
    while (tokenType === tokenize_1.JsonTokenTypes.COMMENT) {
        var comment = ast_1.NodeFactory.fromType(ast_1.JsonNodeTypes.COMMENT, token.value);
        if (settings.verbose) {
            comment.position = token.position;
        }
        doc.comments.push(comment);
        index++;
        token = tokenList[index];
        tokenType = token.type;
    }
    doc.child = parseValue(source, tokenList, index, settings);
    if (doc.child.index !== tokenList.length) {
        index = doc.child.index;
        while (index < tokenList.length && tokenList[index].type === tokenize_1.JsonTokenTypes.COMMENT) {
            token = tokenList[index];
            tokenType = token.type;
            doc.child.index = index;
            var comment = ast_1.NodeFactory.fromType(ast_1.JsonNodeTypes.COMMENT, token.value);
            if (settings.verbose) {
                comment.position = token.position;
            }
            doc.comments.push(comment);
            index++;
        }
        doc.child.index = index;
    }
    var final_index = doc.child.index;
    if (!(doc.child instanceof ast_1.JsonNode) && doc.child.value) {
        doc.child = doc.child.value;
    }
    return { value: doc, index: final_index };
}
function parse(source, settings) {
    settings = Object.assign({}, defaultSettings, settings);
    var tokenList = (0, tokenize_1.tokenize)(source, settings);
    if (tokenList.length === 0) {
        (0, error_1.error)((0, parseErrorTypes_1.unexpectedEnd)());
    }
    if (settings.junker === true) {
        tokenList = (0, junker_1.junker)(tokenList, settings);
    }
    var value = parseDocument(source, tokenList, 0, settings);
    if (value.index === tokenList.length || settings.junker === true) {
        return value.value;
    }
    else {
        var token = tokenList[value.index];
        (0, error_1.error)((0, parseErrorTypes_1.unexpectedToken)(source.substring(token.position.start.char, token.position.end.char), token.position.start.line, token.position.start.column), source, token.position.start.line, token.position.start.column);
    }
}
exports.parse = parse;
