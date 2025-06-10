"use strict";
/**
 * Elrest eDesign Runtime Library Messages Model Worker Module
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSSWorkspaceExecutionOptions = void 0;
var ExecutionMode_1 = require("./ExecutionMode");
var JSSWorkspaceExecutionOptions = /** @class */ (function () {
    function JSSWorkspaceExecutionOptions() {
        this.mode = ExecutionMode_1.ExecutionMode.worker;
        this.script = './node_modules/.bin/wdx-js-workspace';
    }
    return JSSWorkspaceExecutionOptions;
}());
exports.JSSWorkspaceExecutionOptions = JSSWorkspaceExecutionOptions;
