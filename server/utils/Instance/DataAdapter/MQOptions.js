/**
 * Elrest eDesign Runtime IPC Typescript Model Instance Execution Mode
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQOptions = void 0;
var MQProtocol_1 = require("./MQProtocol");
var MQOptions = /** @class */ (function () {
    function MQOptions() {
        this.protocol = MQProtocol_1.MQProtocol.amqp;
        this.host = '127.0.0.1';
        this.port = 5672;
    }
    return MQOptions;
}());
exports.MQOptions = MQOptions;
