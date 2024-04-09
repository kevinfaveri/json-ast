"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonPosition = void 0;
var JsonPosition = /** @class */ (function () {
    function JsonPosition(startLine, startColumn, startChar, endLine, endColumn, endChar) {
        this.startLine = startLine;
        this.startColumn = startColumn;
        this.startChar = startChar;
        this.endLine = endLine;
        this.endColumn = endColumn;
        this.endChar = endChar;
    }
    Object.defineProperty(JsonPosition.prototype, "start", {
        get: function () {
            return {
                line: this.startLine,
                column: this.startColumn,
                char: this.startChar,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JsonPosition.prototype, "end", {
        get: function () {
            return { line: this.endLine, column: this.endColumn, char: this.endChar };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JsonPosition.prototype, "human", {
        get: function () {
            return "".concat(this.startLine, ":").concat(this.startColumn, " - ").concat(this.endLine, ":").concat(this.endColumn, " [").concat(this.startChar, ":").concat(this.endChar, "]");
        },
        enumerable: false,
        configurable: true
    });
    return JsonPosition;
}());
exports.JsonPosition = JsonPosition;
