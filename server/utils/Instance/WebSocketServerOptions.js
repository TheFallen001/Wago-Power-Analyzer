/**
 * Elrest eDesign Runtime Library Messages Model Instance Application Module Web
 * Socket Server Application Controller
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServerOptions = void 0;
var WebSocketServerOptions = /** @class */ (function () {
    function WebSocketServerOptions(
    /**
     * @todo extend complete wss optons import {ServerOptions} from 'ws';
     */
    host, port, backlog, path, noServer, clientTracking, maxPayload, skipUTF8Validation) {
        this.host = host;
        this.port = port;
        this.backlog = backlog;
        this.path = path;
        this.noServer = noServer;
        this.clientTracking = clientTracking;
        this.maxPayload = maxPayload;
        this.skipUTF8Validation = skipUTF8Validation;
    }
    return WebSocketServerOptions;
}());
exports.WebSocketServerOptions = WebSocketServerOptions;
