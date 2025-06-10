/**
 * Elrest eDesign Runtime IPC Typescript Model Runtime
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
var Report = /** @class */ (function () {
    function Report(header, javascriptStack, nativeStack, javascriptHeap, resourceUsage, uvthreadResourceUsage, libuv, workers, environmentVariables, userLimits, sharedObjects) {
        this.header = header;
        this.javascriptStack = javascriptStack;
        this.nativeStack = nativeStack;
        this.javascriptHeap = javascriptHeap;
        this.resourceUsage = resourceUsage;
        this.uvthreadResourceUsage = uvthreadResourceUsage;
        this.libuv = libuv;
        this.workers = workers;
        this.environmentVariables = environmentVariables;
        this.userLimits = userLimits;
        this.sharedObjects = sharedObjects;
        this.instances = [];
    }
    return Report;
}());
exports.Report = Report;
