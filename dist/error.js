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
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = void 0;
function showCodeFragment(source, linePosition, columnPosition) {
    var lines = source.split(/\n|\r\n?|\f/);
    var line = lines[linePosition - 1];
    var marker = new Array(columnPosition).join(" ") + "^";
    return "".concat(line, "\n").concat(marker);
}
var ParseError = /** @class */ (function (_super) {
    __extends(ParseError, _super);
    function ParseError(message, source, linePosition, columnPosition) {
        var _this = this;
        var fullMessage = linePosition
            ? message + "\n" + showCodeFragment(source, linePosition, columnPosition)
            : message;
        _this = _super.call(this, fullMessage) || this;
        _this.message = message;
        return _this;
    }
    return ParseError;
}(SyntaxError));
function error(message, source, line, column) {
    throw new ParseError(message, source, line, column);
}
exports.error = error;
