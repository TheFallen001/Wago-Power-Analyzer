"use strict";
/**
 * Elrest eDesign Runtime Library Messages Model Worker Module
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerExecutionOptions = void 0;
var ExecutionMode_1 = require("./ExecutionMode");
var ControllerExecutionOptions = /** @class */ (function () {
    function ControllerExecutionOptions() {
        this.mode = ExecutionMode_1.ExecutionMode.spawn;
        this.script = './node_modules/.bin/wdx-daemon';
        this.options = {
            stdio: 'ignore',
        };
    }
    return ControllerExecutionOptions;
}());
exports.ControllerExecutionOptions = ControllerExecutionOptions;
