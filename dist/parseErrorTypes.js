"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unexpectedToken = exports.unexpectedEnd = void 0;
function unexpectedEnd() {
    return "Unexpected end of JSON input";
}
exports.unexpectedEnd = unexpectedEnd;
function unexpectedToken(token, line, column) {
    return "Unexpected token <".concat(token, "> at ").concat(line, ":").concat(column);
}
exports.unexpectedToken = unexpectedToken;
