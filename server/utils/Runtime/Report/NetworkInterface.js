/**
 * Elrest eDesign Runtime IPC Typescript Model Runtime
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkInterface = void 0;
var NetworkInterface = /** @class */ (function () {
    function NetworkInterface(name, internal, mac, address, netmask, family) {
        this.name = name;
        this.internal = internal;
        this.mac = mac;
        this.address = address;
        this.netmask = netmask;
        this.family = family;
    }
    return NetworkInterface;
}());
exports.NetworkInterface = NetworkInterface;
