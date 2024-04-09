"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.JsonTokenTypes = void 0;
var error_1 = require("./error");
var position_1 = require("./position");
var tokenizeErrorTypes_1 = require("./tokenizeErrorTypes");
var JsonTokenTypes;
(function (JsonTokenTypes) {
    JsonTokenTypes["COMMENT"] = "COMMENT";
    JsonTokenTypes["LEFT_BRACE"] = "LEFT_BRACE";
    JsonTokenTypes["RIGHT_BRACE"] = "RIGHT_BRACE";
    JsonTokenTypes["LEFT_BRACKET"] = "LEFT_BRACKET";
    JsonTokenTypes["RIGHT_BRACKET"] = "RIGHT_BRACKET";
    JsonTokenTypes["COLON"] = "COLON";
    JsonTokenTypes["COMMA"] = "COMMA";
    JsonTokenTypes["STRING"] = "STRING";
    JsonTokenTypes["NUMBER"] = "NUMBER";
    JsonTokenTypes["TRUE"] = "TRUE";
    JsonTokenTypes["FALSE"] = "FALSE";
    JsonTokenTypes["NULL"] = "NULL";
    JsonTokenTypes["IDENTIFIER"] = "IDENTIFIER";
})(JsonTokenTypes || (exports.JsonTokenTypes = JsonTokenTypes = {}));
var charTokens = {
    "{": JsonTokenTypes.LEFT_BRACE,
    "}": JsonTokenTypes.RIGHT_BRACE,
    "[": JsonTokenTypes.LEFT_BRACKET,
    "]": JsonTokenTypes.RIGHT_BRACKET,
    ":": JsonTokenTypes.COLON,
    ",": JsonTokenTypes.COMMA,
};
var keywordsTokens = {
    true: JsonTokenTypes.TRUE,
    false: JsonTokenTypes.FALSE,
    null: JsonTokenTypes.NULL,
};
var stringStates = {
    _START_: 0,
    START_QUOTE_OR_CHAR: 1,
    ESCAPE: 2,
};
var escapes = {
    '"': 0, // Quotation mask
    "\\": 1, // Reverse solidus
    "/": 2, // Solidus
    b: 3, // Backspace
    f: 4, // Form feed
    n: 5, // New line
    r: 6, // Carriage return
    t: 7, // Horizontal tab
    u: 8, // 4 hexadecimal digits
};
// Support regex
["d", "D", "w", "W", "s", "S"].forEach(function (d, i) {
    escapes[d] = i;
});
var numberStates = {
    _START_: 0,
    MINUS: 1,
    ZERO: 2,
    DIGIT: 3,
    POINT: 4,
    DIGIT_FRACTION: 5,
    EXP: 6,
    EXP_DIGIT_OR_SIGN: 7,
};
// HELPERS
function isDigit1to9(char) {
    return char >= "1" && char <= "9";
}
function isDigit(char) {
    return char >= "0" && char <= "9";
}
function isLetter(char) {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
}
function isHex(char) {
    return isDigit(char) || (char >= "a" && char <= "f") || (char >= "A" && char <= "F");
}
function isExp(char) {
    return char === "e" || char === "E";
}
// PARSERS
function parseWhitespace(source, index, line, column) {
    var char = source.charAt(index);
    if (char === "\r") {
        // CR (Unix)
        index++;
        line++;
        column = 1;
        if (source.charAt(index) === "\n") {
            // CRLF (Windows)
            index++;
        }
    }
    else if (char === "\n") {
        // LF (MacOS)
        index++;
        line++;
        column = 1;
    }
    else if (char === "\t" || char === " ") {
        index++;
        column++;
    }
    else {
        return null;
    }
    return { index: index, line: line, column: column };
}
function parseComment(source, index, line, column) {
    var sourceLength = source.length;
    var char = source.charAt(index);
    if (char === "/") {
        var next_char = source.charAt(index + 1) || "";
        if ("/" === next_char) {
            // Unroll until the end of the line
            var first_index = index + 2;
            var last_index = index + 2;
            index += 2;
            while (index < sourceLength) {
                char = source.charAt(index);
                if (char === "\r") {
                    last_index = index;
                    index++;
                    line++;
                    column = 1;
                    if (source.charAt(index + 1) === "\n") {
                        // CR LF
                        last_index = index;
                        index++;
                    }
                    break;
                }
                else if (char === "\n") {
                    last_index = index;
                    index++;
                    line++;
                    column = 1;
                    break;
                }
                else {
                    index++;
                }
            }
            if (index >= sourceLength) {
                last_index = sourceLength;
            }
            return {
                type: JsonTokenTypes.COMMENT,
                value: source.substring(first_index, last_index).replace(/(\r\n|\n|\r)/gm, ""),
                index: index,
                line: line,
                column: column,
            };
        }
        else if ("*" === next_char) {
            // unroll until we find */
            var first_index = index + 2;
            var last_index = index + 2;
            index += 2;
            while (index < sourceLength) {
                char = source.charAt(index);
                if (char !== "*") {
                    if (char === "\r") {
                        next_char = source.charAt(index + 1) || "";
                        line++;
                        column = 1;
                        if (next_char === "\n") {
                            index++;
                        }
                    }
                    else if (char === "\n") {
                        line++;
                        column = 1;
                    }
                }
                else {
                    next_char = source.charAt(index + 1) || "";
                    if ("/" === next_char) {
                        last_index = index;
                        if (last_index >= sourceLength) {
                            last_index = sourceLength;
                        }
                        return {
                            type: JsonTokenTypes.COMMENT,
                            value: source.substring(first_index, last_index),
                            index: index + 2,
                            line: line,
                            column: column,
                        };
                    }
                }
                index++;
            }
        }
    }
    else {
        return null;
    }
}
function parseChar(source, index, line, column) {
    var char = source.charAt(index);
    if (char in charTokens) {
        return {
            type: charTokens[char],
            line: line,
            column: column + 1,
            index: index + 1,
            value: undefined,
        };
    }
    else {
        return null;
    }
}
function parseKeyword(source, index, line, column) {
    var matched = Object.keys(keywordsTokens).find(function (name) { return name === source.substr(index, name.length); });
    if (matched) {
        return {
            type: keywordsTokens[matched],
            line: line,
            column: column + matched.length,
            index: index + matched.length,
            value: null,
        };
    }
    else {
        return null;
    }
}
function parseIdentifier(source, index, line, column) {
    var sourceLength = source.length;
    var startIndex = index;
    var buffer = "";
    // Must start with a letter or underscore
    var firstChar = source.charAt(index);
    if (!(isLetter(firstChar) || firstChar === "_"))
        return null;
    while (index < sourceLength) {
        var char = source.charAt(index);
        if (!(isLetter(char) || char === "_" || isDigit(char)))
            break;
        buffer += char;
        index++;
    }
    if (buffer.length > 0) {
        return {
            type: JsonTokenTypes.IDENTIFIER,
            line: line,
            column: column + index - startIndex,
            index: index,
            value: buffer,
        };
    }
    else {
        return null;
    }
}
function parseString(source, index, line, column) {
    var sourceLength = source.length;
    var startIndex = index;
    var buffer = "";
    var state = stringStates._START_;
    while (index < sourceLength) {
        var char = source.charAt(index);
        switch (state) {
            case stringStates._START_:
                if (char === '"') {
                    state = stringStates.START_QUOTE_OR_CHAR;
                    index++;
                }
                else {
                    return null;
                }
                break;
            case stringStates.START_QUOTE_OR_CHAR:
                if (char === "\\") {
                    state = stringStates.ESCAPE;
                    buffer += char;
                    index++;
                }
                else if (char === '"') {
                    index++;
                    return {
                        type: JsonTokenTypes.STRING,
                        value: buffer,
                        line: line,
                        index: index,
                        column: column + index - startIndex,
                    };
                }
                else {
                    buffer += char;
                    index++;
                }
                break;
            case stringStates.ESCAPE:
                if (char in escapes) {
                    buffer += char;
                    index++;
                    if (char === "u") {
                        for (var i = 0; i < 4; i++) {
                            var curChar = source.charAt(index);
                            if (curChar && isHex(curChar)) {
                                buffer += curChar;
                                index++;
                            }
                            else {
                                return null;
                            }
                        }
                    }
                    state = stringStates.START_QUOTE_OR_CHAR;
                }
                else {
                    return null;
                }
                break;
        }
    }
}
function parseNumber(source, index, line, column) {
    var sourceLength = source.length;
    var startIndex = index;
    var passedValueIndex = index;
    var state = numberStates._START_;
    iterator: while (index < sourceLength) {
        var char = source.charAt(index);
        switch (state) {
            case numberStates._START_:
                if (char === "-") {
                    state = numberStates.MINUS;
                }
                else if (char === "0") {
                    passedValueIndex = index + 1;
                    state = numberStates.ZERO;
                }
                else if (isDigit1to9(char)) {
                    passedValueIndex = index + 1;
                    state = numberStates.DIGIT;
                }
                else {
                    return null;
                }
                break;
            case numberStates.MINUS:
                if (char === "0") {
                    passedValueIndex = index + 1;
                    state = numberStates.ZERO;
                }
                else if (isDigit1to9(char)) {
                    passedValueIndex = index + 1;
                    state = numberStates.DIGIT;
                }
                else {
                    return null;
                }
                break;
            case numberStates.ZERO:
                if (char === ".") {
                    state = numberStates.POINT;
                }
                else if (isExp(char)) {
                    state = numberStates.EXP;
                }
                else {
                    break iterator;
                }
                break;
            case numberStates.DIGIT:
                if (isDigit(char)) {
                    passedValueIndex = index + 1;
                }
                else if (char === ".") {
                    state = numberStates.POINT;
                }
                else if (isExp(char)) {
                    state = numberStates.EXP;
                }
                else {
                    break iterator;
                }
                break;
            case numberStates.POINT:
                if (isDigit(char)) {
                    passedValueIndex = index + 1;
                    state = numberStates.DIGIT_FRACTION;
                }
                else {
                    break iterator;
                }
                break;
            case numberStates.DIGIT_FRACTION:
                if (isDigit(char)) {
                    passedValueIndex = index + 1;
                }
                else if (isExp(char)) {
                    state = numberStates.EXP;
                }
                else {
                    break iterator;
                }
                break;
            case numberStates.EXP:
                if (char === "+" || char === "-") {
                    state = numberStates.EXP_DIGIT_OR_SIGN;
                }
                else if (isDigit(char)) {
                    passedValueIndex = index + 1;
                    state = numberStates.EXP_DIGIT_OR_SIGN;
                }
                else {
                    break iterator;
                }
                break;
            case numberStates.EXP_DIGIT_OR_SIGN:
                if (isDigit(char)) {
                    passedValueIndex = index + 1;
                }
                else {
                    break iterator;
                }
                break;
        }
        index++;
    }
    if (passedValueIndex > 0) {
        return {
            type: JsonTokenTypes.NUMBER,
            value: source.substring(startIndex, passedValueIndex),
            line: line,
            index: passedValueIndex,
            column: column + passedValueIndex - startIndex,
        };
    }
    else {
        return null;
    }
}
var defaultSettings = {
    verbose: true,
};
function tokenize(source, settings) {
    settings = Object.assign({}, defaultSettings, settings);
    var line = 1;
    var column = 1;
    var index = 0;
    var tokens = [];
    var sourceLength = source.length;
    while (index < sourceLength) {
        var whitespace = parseWhitespace(source, index, line, column);
        if (whitespace) {
            index = whitespace.index;
            line = whitespace.line;
            column = whitespace.column;
            continue;
        }
        var matched = parseComment(source, index, line, column) ||
            parseChar(source, index, line, column) ||
            parseKeyword(source, index, line, column) ||
            parseIdentifier(source, index, line, column) ||
            parseString(source, index, line, column) ||
            parseNumber(source, index, line, column);
        if (matched) {
            var token = { type: matched.type, value: matched.value };
            if (settings.verbose) {
                token.position = new position_1.JsonPosition(line, column, index, matched.line, matched.column, matched.index);
            }
            tokens.push(token);
            index = matched.index;
            line = matched.line;
            column = matched.column;
        }
        else {
            (0, error_1.error)((0, tokenizeErrorTypes_1.cannotTokenizeSymbol)(source.charAt(index), line, column), source, line, column);
        }
    }
    return tokens;
}
exports.tokenize = tokenize;
