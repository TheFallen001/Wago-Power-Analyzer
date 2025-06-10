/**
 * Elrest eDesign Runtime IPC Typescript Model Instance Execution Mode
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.eWebOptions = void 0;
var WSProtocol_1 = require("../WSProtocol");
var eWebOptions = /** @class */ (function () {
    function eWebOptions() {
        this.protocol = WSProtocol_1.WSProtocol.ws;
        this.host = '127.0.0.1';
        this.port = 82;
        this.path = 'ElrestWS50';
        this.username = 'Administrator';
        this.password = '';
        this.reconnectTimeout = 10000;
    }
    return eWebOptions;
}());
exports.eWebOptions = eWebOptions;
