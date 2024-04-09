"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cannotTokenizeSymbol = void 0;
function cannotTokenizeSymbol(symbol, line, column) {
    return "Cannot tokenize symbol <".concat(symbol, "> at ").concat(line, ":").concat(column);
}
exports.cannotTokenizeSymbol = cannotTokenizeSymbol;
