"use strict";
/**
 * Elrest eDesign Runtime Library Messages Model Worker Module
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CC100IODataAdapterExecutionOptions = void 0;
var ExecutionMode_1 = require("../ExecutionMode");
var CC100IODataAdapterExecutionOptions = /** @class */ (function () {
    function CC100IODataAdapterExecutionOptions() {
        this.mode = ExecutionMode_1.ExecutionMode.worker;
        this.script = './node_modules/.bin/wdx-cc100-io';
    }
    return CC100IODataAdapterExecutionOptions;
}());
exports.CC100IODataAdapterExecutionOptions = CC100IODataAdapterExecutionOptions;
