"use strict";
/**
 * Elrest eDesign Runtime Library Messages Model Worker Module
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeREDExecutionOptions = void 0;
var ExecutionMode_1 = require("./ExecutionMode");
var NodeREDExecutionOptions = /** @class */ (function () {
    function NodeREDExecutionOptions() {
        this.mode = ExecutionMode_1.ExecutionMode.worker;
        this.script = './node_modules/.bin/wdx-node-red';
    }
    return NodeREDExecutionOptions;
}());
exports.NodeREDExecutionOptions = NodeREDExecutionOptions;
