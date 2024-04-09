"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitor = void 0;
var ast_1 = require("./ast");
// Do not export this function as it provides the main traversal of the AST
function traverseAST(visitor, node) {
    switch (node.type) {
        case ast_1.JsonNodeTypes.DOCUMENT: {
            visitor.document(node);
            if (node.comments) {
                node.comments.forEach(function (commentNode) {
                    visitor.comment(commentNode);
                });
            }
            if (node.child) {
                node.child.accept(visitor);
            }
            break;
        }
        case ast_1.JsonNodeTypes.OBJECT: {
            visitor.object(node);
            if (node.comments) {
                node.comments.forEach(function (commentNode) {
                    visitor.comment(commentNode);
                });
            }
            if (node.properties) {
                node.properties.forEach(function (propNode) {
                    propNode.accept(visitor);
                });
            }
            break;
        }
        case ast_1.JsonNodeTypes.PROPERTY: {
            visitor.property(node);
            node.key.accept(visitor);
            node.value.accept(visitor);
            break;
        }
        case ast_1.JsonNodeTypes.KEY: {
            visitor.key(node);
            break;
        }
        case ast_1.JsonNodeTypes.ARRAY: {
            visitor.array(node);
            if (visitor.stop)
                break;
            if (node.comments) {
                node.comments.forEach(function (commentNode) {
                    visitor.comment(commentNode);
                });
            }
            if (node.items) {
                node.items.forEach(function (itemNode) {
                    itemNode.accept(visitor);
                });
            }
            break;
        }
        case ast_1.JsonNodeTypes.STRING: {
            visitor.value(node);
            if (!visitor.stop)
                visitor.string(node);
            break;
        }
        case ast_1.JsonNodeTypes.NUMBER: {
            visitor.value(node);
            if (!visitor.stop)
                visitor.number(node);
            break;
        }
        case ast_1.JsonNodeTypes.TRUE: {
            visitor.value(node);
            if (!visitor.stop)
                visitor.boolean(node);
            break;
        }
        case ast_1.JsonNodeTypes.FALSE: {
            visitor.value(node);
            if (!visitor.stop)
                visitor.boolean(node);
            break;
        }
        case ast_1.JsonNodeTypes.NULL: {
            visitor.value(node);
            if (!visitor.stop)
                visitor.null(node);
            break;
        }
        default:
            break;
    }
}
var Visitor = /** @class */ (function () {
    function Visitor() {
        this.stop = false;
    }
    // Visit
    Visitor.prototype.visit = function (node) {
        // call to "private" function
        if (this.stop)
            return;
        traverseAST(this, node);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    Visitor.prototype.document = function (docNode) { };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    Visitor.prototype.object = function (objectNode) { };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    Visitor.prototype.property = function (propertyNode) { };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    Visitor.prototype.key = function (keyNode) { };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    Visitor.prototype.array = function (arrayNode) { };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    Visitor.prototype.value = function (valueNode) { };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    Visitor.prototype.comment = function (commentNode) { };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    Visitor.prototype.string = function (stringNode) { };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    Visitor.prototype.number = function (numberNode) { };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    Visitor.prototype.boolean = function (booleanNode) { };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    Visitor.prototype.null = function (nullNode) { };
    return Visitor;
}());
exports.Visitor = Visitor;
