/**
 * Elrest eDesign Runtime IPC Typescript Model Instance Execution Mode
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTTOptions = void 0;
var MQTTProtocol_1 = require("./MQTTProtocol");
var MQTTOptions = /** @class */ (function () {
    function MQTTOptions() {
        this.protocol = MQTTProtocol_1.MQTTProtocol.ws;
        this.port = 1883;
    }
    return MQTTOptions;
}());
exports.MQTTOptions = MQTTOptions;
