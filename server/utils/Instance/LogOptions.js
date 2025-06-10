/**
 * Elrest eDesign Runtime IPC Typescript Model Instance Execution Mode
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogOptions = void 0;
var LogOptions = /** @class */ (function () {
    function LogOptions(level, channels, errorLogFile, outLogFile, mergeLog, mergeLogFile) {
        this.level = level;
        this.channels = channels;
        this.errorLogFile = errorLogFile;
        this.outLogFile = outLogFile;
        this.mergeLog = mergeLog;
        this.mergeLogFile = mergeLogFile;
    }
    return LogOptions;
}());
exports.LogOptions = LogOptions;
