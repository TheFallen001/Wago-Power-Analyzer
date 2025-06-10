/**
 * Elrest eDesign Runtime IPC Typescript Model Instance Execution Mode
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronOptions = void 0;
var CronOptions = /** @class */ (function () {
    function CronOptions(
    /**
     * Seconds 0-59
     */
    seconds, minutes, hours, dayOfTHeMonth, month, dayOfTheWeek, year) {
        this.seconds = seconds;
        this.minutes = minutes;
        this.hours = hours;
        this.dayOfTHeMonth = dayOfTHeMonth;
        this.month = month;
        this.dayOfTheWeek = dayOfTheWeek;
        this.year = year;
    }
    return CronOptions;
}());
exports.CronOptions = CronOptions;
