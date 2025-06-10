/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmHistory = void 0;
var AlarmHistory = /** @class */ (function () {
    function AlarmHistory(id, alarmId, name, active, number, type, status, cause, reaction, correction, createDateTime) {
        if (createDateTime === void 0) { createDateTime = Date.now(); }
        this.id = id;
        this.alarmId = alarmId;
        this.name = name;
        this.active = active;
        this.number = number;
        this.type = type;
        this.status = status;
        this.cause = cause;
        this.reaction = reaction;
        this.correction = correction;
        this.createDateTime = createDateTime;
    }
    return AlarmHistory;
}());
exports.AlarmHistory = AlarmHistory;
