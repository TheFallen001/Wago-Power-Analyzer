/**
 * Elrest eDesign Runtime IPC Typescript Model Runtime
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPU = void 0;
var CPU = /** @class */ (function () {
    function CPU(model, speed, user, nice, sys, idle, irq) {
        this.model = model;
        this.speed = speed;
        this.user = user;
        this.nice = nice;
        this.sys = sys;
        this.idle = idle;
        this.irq = irq;
    }
    return CPU;
}());
exports.CPU = CPU;
