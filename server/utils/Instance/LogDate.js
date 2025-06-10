/**
 * Elrest eDesign Runtime IPC Typescript Model Instance
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogDate = void 0;
var LogDate = /** @class */ (function () {
    function LogDate(timestamp, date, time, timezone) {
        this.timestamp = timestamp;
        this.date = date;
        this.time = time;
        this.timezone = timezone;
    }
    return LogDate;
}());
exports.LogDate = LogDate;
