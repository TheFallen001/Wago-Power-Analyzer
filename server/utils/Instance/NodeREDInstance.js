/**
 * Elrest eDesign Runtime Library Messages Model Instance Application Module
 * Alarming Application
 *
 *
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
'use strict';
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
exports.NodeREDInstance = void 0;
var Type_1 = require("./Type");
var Instance_1 = require("./Instance");
var NodeREDExecutionOptions_1 = require("./NodeREDExecutionOptions");
var NodeREDInstance = /** @class */ (function (_super) {
    __extends(NodeREDInstance, _super);
    function NodeREDInstance() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = Type_1.Type.NodeRED;
        _this.namespace = Type_1.Type.Controller;
        _this.executionOptions = new NodeREDExecutionOptions_1.NodeREDExecutionOptions();
        return _this;
    }
    return NodeREDInstance;
}(Instance_1.Instance));
exports.NodeREDInstance = NodeREDInstance;
