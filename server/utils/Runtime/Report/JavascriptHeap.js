/**
 * Elrest eDesign Runtime IPC Typescript Model Runtime
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavascriptHeap = void 0;
var JavascriptHeap = /** @class */ (function () {
    function JavascriptHeap(totalMemory, executableMemory, totalCommittedMemory, availableMemory, totalGlobalHandlesMemory, usedGlobalHandlesMemory, usedMemory, memoryLimit, mallocedMemory, externalMemory, peakMallocedMemory, nativeContextCount, detachedContextCount, doesZapGarbage) {
        this.totalMemory = totalMemory;
        this.executableMemory = executableMemory;
        this.totalCommittedMemory = totalCommittedMemory;
        this.availableMemory = availableMemory;
        this.totalGlobalHandlesMemory = totalGlobalHandlesMemory;
        this.usedGlobalHandlesMemory = usedGlobalHandlesMemory;
        this.usedMemory = usedMemory;
        this.memoryLimit = memoryLimit;
        this.mallocedMemory = mallocedMemory;
        this.externalMemory = externalMemory;
        this.peakMallocedMemory = peakMallocedMemory;
        this.nativeContextCount = nativeContextCount;
        this.detachedContextCount = detachedContextCount;
        this.doesZapGarbage = doesZapGarbage;
    }
    return JavascriptHeap;
}());
exports.JavascriptHeap = JavascriptHeap;
