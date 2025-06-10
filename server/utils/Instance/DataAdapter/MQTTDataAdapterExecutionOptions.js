"use strict";
/**
 * Elrest eDesign Runtime Library Messages Model Worker Module
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTTDataAdapterExecutionOptions = void 0;
var ExecutionMode_1 = require("../ExecutionMode");
var MQTTDataAdapterExecutionOptions = /** @class */ (function () {
    function MQTTDataAdapterExecutionOptions() {
        this.mode = ExecutionMode_1.ExecutionMode.worker;
        this.script = './node_modules/.bin/wdx-mqtt';
    }
    return MQTTDataAdapterExecutionOptions;
}());
exports.MQTTDataAdapterExecutionOptions = MQTTDataAdapterExecutionOptions;
