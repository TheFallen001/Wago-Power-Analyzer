"use strict";
/**
 * Elrest eDesign Runtime Library Messages Model Worker Module
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIServerExecutionOptions = void 0;
var ExecutionMode_1 = require("./ExecutionMode");
var APIServerExecutionOptions = /** @class */ (function () {
    function APIServerExecutionOptions() {
        this.mode = ExecutionMode_1.ExecutionMode.worker;
        this.script = './node_modules/.bin/wdx-api';
    }
    return APIServerExecutionOptions;
}());
exports.APIServerExecutionOptions = APIServerExecutionOptions;
