/**
 * Elrest eDesign Runtime IPC Typescript Model Runtime Client Configuration
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/protocol
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientConfiguration = void 0;
var ClientProtocol_1 = require("./ClientProtocol");
var ClientConfiguration = /** @class */ (function () {
    function ClientConfiguration(protocol, host, port, path) {
        if (protocol === void 0) { protocol = ClientProtocol_1.ClientProtocol.ws; }
        if (host === void 0) { host = ''; }
        if (port === void 0) { port = 82; }
        if (path === void 0) { path = '/'; }
        this.protocol = protocol;
        this.host = host;
        this.port = port;
        this.path = path;
    }
    return ClientConfiguration;
}());
exports.ClientConfiguration = ClientConfiguration;
