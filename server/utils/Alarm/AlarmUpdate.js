/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmUpdate = void 0;
var AlarmCondition_1 = require("./AlarmCondition");
var AlarmUpdate = /** @class */ (function () {
    function AlarmUpdate(id, name, active, message, messageOff, number, type, status, cause, reaction, correction, createDateTime, updatedDateTime, conditions) {
        if (active === void 0) { active = true; }
        if (createDateTime === void 0) { createDateTime = Date.now(); }
        if (updatedDateTime === void 0) { updatedDateTime = createDateTime; }
        if (conditions === void 0) { conditions = [
            new AlarmCondition_1.AlarmCondition(),
        ]; }
        this.id = id;
        this.name = name;
        this.active = active;
        this.message = message;
        this.messageOff = messageOff;
        this.number = number;
        this.type = type;
        this.status = status;
        this.cause = cause;
        this.reaction = reaction;
        this.correction = correction;
        this.createDateTime = createDateTime;
        this.updatedDateTime = updatedDateTime;
        this.conditions = conditions;
    }
    return AlarmUpdate;
}());
exports.AlarmUpdate = AlarmUpdate;
