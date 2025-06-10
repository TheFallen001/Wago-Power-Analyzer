/**
 * Elrest eDesign Runtime IPC Typescript Model Runtime
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceUsage = void 0;
var ResourceUsage = /** @class */ (function () {
    function ResourceUsage(rss, free_memory, total_memory, available_memory, maxRss, constrained_memory, userCpuSeconds, kernelCpuSeconds, cpuConsumptionPercent, userCpuConsumptionPercent, kernelCpuConsumptionPercent, pageFaults, fsActivity) {
        this.rss = rss;
        this.free_memory = free_memory;
        this.total_memory = total_memory;
        this.available_memory = available_memory;
        this.maxRss = maxRss;
        this.constrained_memory = constrained_memory;
        this.userCpuSeconds = userCpuSeconds;
        this.kernelCpuSeconds = kernelCpuSeconds;
        this.cpuConsumptionPercent = cpuConsumptionPercent;
        this.userCpuConsumptionPercent = userCpuConsumptionPercent;
        this.kernelCpuConsumptionPercent = kernelCpuConsumptionPercent;
        this.pageFaults = pageFaults;
        this.fsActivity = fsActivity;
    }
    return ResourceUsage;
}());
exports.ResourceUsage = ResourceUsage;
