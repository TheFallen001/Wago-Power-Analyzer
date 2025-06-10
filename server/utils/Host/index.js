/**
 * Elrest eDesign Runtime Library Messages Model Host
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostStatus = exports.HostLog = exports.HostMonitor = void 0;
/**
 * eDesign Runtime Host Monitor
 *
 */
var HostMonitor = /** @class */ (function () {
    function HostMonitor(cpu, memory) {
        this.cpu = cpu;
        this.memory = memory;
    }
    return HostMonitor;
}());
exports.HostMonitor = HostMonitor;
/**
 * eDesign Runtime Host Monitor
 *
 */
var HostLog = /** @class */ (function () {
    function HostLog(message) {
        this.message = message;
    }
    return HostLog;
}());
exports.HostLog = HostLog;
/**
 * eDesign Runtime Host Status
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
 */
var HostStatus;
(function (HostStatus) {
    HostStatus["CONNECTING"] = "CONNECTING";
    HostStatus["OPEN"] = "OPEN";
    HostStatus["CLOSING"] = "CLOSING";
    HostStatus["CLOSED"] = "CLOSED";
})(HostStatus || (exports.HostStatus = HostStatus = {}));
