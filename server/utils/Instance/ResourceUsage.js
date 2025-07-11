/**
 * Elrest eDesign Runtime IPC Typescript Model Instance
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceUsage = void 0;
var ResourceUsage = /** @class */ (function () {
    function ResourceUsage(free_memory, total_memory, rss, available_memory, userCpuSeconds, kernelCpuSeconds, cpuConsumptionPercent, userCpuConsumptionPercent, kernelCpuConsumptionPercent, maxRss) {
        this.free_memory = free_memory;
        this.total_memory = total_memory;
        this.rss = rss;
        this.available_memory = available_memory;
        this.userCpuSeconds = userCpuSeconds;
        this.kernelCpuSeconds = kernelCpuSeconds;
        this.cpuConsumptionPercent = cpuConsumptionPercent;
        this.userCpuConsumptionPercent = userCpuConsumptionPercent;
        this.kernelCpuConsumptionPercent = kernelCpuConsumptionPercent;
        this.maxRss = maxRss;
    }
    return ResourceUsage;
}());
exports.ResourceUsage = ResourceUsage;
