/**
 * Elrest eDesign Runtime IPC Typescript Model Runtime
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.UvthreadResourceUsage = void 0;
var UvthreadResourceUsage = /** @class */ (function () {
    function UvthreadResourceUsage(userCpuSeconds, kernelCpuSeconds, cpuConsumptionPercent, userCpuConsumptionPercent, kernelCpuConsumptionPercent, fsActivity) {
        this.userCpuSeconds = userCpuSeconds;
        this.kernelCpuSeconds = kernelCpuSeconds;
        this.cpuConsumptionPercent = cpuConsumptionPercent;
        this.userCpuConsumptionPercent = userCpuConsumptionPercent;
        this.kernelCpuConsumptionPercent = kernelCpuConsumptionPercent;
        this.fsActivity = fsActivity;
    }
    return UvthreadResourceUsage;
}());
exports.UvthreadResourceUsage = UvthreadResourceUsage;
