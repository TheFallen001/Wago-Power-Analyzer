/**
 * Elrest eDesign Runtime IPC Typescript Model Instance Execution Mode
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPCUAOptions = void 0;
var OPCUAProtocol_1 = require("./OPCUAProtocol");
var OPCUAOptions = /** @class */ (function () {
    function OPCUAOptions() {
        this.protocol = OPCUAProtocol_1.OPCUAProtocol.opctcp;
        this.host = '127.0.0.1';
        this.port = 49947;
    }
    return OPCUAOptions;
}());
exports.OPCUAOptions = OPCUAOptions;
